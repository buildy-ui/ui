# @ui8kit/chat - Provider-Agnostic AI Client

A universal client for working with various AI providers through a unified interface, featuring advanced analytics, structured outputs, comprehensive tool calling system with built-in tools (Web Search, Database, File System), and React UI components.

## 🎯 Features

- **Provider Independence**: Single interface for OpenRouter, OpenAI, Anthropic, and others
- **Automatic Parameter Transformation**: Provider-specific parameters handled automatically
- **TypeScript**: Full type safety for better developer experience
- **Streaming**: Real-time streaming response support
- **Tool Calling System**: Powerful tool management with Web Search, Database, File System tools
- **Generation Analytics**: Comprehensive token usage, cost, and performance analysis
- **Structured Outputs**: JSON Schema validation and structured response handling
- **React UI Components**: Ready-to-use chat interface components
- **Security & Monitoring**: Built-in tool permissions, metrics, and health monitoring
- **Extensibility**: Easy to add new providers and custom tools

## 📦 Installation

```bash
npm install @ui8kit/chat
```

## 🚀 Quick Start

```typescript
import { AIClient } from '@ui8kit/chat';

// Create client with OpenRouter
const client = new AIClient({
  type: 'openrouter',
  apiKey: process.env.OPENROUTER_API_KEY!
});

// Simple text generation
const text = await client.generateText(
  'Explain quantum computing in simple terms'
);

// Chat with message history
const response = await client.chat([
  { role: 'system', content: 'You are a JavaScript expert' },
  { role: 'user', content: 'How does closure work?' }
]);
```

## 🏗️ Architecture

### Core Components

```
src/
├── core/
│   ├── interfaces.ts           # Types and interfaces
│   ├── base-provider.ts        # Abstract base class
│   ├── ai-client.ts           # Main client with analytics
│   └── base-provider.ts       # Provider abstraction
├── providers/
│   ├── openrouter-provider.ts
│   ├── openai-provider.ts
│   └── provider-factory.ts
├── utils/
│   ├── generation-analytics.ts # Token & cost analytics
│   ├── structured-outputs.ts   # JSON Schema utilities
│   └── chat-utils.ts          # Helper functions
├── tools/
│   ├── tool-registry.ts       # Tool management
│   ├── tool-manager.ts        # Tool execution
│   └── examples/              # Tool implementations
├── ui/                        # React components
│   ├── chat-message.tsx
│   ├── chat-input.tsx
│   └── model-selector.tsx
├── hooks/                     # React hooks
│   ├── use-chat-state.ts
│   ├── use-streaming.ts
│   └── use-message-history.ts
├── compositions/              # High-level components
│   └── chat-composition.tsx
└── examples/                  # Usage examples
```

### Core Interfaces

```typescript
interface CompletionRequest {
  model: string;
  prompt: string;
  parameters?: CommonParameters & ProviderSpecificParameters;
}

interface ChatCompletionRequest {
  model: string;
  messages: Message[];
  parameters?: CommonParameters & ProviderSpecificParameters;
}

interface GenerationData {
  id: string;
  total_cost: number;
  tokens_prompt: number;
  tokens_completion: number;
  cache_discount: number;
  latency?: number;
}
```

## 🔧 Supported Providers

### OpenRouter
```typescript
const client = new AIClient({
  type: 'openrouter',
  apiKey: 'your-api-key',
  baseURL: 'https://openrouter.ai/api/v1' // optional
});
```

**OpenRouter-specific parameters:**
- `verbosity`: `'low' | 'medium' | 'high'`
- `reasoning`: Reasoning tokens configuration
- `transforms`: Prompt transformations
- `response_format`: JSON Schema support

### OpenAI
```typescript
const client = new AIClient({
  type: 'openai',
  apiKey: 'your-api-key'
});
```

**OpenAI-specific parameters:**
- `min_p`: Minimum probability
- `top_a`: Alternative top sampling
- `structured_outputs`: Structured outputs
- `response_format`: JSON Schema support

## 📋 Common Parameters

