// ========== CORE AI FUNCTIONALITY ==========
export { AIClient } from './core/ai-client';
export { BaseAIProvider } from './core/base-provider';

// ========== PROVIDERS ==========
export { OpenRouterProvider } from './providers/openrouter-provider';
export { OpenAIProvider } from './providers/openai-provider';
export { ProviderFactory, type ProviderType, type ProviderConfig } from './providers/provider-factory';

// ========== TYPES & INTERFACES ==========
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

// ========== UI COMPONENTS ==========
export {
  ChatMessage,
  ChatMessageAvatar,
  ChatMessageContent
} from './ui/chat-message';

export { ChatInput, ChatInputTextArea, ChatInputSubmit } from './ui/chat-input';
export { ChatMessageArea } from './ui/chat-message-area';
export { ChatDropdown } from './ui/chat-dropdown';
export { MarkdownContent } from './ui/markdown-content';
export { ModelSelector } from './ui/model-selector';
export type { Model } from './ui/model-selector';
export { ScrollArea } from './ui/scroll-area';

// ========== HOOKS ==========
export {
  useScrollToBottom,
  useTextareaResize,
  useCopyMarkdown
} from './hooks';

// ========== COMPOSITIONS ==========
export { ChatComposition } from './compositions/chat-composition';

// ========== EXAMPLES & UTILS ==========
export * from './examples/usage-examples';
export { StructuredOutputsExample, demonstrateStructuredOutputs } from './examples/structured-outputs-example';
export { GenerationAnalyticsExample, demonstrateGenerationAnalytics } from './examples/generation-analytics-example';

// ========== TOOLS & INTEGRATIONS ==========
export {
  ToolRegistry,
  toolRegistry,
  type BaseTool,
  type ToolMetadata,
  type ToolExecutionContext,
  type ToolExecutionResult
} from './tools/tool-registry';

export {
  AbstractTool,
  createToolMetadata
} from './tools/base-tool';

export {
  ToolManager,
  toolManager
} from './tools/tool-manager';

// Tool examples
export { WebSearchTool } from './tools/examples/web-search-tool';
export { DatabaseQueryTool } from './tools/examples/database-query-tool';
export { FileSystemTool } from './tools/examples/file-system-tool';
export { ToolIntegratedChat, demonstrateToolIntegration } from './tools/examples/tool-integration-example';

// ========== STRUCTURED OUTPUTS ==========
export {
  createStructuredOutput,
  createObjectSchema,
  createStringProperty,
  createNumberProperty,
  createArrayProperty,
  createBooleanProperty,
  validateStructuredResponse,
  CommonSchemas,
  createCustomSchema,
  parseStructuredResponse
} from './utils/structured-outputs';

// ========== UTILITIES ==========
export { default as chatUtils } from './utils/chat-utils';

// ========== GENERATION ANALYTICS ==========
export {
  calculateTokenEfficiency,
  analyzeCachePerformance,
  analyzePerformance,
  calculateCostEfficiency,
  getGenerationAnalytics,
  analyzeGenerationBatch,
  type GenerationData
} from './utils/generation-analytics';