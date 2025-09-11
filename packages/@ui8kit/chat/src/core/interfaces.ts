// Core interfaces for provider-agnostic AI interactions

export interface Message {
  role: 'system' | 'user' | 'assistant' | 'developer' | 'tool';
  content: string;
  name?: string;
  id?: string;
  timestamp?: Date;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
}

export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

export interface Tool {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: Record<string, any>;
  };
}

// JSON Schema definition for structured outputs
export interface JSONSchema {
  type: string;
  properties?: Record<string, JSONSchemaProperty>;
  items?: JSONSchema | JSONSchemaProperty;
  required?: string[];
  additionalProperties?: boolean;
  enum?: any[];
  const?: any;
  description?: string;
  default?: any;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: string;
  $ref?: string;
  oneOf?: JSONSchema[];
  anyOf?: JSONSchema[];
  allOf?: JSONSchema[];
  // Array-specific properties
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;
}

export interface JSONSchemaProperty extends JSONSchema {
  description?: string;
  default?: any;
  examples?: any[];
}

// Response format types
export type ResponseFormatType = 'text' | 'json_object' | 'json_schema';

// Structured output configuration
export interface StructuredOutputConfig {
  type: 'json_schema';
  json_schema: {
    name: string;
    description?: string;
    strict: boolean;
    schema: JSONSchema;
  };
}

// Legacy response format (for backward compatibility)
export interface LegacyResponseFormat {
  type: 'text' | 'json_object';
  schema?: Record<string, any>;
}

// Union type for all response formats
export type ResponseFormat = StructuredOutputConfig | LegacyResponseFormat;

// Common parameters supported by most providers
export interface CommonParameters {
  temperature?: number;
  top_p?: number;
  top_k?: number;
  max_tokens?: number;
  seed?: number;
  stop?: string[];
  frequency_penalty?: number;
  presence_penalty?: number;
  repetition_penalty?: number;
  logit_bias?: Record<string, number>;
  logprobs?: boolean;
  top_logprobs?: number;
  response_format?: ResponseFormat;
  tools?: Tool[];
  tool_choice?: 'none' | 'auto' | 'required' | { type: 'function'; function: { name: string } };
  parallel_tool_calls?: boolean;
}

// Provider-specific parameters (only for providers that support them)
export interface ProviderSpecificParameters {
  // OpenAI specific
  min_p?: number;
  top_a?: number;
  structured_outputs?: boolean;

  // OpenRouter specific
  verbosity?: 'low' | 'medium' | 'high';

  // Anthropic specific
  max_tokens_to_sample?: number;
  top_k?: number;

  // Mistral specific
  safe_prompt?: boolean;

  // Hyperbolic specific
  raw_mode?: boolean;

  // Generic extension for future providers
  [key: string]: any;
}

export interface CompletionRequest {
  model: string;
  prompt: string;
  parameters?: CommonParameters & ProviderSpecificParameters;
  stream?: boolean;
}

export interface ChatCompletionRequest {
  model: string;
  messages: Message[];
  parameters?: CommonParameters & ProviderSpecificParameters;
  stream?: boolean;
}

export interface CompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    text?: string;
    message?: Message;
    index: number;
    finish_reason: string;
    logprobs?: any;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface StreamChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    delta?: {
      role?: string;
      content?: string;
      tool_calls?: ToolCall[];
    };
    index: number;
    finish_reason?: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