| Parameter | Type | Description | Support |
|-----------|------|-------------|---------|
| `temperature` | number | Sampling temperature (0-2) | ✅ All |
| `top_p` | number | Top-p sampling (0-1) | ✅ All |
| `top_k` | number | Top-k sampling | ✅ Most |
| `max_tokens` | number | Maximum tokens | ✅ All |
| `stop` | string[] | Stop tokens | ✅ All |
| `tools` | Tool[] | External tools | ✅ Modern models |
| `stream` | boolean | Streaming mode | ✅ All |
| `response_format` | ResponseFormat | Structured output format | ✅ OpenRouter, OpenAI |

## 🎨 Usage Examples

### 1. Provider Switching

```typescript
const client = new AIClient({
  type: 'openai',
  apiKey: process.env.OPENAI_API_KEY!
});

// Use OpenAI
const openaiResult = await client.generateText('Hello world');

// Switch to OpenRouter
client.setProvider({
  type: 'openrouter',
  apiKey: process.env.OPENROUTER_API_KEY!
});

// Same interface works with any provider
const orResult = await client.generateText('Hello world');
```

### 2. Agent-style Conversation

```typescript
const response = await client.agentChat(
  'Create a REST API for user management',
  'You are a senior fullstack developer. Provide production-ready code.',
  'gpt-5-mini',
  { max_tokens: 1000 }
);
```

### 3. Provider-specific Parameters

```typescript
// OpenRouter with verbosity
const response = await client.chatCompletion({
  model: 'gpt-5-mini',
  messages: [{ role: 'user', content: 'Explain neural networks' }],
  parameters: {
    temperature: 0.7,
    verbosity: 'high' // OpenRouter-specific
  }
});
```

### 4. Streaming Responses

```typescript
const stream = client.chatCompletionStream({
  model: 'gpt-5-mini',
  messages: [{ role: 'user', content: 'Write a story' }]
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || '');
}
```

### 5. Tool Calling

```typescript
const tools = [{
  type: 'function',
  function: {
    name: 'get_weather',
    description: 'Get weather information',
    parameters: {
      type: 'object',
      properties: { location: { type: 'string' } }
    }
  }
}];

const response = await client.chatCompletion({
  model: 'gpt-5-mini',
  messages: [{ role: 'user', content: 'What\'s the weather in Moscow?' }],
  parameters: { tools, tool_choice: 'auto' }
});
```

### 6. Generation Analytics

```typescript
import { getGenerationAnalytics } from '@ui8kit/chat/utils/generation-analytics';

// Get comprehensive analytics
const generationData = await client.getGeneration('gen-12345');
const analytics = getGenerationAnalytics(generationData.data);

console.log('Efficiency Score:', analytics.summary.score + '/100');
console.log('Cache Savings: $' + analytics.cache.cacheSavings);
console.log('Recommendations:', analytics.summary.recommendations);
```

### 7. Structured Outputs

```typescript
import { createStructuredOutput, createObjectSchema } from '@ui8kit/chat/utils/structured-outputs';

// Define structured output schema
const schema = createStructuredOutput('user_profile', createObjectSchema({
  name: { type: 'string', description: 'User name' },
  age: { type: 'number', description: 'User age', minimum: 0, maximum: 120 },
  email: { type: 'string', description: 'Email address', format: 'email' }
}, { required: ['name', 'email'] }));

const response = await client.chatCompletion({
  model: 'gpt-5-mini',
  messages: [{ role: 'user', content: 'Create a user profile for John Doe' }],
  parameters: { response_format: schema }
});
```

### 8. React UI Components

```typescript
import { ChatComposition } from '@ui8kit/chat/compositions';

function MyChatApp() {
  return (
    <ChatComposition
      providerConfig={{
        type: 'openrouter',
        apiKey: process.env.OPENROUTER_API_KEY!
      }}
      initialMessages={[
        { role: 'system', content: 'You are a helpful assistant' }
      ]}
      systemPrompt="You are a helpful assistant"
      placeholder="Type your message..."
      showModelSelector={true}
      availableModels={['gpt-5-mini', 'gpt-5-high']}
      streaming={true}
    />
  );
}
```

