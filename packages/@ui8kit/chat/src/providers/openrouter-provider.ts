import { BaseAIProvider } from '../core/base-provider';
import { CompletionResponse, CommonParameters, ProviderSpecificParameters } from '../core/interfaces';

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
    // Consumers can override by passing headers explicitly
    if (!requestHeaders['HTTP-Referer'] && typeof process !== 'undefined' && (process as any).env?.OPENROUTER_HTTP_REFERER) {
      requestHeaders['HTTP-Referer'] = (process as any).env.OPENROUTER_HTTP_REFERER as string;
    }
    if (!requestHeaders['X-Title'] && typeof process !== 'undefined' && (process as any).env?.OPENROUTER_X_TITLE) {
      requestHeaders['X-Title'] = (process as any).env.OPENROUTER_X_TITLE as string;
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
}
