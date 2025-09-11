import { AIClient } from '../core/ai-client';
import { Message } from '../core/interfaces';
import {
  createStructuredOutput,
  createObjectSchema,
  createStringProperty,
  createNumberProperty,
  createBooleanProperty,
  createArrayProperty,
  CommonSchemas,
  validateStructuredResponse,
  parseStructuredResponse
} from '../utils/structured-outputs';

/**
 * Complete examples of using structured outputs with AI chat
 */
export class StructuredOutputsExample {
  private client: AIClient;

  constructor(providerConfig: any) {
    this.client = new AIClient(providerConfig);
  }

  /**
   * Example 1: Weather information extraction
   */
  async extractWeatherInfo() {
    const messages: Message[] = [
      {
        role: 'user',
        content: 'What\'s the weather like in Tokyo, Paris, and New York?'
      }
    ];

    // Use the predefined weather schema
    const response = await this.client.chatCompletion({
      model: 'gpt-5-mini',
      messages,
      parameters: {
        response_format: CommonSchemas.weather,
        temperature: 0.1 // Lower temperature for more consistent structured output
      }
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      const parsed = parseStructuredResponse(content, CommonSchemas.weather.json_schema.schema);
      console.log('Weather data:', parsed);
      return parsed;
    }
  }

  /**
   * Example 2: Product catalog extraction
   */
  async extractProductInfo() {
    const messages: Message[] = [
      {
        role: 'user',
        content: `Extract product information from this text:

        The new iPhone 15 Pro costs $999 and comes in three colors: Space Black, Natural Titanium, and Blue Titanium.
        It has 128GB storage and is currently in stock at our store.
        This premium smartphone features an A17 Pro chip and advanced camera system.`
      }
    ];

    const response = await this.client.chatCompletion({
      model: 'gpt-5-mini',
      messages,
      parameters: {
        response_format: CommonSchemas.product,
        temperature: 0.1
      }
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      const parsed = parseStructuredResponse(content, CommonSchemas.product.json_schema.schema);
      console.log('Product data:', parsed);
      return parsed;
    }
  }

  /**
   * Example 3: Task list generation
   */
  async generateTaskList(projectDescription: string) {
    const messages: Message[] = [
      {
        role: 'user',
        content: `Create a detailed task list for this project: ${projectDescription}`
      }
    ];

    const response = await this.client.chatCompletion({
      model: 'gpt-5-mini',
      messages,
      parameters: {
        response_format: CommonSchemas.taskList,
        temperature: 0.3
      }
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      const parsed = parseStructuredResponse(content, CommonSchemas.taskList.json_schema.schema);
      console.log('Task list:', parsed);
      return parsed;
    }
  }

  /**
   * Example 4: Code analysis
   */
  async analyzeCode(codeSnippet: string) {
    const messages: Message[] = [
      {
        role: 'user',
        content: `Analyze this code and provide structured feedback:

\`\`\`javascript
${codeSnippet}
\`\`\``
      }
    ];

    const response = await this.client.chatCompletion({
      model: 'gpt-5-mini',
      messages,
      parameters: {
        response_format: CommonSchemas.codeAnalysis,
        temperature: 0.2
      }
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      const parsed = parseStructuredResponse(content, CommonSchemas.codeAnalysis.json_schema.schema);
      console.log('Code analysis:', parsed);
      return parsed;
    }
  }

  /**
   * Example 5: Custom structured output
   */
  async extractUserProfile(userData: string) {
    // Create custom schema for user profile
    const userProfileSchema = createStructuredOutput(
      'user_profile',
      createObjectSchema({
        name: createStringProperty({ description: 'Full name of the user' }),
        email: createStringProperty({
          description: 'Email address',
          pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'
        }),
        age: createNumberProperty({
          description: 'Age in years',
          minimum: 0,
          maximum: 150
        }),
        interests: createArrayProperty(
          createStringProperty({ description: 'Interest or hobby' }),
          { description: 'List of user interests' }
        ),
        is_active: createBooleanProperty({
          description: 'Whether the user account is active',
          default: true
        })
      }, {
        required: ['name', 'email'],
        description: 'User profile information'
      }),
      { strict: true }
    );

    const messages: Message[] = [
      {
        role: 'user',
        content: `Extract user profile information from this data: ${userData}`
      }
    ];

    const response = await this.client.chatCompletion({
      model: 'gpt-5-mini',
      messages,
      parameters: {
        response_format: userProfileSchema,
        temperature: 0.1
      }
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      const parsed = parseStructuredResponse(content, userProfileSchema.json_schema.schema);
      console.log('User profile:', parsed);
      return parsed;
    }
  }

  /**
   * Example 6: Streaming with structured outputs
   */
  async *streamStructuredOutput(query: string) {
    const messages: Message[] = [
      {
        role: 'user',
        content: query
      }
    ];

    const stream = this.client.chatCompletionStream({
      model: 'gpt-5-mini',
      messages,
      parameters: {
        response_format: CommonSchemas.weather,
        stream: true,
        temperature: 0.1
      }
    });

    let accumulatedContent = '';

    for await (const chunk of stream) {
      if (chunk.choices[0]?.delta?.content) {
        accumulatedContent += chunk.choices[0].delta.content;

        // Try to parse partial JSON for streaming updates
        try {
          const parsed = JSON.parse(accumulatedContent);
          yield { type: 'partial', data: parsed };
        } catch {
          // JSON is incomplete, continue accumulating
          yield { type: 'accumulating', content: accumulatedContent };
        }
      }

      if (chunk.choices[0]?.finish_reason === 'stop') {
        // Final validation and parsing
        const parsed = parseStructuredResponse(
          accumulatedContent,
          CommonSchemas.weather.json_schema.schema
        );
        yield { type: 'complete', data: parsed };
        break;
      }
    }
  }

  /**
   * Example 7: Error handling and validation
   */
  async safeStructuredRequest() {
    try {
      const messages: Message[] = [
        {
          role: 'user',
          content: 'Describe a person with invalid data'
        }
      ];

      const response = await this.client.chatCompletion({
        model: 'gpt-5-mini',
        messages,
        parameters: {
          response_format: CommonSchemas.weather, // Wrong schema for the query
          temperature: 0.1
        }
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        // Validate the response
        const validation = validateStructuredResponse(
          JSON.parse(content),
          CommonSchemas.weather.json_schema.schema
        );

        if (!validation.valid) {
          console.log('Validation errors:', validation.errors);
          return { success: false, errors: validation.errors };
        }

        return { success: true, data: JSON.parse(content) };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Request failed'
      };
    }
  }

  /**
   * Example 8: Multiple structured outputs in conversation
   */
  async multiStepStructuredConversation() {
    const conversation: Message[] = [];

    // Step 1: Get weather information
    conversation.push({
      role: 'user',
      content: 'What\'s the weather like in San Francisco?'
    });

    const weatherResponse = await this.client.chatCompletion({
      model: 'gpt-5-mini',
      messages: conversation,
      parameters: {
        response_format: CommonSchemas.weather
      }
    });

    const weatherContent = weatherResponse.choices[0]?.message?.content;
    if (weatherContent) {
      conversation.push({
        role: 'assistant',
        content: weatherContent
      });

      // Step 2: Get product recommendations based on weather
      conversation.push({
        role: 'user',
        content: 'Based on this weather, what products would you recommend?'
      });

      const productResponse = await this.client.chatCompletion({
        model: 'gpt-5-mini',
        messages: conversation,
        parameters: {
          response_format: CommonSchemas.product
        }
      });

      return {
        weather: parseStructuredResponse(weatherContent, CommonSchemas.weather.json_schema.schema),
        recommendations: parseStructuredResponse(
          productResponse.choices[0]?.message?.content || '',
          CommonSchemas.product.json_schema.schema
        )
      };
    }
  }
}

/**
 * Demonstration function
 */
export async function demonstrateStructuredOutputs() {
  const example = new StructuredOutputsExample({
    type: 'openrouter',
    apiKey: process.env.OPENROUTER_API_KEY!
  });

  console.log('=== Structured Outputs Examples ===\n');

  // Example 1: Weather extraction
  console.log('1. Weather Information:');
  const weather = await example.extractWeatherInfo();
  console.log(weather, '\n');

  // Example 2: Product extraction
  console.log('2. Product Information:');
  const product = await example.extractProductInfo();
  console.log(product, '\n');

  // Example 3: Task list
  console.log('3. Task List Generation:');
  const tasks = await example.generateTaskList('Build a React dashboard for sales analytics');
  console.log(tasks, '\n');

  // Example 4: Custom schema
  console.log('4. Custom User Profile:');
  const profile = await example.extractUserProfile(`
    John Doe is a 28-year-old software engineer.
    His email is john.doe@example.com.
    He enjoys coding, hiking, and reading sci-fi books.
    His account has been active since 2020.
  `);
  console.log(profile, '\n');

  // Example 5: Error handling
  console.log('5. Safe Request with Validation:');
  const safeResult = await example.safeStructuredRequest();
  console.log(safeResult, '\n');

  console.log('=== Streaming Example ===');
  const streamingGen = example.streamStructuredOutput('Weather in London');
  for await (const chunk of streamingGen) {
    console.log('Stream chunk:', chunk);
  }
}

export default StructuredOutputsExample;