### 9. Tool System Integration

```typescript
import { ToolRegistry, toolRegistry } from '@ui8kit/chat/tools/tool-registry';
import { WebSearchTool } from '@ui8kit/chat/tools/examples/web-search-tool';

// Register tools
const webSearchTool = new WebSearchTool();
toolRegistry.registerTool(webSearchTool);

// Use in chat
const response = await client.chatCompletion({
  model: 'gpt-5-mini',
  messages: [{ role: 'user', content: 'Search for latest React updates' }],
  parameters: {
    tools: toolRegistry.getAllTools(),
    tool_choice: 'auto'
  }
});
```

### 10. Custom Tool Creation

```typescript
import { AbstractTool, createToolMetadata } from '@ui8kit/chat/tools';

class WeatherTool extends AbstractTool {
  constructor() {
    super(createToolMetadata(
      'weather',
      'Weather Information',
      'Get current weather data for any location',
      {
        tags: ['weather', 'api'],
        permissions: ['read'],
        version: '1.0.0'
      }
    ));
  }

  protected buildSchema() {
    return {
      type: 'function',
      function: {
        name: 'get_weather',
        description: 'Retrieve current weather information',
        parameters: {
          type: 'object',
          properties: {
            location: { type: 'string', description: 'City name' },
            unit: {
              type: 'string',
              enum: ['celsius', 'fahrenheit'],
              default: 'celsius'
            }
          },
          required: ['location']
        }
      }
    };
  }

  async execute(params: any, context: any) {
    // Tool implementation
    const weather = await this.fetchWeather(params.location);
    return {
      success: true,
      data: {
        location: params.location,
        temperature: weather.temp,
        condition: weather.condition,
        unit: params.unit || 'celsius'
      }
    };
  }
}

// Register and use
const weatherTool = new WeatherTool();
toolRegistry.registerTool(weatherTool);
```

## 🔧 Adding a New Provider

1. Create a new provider class:

```typescript
export class AnthropicProvider extends BaseAIProvider {
  protected getDefaultBaseURL(): string {
    return 'https://api.anthropic.com/v1';
  }

  protected transformParameters(common: CommonParameters, provider: ProviderSpecificParameters) {
    // Transform parameters for Anthropic
    return { ...common, ...provider };
  }

  protected mapModelName(model: string): string {
    return model; // Or mapping if needed
  }

  protected async makeRequest(endpoint: string, method: 'GET' | 'POST', body?: any) {
    // Anthropic-specific request logic
  }

  protected normalizeResponse(response: any): CompletionResponse {
    // Normalize response to common format
  }
}
```

2. Add provider to factory:

```typescript
// provider-factory.ts
export type ProviderType = 'openrouter' | 'openai' | 'anthropic';

export class ProviderFactory {
  static createProvider(config: ProviderConfig): BaseAIProvider {
    switch (config.type) {
      case 'anthropic':
        return new AnthropicProvider(config.apiKey, config.baseURL);
      // ... other providers
    }
  }
}
```

## 🧪 Testing

```typescript
import { basicExample, streamingExample } from './examples/usage-examples';

// Run examples
basicExample().then(() => console.log('Basic example completed'));
streamingExample().then(() => console.log('Streaming example completed'));
```

## 📊 Advanced Features

### Generation Analytics API

```typescript
import {
  getGenerationAnalytics,
  analyzeGenerationBatch,
  calculateTokenEfficiency
} from '@ui8kit/chat/utils/generation-analytics';

// Single generation analysis
const analytics = getGenerationAnalytics(generationData);

// Batch analysis
const batchResults = analyzeGenerationBatch([gen1, gen2, gen3]);

// Token efficiency calculation
const efficiency = calculateTokenEfficiency(generationData);
```

### Structured Outputs API

