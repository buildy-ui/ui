import { BaseAIProvider } from '../core/base-provider';
import { CompletionResponse, CommonParameters, ProviderSpecificParameters, StreamChunk, Message } from '../core/interfaces';

//console.log('OPENROUTER_HTTP_REFERER:', (import.meta as any).env?.VITE_OPENROUTER_HTTP_REFERER);
//console.log('OPENROUTER_X_TITLE:', (import.meta as any).env?.VITE_OPENROUTER_X_TITLE);

export class OpenRouterProvider extends BaseAIProvider {
  protected getDefaultBaseURL(): string {
    return 'https://openrouter.ai/api/v1';
  }

  protected transformParameters(
    commonParams: CommonParameters,
    providerParams: ProviderSpecificParameters
  ): Record<string, any> {
    const transformed: Record<string, any> = { ...commonParams };

    // Handle OpenRouter-specific parameters
    if (providerParams.verbosity) {
      transformed.verbosity = providerParams.verbosity;
    }

    // Handle provider-specific routing if needed
    if (providerParams.provider) {
      transformed.provider = providerParams.provider;
    }

    // Handle reasoning configuration
    if (providerParams.reasoning) {
      transformed.reasoning = providerParams.reasoning;
    }

    // Handle usage configuration
    if (providerParams.usage) {
      transformed.usage = providerParams.usage;
    }

    // Handle transforms
    if (providerParams.transforms) {
      transformed.transforms = providerParams.transforms;
    }

    // Handle structured outputs - OpenRouter supports json_schema format
    if (commonParams.response_format) {
      const format = commonParams.response_format;

      if ('json_schema' in format && format.type === 'json_schema') {
        // OpenRouter expects the structured output format directly
        transformed.response_format = format;
      } else if (format.type === 'json_object') {
        // Convert legacy format to structured output if possible
        transformed.response_format = {
          type: 'json_schema',
          json_schema: {
            name: 'response',
            strict: true,
            schema: format.schema || { type: 'object' }
          }
        };
      }
    }

    return transformed;
  }

  protected mapModelName(model: string): string {
    // Normalize common aliases to OpenRouter namespaced identifiers
    if (model.includes('/')) return model;

    // Map OpenAI shorthand to OpenRouter namespaced
    if (model === 'gpt-5-mini') return 'openai/gpt-5-mini';
    if (model === 'gpt-5-nano') return 'openai/gpt-5-nano';

    // Default: pass through
    return model;
  }

  protected async makeRequest(
    endpoint: string,
    method: 'GET' | 'POST',
    body?: any,
    headers?: Record<string, string>
  ): Promise<any> {
    const url = `${this.baseURL}${endpoint}`;

    const requestHeaders: Record<string, string> = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      ...(headers || {})
    };

    // Optional OpenRouter identification headers to improve model routing & rankings
    // Prefer explicit headers; otherwise fill from env or browser context
    if (!requestHeaders['HTTP-Referer']) {
      // Node env vars
      if (typeof process !== 'undefined' && (process as any).env?.OPENROUTER_HTTP_REFERER) {
        requestHeaders['HTTP-Referer'] = (process as any).env.OPENROUTER_HTTP_REFERER as string;
      }
      // Vite/browser env vars
      else if (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_OPENROUTER_HTTP_REFERER) {
        requestHeaders['HTTP-Referer'] = (import.meta as any).env.VITE_OPENROUTER_HTTP_REFERER as string;
      }
      // Fallback to window origin in browser
      else if (typeof window !== 'undefined' && (window as any)?.location?.origin) {
        requestHeaders['HTTP-Referer'] = (window as any).location.origin as string;
      }
    }
    if (!requestHeaders['X-Title']) {
      if (typeof process !== 'undefined' && (process as any).env?.OPENROUTER_X_TITLE) {
        requestHeaders['X-Title'] = (process as any).env.OPENROUTER_X_TITLE as string;
      } else if (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_OPENROUTER_X_TITLE) {
        requestHeaders['X-Title'] = (import.meta as any).env.VITE_OPENROUTER_X_TITLE as string;
      } else if (typeof document !== 'undefined' && (document as any)?.title) {
        requestHeaders['X-Title'] = (document as any).title as string;
      }
    }

    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
    }

    return await response.json();
  }

  protected normalizeResponse(response: any): CompletionResponse {
    // OpenRouter responses are already in OpenAI-compatible format
    // Just ensure they match our interface
    return {
      id: response.id,
      object: response.object,
      created: response.created,
      model: response.model,
      choices: response.choices.map((choice: any) => ({
        text: choice.text,
        message: choice.message,
        index: choice.index,
        finish_reason: choice.finish_reason,
        logprobs: choice.logprobs
      })),
      usage: response.usage
    };
  }

  /**
   * Streaming chat completions via Server-Sent Events (SSE)
   */
  async *chatCompletionStream(request: { model: string; messages: Message[]; parameters?: any; stream?: boolean; }): AsyncGenerator<StreamChunk> {
    const { model, messages, parameters = {} } = request;

    const transformedParams = this.transformParameters(
      this.extractCommonParams(parameters),
      this.extractProviderParams(parameters)
    );

    const payload = {
      model: this.mapModelName(model),
      messages,
      stream: true,
      ...transformedParams
    };

    const url = `${this.baseURL}/chat/completions`;

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
    // Fill identification headers as above
    if (!headers['HTTP-Referer']) {
      if (typeof process !== 'undefined' && (process as any).env?.OPENROUTER_HTTP_REFERER) {
        headers['HTTP-Referer'] = (process as any).env.OPENROUTER_HTTP_REFERER as string;
      } else if (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_OPENROUTER_HTTP_REFERER) {
        headers['HTTP-Referer'] = (import.meta as any).env.VITE_OPENROUTER_HTTP_REFERER as string;
      } else if (typeof window !== 'undefined' && (window as any)?.location?.origin) {
        headers['HTTP-Referer'] = (window as any).location.origin as string;
      }
    }
    if (!headers['X-Title']) {
      if (typeof process !== 'undefined' && (process as any).env?.OPENROUTER_X_TITLE) {
        headers['X-Title'] = (process as any).env.OPENROUTER_X_TITLE as string;
      } else if (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_OPENROUTER_X_TITLE) {
        headers['X-Title'] = (import.meta as any).env.VITE_OPENROUTER_X_TITLE as string;
      } else if (typeof document !== 'undefined' && (document as any)?.title) {
        headers['X-Title'] = (document as any).title as string;
      }
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    } as any);

    if (!response.ok || !response.body) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`OpenRouter stream error: ${response.status} ${response.statusText} ${errorText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (!data) continue;
        if (data === '[DONE]') {
          return;
        }
        try {
          const json = JSON.parse(data);
          yield json as StreamChunk;
        } catch {
          // Ignore malformed partials
        }
      }
    }
  }
}
