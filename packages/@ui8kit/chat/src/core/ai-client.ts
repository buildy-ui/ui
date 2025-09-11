import { BaseAIProvider } from './base-provider';
import { ProviderFactory, ProviderConfig } from '../providers/provider-factory';
import {
  Message,
  CompletionRequest,
  ChatCompletionRequest,
  CompletionResponse,
  StreamChunk,
  CommonParameters,
  ProviderSpecificParameters
} from './interfaces';

export class AIClient {
  private provider: BaseAIProvider;

  constructor(providerConfig: ProviderConfig) {
    this.provider = ProviderFactory.createProvider(providerConfig);
  }

  /**
   * Change provider at runtime
   */
  setProvider(providerConfig: ProviderConfig): void {
    this.provider = ProviderFactory.createProvider(providerConfig);
  }

  /**
   * Chat Completion
   */
  async chatCompletion(request: ChatCompletionRequest): Promise<CompletionResponse> {
    return this.provider.chatCompletion(request);
  }

  /**
   * Text Completion
   */
  async completion(request: CompletionRequest): Promise<CompletionResponse> {
    return this.provider.completion(request);
  }

  /**
   * Streaming Chat Completion
   */
  async *chatCompletionStream(request: ChatCompletionRequest): AsyncGenerator<StreamChunk> {
    yield* this.provider.chatCompletionStream(request);
  }

  /**
   * Helper methods for common use cases
   */

  /**
   * Simple text completion
   */
  async generateText(
    prompt: string,
    model: string = 'gpt-3.5-turbo',
    options?: {
      temperature?: number;
      max_tokens?: number;
      stop?: string[];
    }
  ): Promise<string> {
    const response = await this.completion({
      model,
      prompt,
      parameters: {
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.max_tokens ?? 150,
        stop: options?.stop
      }
    });

    return response.choices[0]?.text || '';
  }

  /**
   * Simple chat completion
   */
  async chat(
    messages: Message[],
    model: string = 'gpt-3.5-turbo',
    options?: {
      temperature?: number;
      max_tokens?: number;
      tools?: any[];
      stream?: boolean;
    }
  ): Promise<Message> {
    const response = await this.chatCompletion({
      model,
      messages,
      parameters: {
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.max_tokens ?? 150,
        tools: options?.tools
      },
      stream: options?.stream
    });

    return response.choices[0]?.message!;
  }

  /**
   * Agent-style conversation with system prompt
   */
  async agentChat(
    userMessage: string,
    systemPrompt: string,
    model: string = 'gpt-3.5-turbo',
    options?: {
      temperature?: number;
      max_tokens?: number;
      previousMessages?: Message[];
    }
  ): Promise<Message> {
    const messages: Message[] = [
      { role: 'system', content: systemPrompt },
      ...(options?.previousMessages || []),
      { role: 'user', content: userMessage }
    ];

    return this.chat(messages, model, {
      temperature: options?.temperature,
      max_tokens: options?.max_tokens
    });
  }
}
