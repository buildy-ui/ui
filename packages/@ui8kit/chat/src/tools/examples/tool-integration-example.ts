import {
  AIClient,
  toolManager,
  WebSearchTool,
  DatabaseQueryTool,
  FileSystemTool,
  type Message,
  type ToolCall
} from '../../index';

/**
 * Complete example of tool integration with AI chat
 */
export class ToolIntegratedChat {
  private client: AIClient;
  private systemPrompt: string;

  constructor(providerConfig: any) {
    this.client = new AIClient(providerConfig);

    // Register tools
    this.registerTools();

    // Enhanced system prompt for tool usage
    this.systemPrompt = `You are an intelligent assistant with access to various tools.

Available tools:
- web_search: Search the internet for current information
- execute_query: Run SQL queries on databases
- file_operation: Read and write files

Guidelines:
1. Use tools when you need external information or data
2. Always explain what you're doing before using a tool
3. Provide clear, actionable results
4. Ask for clarification if parameters are unclear

When using tools:
- Choose the most appropriate tool for the task
- Provide clear parameters
- Explain the results in context`;
  }

  /**
   * Register all available tools
   */
  private registerTools(): void {
    // Web search tool
    const webSearchTool = new WebSearchTool();
    toolManager.registerTool(webSearchTool);

    // Database query tool
    const dbTool = new DatabaseQueryTool();
    toolManager.registerTool(dbTool);

    // File system tool (with restricted paths)
    const fsTool = new FileSystemTool({
      allowedPaths: ['./data', './temp'],
      maxFileSize: 1024 * 1024 // 1MB
    });
    toolManager.registerTool(fsTool);
  }

