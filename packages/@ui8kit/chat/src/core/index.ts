// Core AI functionality - Provider-agnostic AI client
export { AIClient } from './ai-client';
export { BaseAIProvider } from './base-provider';

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
} from './interfaces';

// Providers
export { OpenRouterProvider } from '../providers/openrouter-provider';
export { OpenAIProvider } from '../providers/openai-provider';
export { ProviderFactory, type ProviderType, type ProviderConfig } from '../providers/provider-factory';