```typescript
import {
  createStructuredOutput,
  createObjectSchema,
  validateStructuredResponse
} from '@ui8kit/chat/utils/structured-outputs';

// Create schema
const schema = createStructuredOutput('product', createObjectSchema({
  name: { type: 'string' },
  price: { type: 'number', minimum: 0 }
}, { required: ['name'] }));

// Validate response
const isValid = validateStructuredResponse(response, schema);
```

### Tool System API

```typescript
import { ToolRegistry, AbstractTool, toolManager } from '@ui8kit/chat/tools';

// Tool Registry - Manage tool lifecycle
const toolRegistry = new ToolRegistry();

// Create and register custom tool
class CustomTool extends AbstractTool {
  buildSchema() {
    return {
      type: 'function',
      function: {
        name: 'custom_function',
        description: 'Custom tool description',
        parameters: { /* JSON Schema */ }
      }
    };
  }

  async execute(args: any, context: any) {
    // Tool implementation
    return { success: true, data: result };
  }
}

// Register and manage tools
toolRegistry.registerTool(new CustomTool());
toolRegistry.setToolEnabled('custom-tool', true);

// Get tools for AI
const tools = toolRegistry.getEnabledTools();
```

#### Built-in Tools

**🔍 Web Search Tool**
```typescript
import { WebSearchTool } from '@ui8kit/chat/tools/examples/web-search-tool';

const webSearch = new WebSearchTool({
  maxResults: 10,
  safeSearch: true
});
toolRegistry.registerTool(webSearch);
```

**💾 Database Query Tool**
```typescript
import { DatabaseQueryTool } from '@ui8kit/chat/tools/examples/database-query-tool';

const dbTool = new DatabaseQueryTool({
  connectionString: 'postgresql://...',
  readOnly: true
});
toolRegistry.registerTool(dbTool);
```

**📁 File System Tool**
```typescript
import { FileSystemTool } from '@ui8kit/chat/tools/examples/file-system-tool';

const fsTool = new FileSystemTool({
  allowedPaths: ['./data'],
  maxFileSize: 1024 * 1024
});
toolRegistry.registerTool(fsTool);
```

#### Tool Manager Features

**Parallel Execution**
```typescript
// Execute multiple tools in parallel
const results = await toolManager.executeToolCalls(
  toolCalls,
  context,
  { parallel: true, timeout: 30000 }
);
```

**Monitoring & Metrics**
```typescript
// Get performance metrics
const metrics = toolManager.getToolMetrics('web-search');
console.log(`Executions: ${metrics.executions}`);
console.log(`Success rate: ${metrics.successRate}%`);
console.log(`Avg execution time: ${metrics.avgExecutionTime}ms`);
```

**Security & Permissions**
```typescript
// Filter tools by permissions
const userTools = toolRegistry.getFilteredTools({
  userPermissions: ['read', 'database'],
  requiredTags: ['safe'],
  excludedTags: ['dangerous']
});
```

### React Hooks API

```typescript
import {
  useChatState,
  useStreaming,
  useMessageHistory
} from '@ui8kit/chat/hooks';

// Chat state management
const {
  messages,
  addMessage,
  clearMessages,
  setLoading
} = useChatState({
  initialMessages: [],
  maxMessages: 100
});

// Streaming management
const {
  isStreaming,
  startStreaming,
  stopStreaming
} = useStreaming({
  client,
  onChunk: (chunk) => console.log(chunk),
  onComplete: (content) => addMessage({ role: 'assistant', content })
});

// Message history
const {
  undo,
  redo,
  canUndo,
  canRedo,
  exportHistory
} = useMessageHistory(messages);
```

## 📚 API Reference

### Core Classes
- [AIClient](./core/ai-client.ts) - Main client with analytics methods
- [BaseAIProvider](./core/base-provider.ts) - Abstract provider base class
- [ProviderFactory](./providers/provider-factory.ts) - Provider factory

### Analytics & Utils
- [GenerationAnalytics](./utils/generation-analytics.ts) - Token and cost analysis utilities
- [StructuredOutputs](./utils/structured-outputs.ts) - JSON Schema utilities
- [ChatUtils](./utils/chat-utils.ts) - Helper functions

