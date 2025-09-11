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

    return transformed;
  }

  protected mapModelName(model: string): string {
    // OpenRouter supports model names as-is, but we can add mappings if needed
    return model;
  }

  protected async makeRequest(
    endpoint: string,
    method: 'GET' | 'POST',
    body?: any,
    headers?: Record<string, string>
  ): Promise<any> {
    const url = `${this.baseURL}${endpoint}`;

    const requestHeaders = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      ...headers
    };

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