  /**
   * Send a message with tool integration
   */
  async sendMessage(
    userMessage: string,
    conversationHistory: Message[] = []
  ): Promise<{
    response: Message;
    toolCalls: ToolCall[];
    toolResults: Message[];
  }> {
    // Build conversation with system prompt
    const messages: Message[] = [
      { role: 'system', content: this.systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ];

    // Get available tools for AI
    const tools = toolManager.getToolsForAI();

    try {
      // First AI call with tools
      const aiResponse = await this.client.chatCompletion({
        model: 'gpt-5-mini',
        messages,
        parameters: {
          tools,
          tool_choice: 'auto', // Let AI decide when to use tools
          temperature: 0.7
        }
      });

      const assistantMessage = aiResponse.choices[0]?.message;
      if (!assistantMessage) {
        throw new Error('No response from AI');
      }

      // Check if AI wants to use tools
      const toolCalls = assistantMessage.tool_calls || [];

      if (toolCalls.length > 0) {
        // Execute tools and get results
        const toolResults = await toolManager.processToolCalls(
          toolCalls,
          {
            userId: 'example-user',
            sessionId: 'chat-session-123',
            conversationId: 'conv-456',
            provider: 'openrouter',
            model: 'gpt-5-mini',
            timestamp: new Date()
          }
        );

        // Add tool results to conversation
        const messagesWithTools = [
          ...messages,
          assistantMessage,
          ...toolResults
        ];

        // Second AI call with tool results
        const finalResponse = await this.client.chatCompletion({
          model: 'gpt-5-mini',
          messages: messagesWithTools,
          parameters: {
            tools, // Keep tools available for follow-up
            temperature: 0.7
          }
        });

        const finalMessage = finalResponse.choices[0]?.message;

        return {
          response: finalMessage || assistantMessage,
          toolCalls,
          toolResults
        };

      } else {
        // No tools needed, return direct response
        return {
          response: assistantMessage,
          toolCalls: [],
          toolResults: []
        };
      }

    } catch (error) {
      console.error('Error in tool-integrated chat:', error);

      // Return error message
      return {
        response: {
          role: 'assistant',
          content: `I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          id: `error-${Date.now()}`,
          timestamp: new Date()
        },
        toolCalls: [],
        toolResults: []
      };
    }
  }

  /**
   * Advanced example: Multi-step research task
   */
  async performResearch(query: string): Promise<{
    summary: string;
    sources: string[];
    data: any[];
  }> {
    const researchPrompt = `
    You are a research assistant. I need you to research: "${query}"

    Please:
    1. Search for current information using web_search tool
    2. Look for relevant data or statistics
    3. Save your findings to a file using file_operation tool
    4. Provide a comprehensive summary

    Be thorough but efficient in your research.
    `;

    const result = await this.sendMessage(researchPrompt);

    // Parse research results (simplified)
    return {
      summary: result.response.content || 'Research completed',
      sources: result.toolCalls.map(call => call.function.name),
      data: result.toolResults.map(result => {
        try {
          return JSON.parse(result.content);
        } catch {
          return result.content;
        }
      })
    };
  }

  /**
   * Database analysis example
   */
  async analyzeDatabase(tableName: string): Promise<{
    schema: any;
    sampleData: any[];
    insights: string;
  }> {
    const analysisPrompt = `
    Please analyze the "${tableName}" table in the database:

    1. Get the table schema/structure
    2. Retrieve a sample of the data (max 10 rows)
    3. Provide insights about the data

    Use the execute_query tool for all database operations.
    `;

    const result = await this.sendMessage(analysisPrompt);

    return {
      schema: {},
      sampleData: [],
      insights: result.response.content || 'Analysis completed'
    };
  }

  /**
   * File processing example
   */
  async processFile(filePath: string, operation: 'analyze' | 'summarize' | 'transform'): Promise<{
    content: string;
    analysis: any;
    processedFile?: string;
  }> {
    let operationPrompt = '';

    switch (operation) {
      case 'analyze':
        operationPrompt = `
        Analyze the file at "${filePath}":
        1. Read the file content
        2. Analyze its structure and content
        3. Provide insights about the data
        `;
        break;

      case 'summarize':
        operationPrompt = `
        Summarize the content of "${filePath}":
        1. Read the entire file
        2. Create a concise summary
        3. Save the summary to a new file
        `;
        break;

      case 'transform':
        operationPrompt = `
        Transform the data in "${filePath}":
        1. Read the current format
        2. Transform it to a more usable format
        3. Save the transformed data to a new file
        `;
        break;
    }

    const result = await this.sendMessage(operationPrompt);

    return {
      content: result.response.content || 'Processing completed',
      analysis: result.toolResults,
      processedFile: undefined
    };
  }

  /**
   * Get tool usage statistics
   */
  getToolStats() {
    return toolManager.getToolMetrics();
  }

  /**
   * Get available tools
   */
  getAvailableTools() {
    return toolManager.getAvailableTools();
  }

  /**
   * Enable/disable specific tools
   */
  setToolEnabled(toolId: string, enabled: boolean): boolean {
    return toolManager.setToolEnabled(toolId, enabled);
  }
}

/**
 * Usage examples
 */
export async function demonstrateToolIntegration() {
  // Initialize with OpenRouter (supports tool calling)
  const chat = new ToolIntegratedChat({
    type: 'openrouter',
    apiKey: process.env.OPENROUTER_API_KEY!
  });

  console.log('Available tools:', chat.getAvailableTools());

  // Example 1: Simple web search
  console.log('\n=== Example 1: Web Search ===');
  const searchResult = await chat.sendMessage(
    'Search for the latest news about AI development'
  );
  console.log('Search result:', searchResult.response.content);

  // Example 2: Database analysis
  console.log('\n=== Example 2: Database Analysis ===');
  const dbAnalysis = await chat.analyzeDatabase('users');
  console.log('Database insights:', dbAnalysis.insights);

  // Example 3: File processing
  console.log('\n=== Example 3: File Processing ===');
  const fileResult = await chat.processFile('./data/sample.json', 'analyze');
  console.log('File analysis:', fileResult.content);

  // Example 4: Complex research task
  console.log('\n=== Example 4: Research Task ===');
  const research = await chat.performResearch(
    'Impact of electric vehicles on climate change'
  );
  console.log('Research summary:', research.summary);

  // Tool usage statistics
  console.log('\n=== Tool Usage Statistics ===');
  console.log('Stats:', chat.getToolStats());
}

export default ToolIntegratedChat;