### Tool System
- [ToolRegistry](./tools/tool-registry.ts) - Tool registration and management
- [ToolManager](./tools/tool-manager.ts) - Tool execution orchestration
- [AbstractTool](./tools/base-tool.ts) - Base class for custom tools
- [WebSearchTool](./tools/examples/web-search-tool.ts) - Web search functionality
- [DatabaseQueryTool](./tools/examples/database-query-tool.ts) - Database operations
- [FileSystemTool](./tools/examples/file-system-tool.ts) - File system operations

### React Components
- [ChatComposition](./compositions/chat-composition.tsx) - High-level chat component
- [ChatMessage](./ui/chat-message.tsx) - Message display component
- [ChatInput](./ui/chat-input.tsx) - Input component with streaming support
- [ModelSelector](./ui/model-selector.tsx) - Model selection component

### React Hooks
- [useChatState](./hooks/use-chat-state.ts) - Chat state management
- [useStreaming](./hooks/use-streaming.ts) - Streaming response handling
- [useMessageHistory](./hooks/use-message-history.ts) - Message history with undo/redo

### Examples
- [UsageExamples](./examples/usage-examples.ts) - Basic usage examples
- [GenerationAnalyticsExample](./examples/generation-analytics-example.ts) - Analytics examples
- [StructuredOutputsExample](./examples/structured-outputs-example.ts) - Structured output examples

### Interfaces
- [CoreInterfaces](./core/interfaces.ts) - TypeScript interfaces and types

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build the package
npm run build

# Run Storybook for UI components
npm run storybook

# Type checking
npm run type-check

# Run tool examples
npm run example:tools
```

## 🛡️ Tool System Best Practices

### Security First
- **Parameter Validation**: Always validate input parameters using JSON Schema
- **Permission System**: Use role-based access control for tool execution
- **Resource Limits**: Set timeouts, file size limits, and rate limits
- **Safe Defaults**: Enable safe search, read-only database access by default

### Performance Optimization
- **Caching**: Implement caching for expensive operations
- **Parallel Execution**: Use parallel tool execution when appropriate
- **Timeouts**: Set reasonable timeouts for all operations (default: 30s)
- **Retries**: Implement exponential backoff for failed operations

### Tool Development
```typescript
// ✅ Good: Comprehensive validation
class SecureTool extends AbstractTool {
  buildSchema() {
    return {
      type: 'function',
      function: {
        name: 'secure_operation',
        description: 'Secure operation with validation',
        parameters: {
          type: 'object',
          properties: {
            input: {
              type: 'string',
              minLength: 1,
              maxLength: 1000,
              pattern: '^[a-zA-Z0-9_\\s]+$' // Safe characters only
            }
          },
          required: ['input']
        }
      }
    };
  }

  async execute(params: any, context: any) {
    // Validate permissions
    if (!context.userPermissions?.includes('read')) {
      throw new Error('Insufficient permissions');
    }

    // Implement timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Operation timeout')), 30000)
    );

    try {
      const result = await Promise.race([
        this.performOperation(params),
        timeoutPromise
      ]);

      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
```

### Monitoring & Observability
```typescript
// Track tool usage
const toolMetrics = toolManager.getToolMetrics('web-search');
console.log(`Tool Health: ${toolMetrics.successRate}% success rate`);

// Set up alerts
if (toolMetrics.successRate < 95) {
  console.warn('⚠️ Tool success rate dropped below 95%');
}

// Log tool executions
toolManager.on('toolExecuted', (event) => {
  console.log(`Tool ${event.toolId} executed in ${event.executionTime}ms`);
});
```

## 📄 License

MIT License - see [LICENSE](../LICENSE) file.

## 📞 Support

- 📧 **Email**: support@ui8kit.com
- 💬 **Discord**: [Join our community](https://discord.gg/ui8kit)
- 📖 **Documentation**: [Full API docs](https://docs.ui8kit.com)
- 🐛 **Issues**: [GitHub Issues](https://github.com/ui8kit/chat/issues)

---

**Made with ❤️ by the ui8kit team**
