import { AIClient } from '../core/ai-client';
import { Message } from '../core/interfaces';

// Example 1: Basic usage with OpenRouter
async function basicExample() {
  const client = new AIClient({
    type: 'openrouter',
    apiKey: process.env.OPENROUTER_API_KEY!
  });

  // Simple text completion
  const text = await client.generateText(
    'Write a haiku about programming',
    'gpt-5-mini'
  );
  console.log('Generated text:', text);

  // Chat completion
  const messages: Message[] = [
    { role: 'system', content: 'You are a helpful coding assistant.' },
    { role: 'user', content: 'How do I implement a binary search in JavaScript?' }
  ];

  const response = await client.chat(messages, 'gpt-5-mini');
  console.log('Assistant response:', response.content);
}

// Example 2: Switching providers at runtime
async function providerSwitching() {
  const client = new AIClient({
    type: 'openai',
    apiKey: process.env.OPENAI_API_KEY!
  });

  // Use OpenAI first
  const openaiResponse = await client.generateText(
    'Explain quantum computing in simple terms',
    'gpt-5-mini'
  );

  // Switch to OpenRouter
  client.setProvider({
    type: 'openrouter',
    apiKey: process.env.OPENROUTER_API_KEY!
  });

  // Use OpenRouter with the same interface
  const orResponse = await client.generateText(
    'Explain quantum computing in simple terms',
    'gpt-5-mini'
  );
}

// Example 3: Agent-style conversation
async function agentExample() {
  const client = new AIClient({
    type: 'openrouter',
    apiKey: process.env.OPENROUTER_API_KEY!
  });

  const agent = {
    systemPrompt: `You are a senior software architect. Provide detailed,
    production-ready code with proper error handling and documentation.`,
    model: 'gpt-5-mini'
  };

  const response = await client.agentChat(
    'Create a REST API for user management with authentication',
    agent.systemPrompt,
    agent.model,
    { max_tokens: 1000 }
  );

  console.log('Architecture plan:', response.content);
}

// Example 4: Using provider-specific parameters
async function providerSpecificParams() {
  const client = new AIClient({
    type: 'openrouter',
    apiKey: process.env.OPENROUTER_API_KEY!
  });

  // Use OpenRouter-specific verbosity parameter
  const response = await client.chatCompletion({
    model: 'gpt-5-mini',
    messages: [
      { role: 'user', content: 'Explain machine learning' }
    ],
    parameters: {
      temperature: 0.7,
      verbosity: 'high' as any // OpenRouter-specific parameter
    }
  });
}

// Example 5: Streaming responses
async function streamingExample() {
  const client = new AIClient({
    type: 'openrouter',
    apiKey: process.env.OPENROUTER_API_KEY!
  });

  const messages: Message[] = [
    { role: 'user', content: 'Write a short story about AI' }
  ];

  const stream = client.chatCompletionStream({
    model: 'gpt-5-mini',
    messages,
    parameters: { temperature: 0.8, max_tokens: 500 }
  });

  for await (const chunk of stream) {
    if (chunk.choices[0]?.delta?.content) {
      process.stdout.write(chunk.choices[0].delta.content);
    }
  }
}

// Example 6: Tool calling (if supported by provider)
async function toolCallingExample() {
  const client = new AIClient({
    type: 'openrouter',
    apiKey: process.env.OPENROUTER_API_KEY!
  });

  const tools = [
    {
      type: 'function' as const,
      function: {
        name: 'get_weather',
        description: 'Get current weather for a location',
        parameters: {
          type: 'object',
          properties: {
            location: { type: 'string' }
          },
          required: ['location']
        }
      }
    }
  ];

  const response = await client.chatCompletion({
    model: 'gpt-5-mini',
    messages: [
      { role: 'user', content: 'What\'s the weather like in New York?' }
    ],
    parameters: {
      tools,
      tool_choice: 'auto'
    }
  });

  console.log('Tool calls:', response.choices[0]?.message?.tool_calls);
}

// Export examples for testing
export {
  basicExample,
  providerSwitching,
  agentExample,
  providerSpecificParams,
  streamingExample,
  toolCallingExample
};
