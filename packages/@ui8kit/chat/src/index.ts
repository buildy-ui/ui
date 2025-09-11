// Main exports
export { AIClient } from './core/ai-client';
export { BaseAIProvider } from './core/base-provider';

// Providers
export { OpenRouterProvider } from './providers/openrouter-provider';
export { OpenAIProvider } from './providers/openai-provider';
export { ProviderFactory, type ProviderType, type ProviderConfig } from './providers/provider-factory';

// Interfaces and types
export type {
  Message,
  ToolCall,
  Tool,
  CommonParameters,
  ProviderSpecificParameters,
  CompletionRequest,
  ChatCompletionRequest,
  CompletionResponse,
  StreamChunk
} from './core/interfaces';

// Examples (for testing and reference)
export * from './examples/usage-examples';