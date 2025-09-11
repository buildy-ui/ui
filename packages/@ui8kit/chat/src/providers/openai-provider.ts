import { BaseAIProvider } from '../core/base-provider';
import { CompletionResponse, CommonParameters, ProviderSpecificParameters } from '../core/interfaces';

export class OpenAIProvider extends BaseAIProvider {
  protected getDefaultBaseURL(): string {
    return 'https://api.openai.com/v1';
  }

  protected transformParameters(
    commonParams: CommonParameters,
    providerParams: ProviderSpecificParameters
  ): Record<string, any> {
    const transformed: Record<string, any> = { ...commonParams };

    // Handle OpenAI-specific parameters
    if (providerParams.min_p !== undefined) {
      transformed.min_p = providerParams.min_p;
    }

    if (providerParams.top_a !== undefined) {
      transformed.top_a = providerParams.top_a;
    }

    if (providerParams.structured_outputs !== undefined) {
      transformed.structured_outputs = providerParams.structured_outputs;
    }

    // Handle structured outputs - OpenAI supports json_schema format
    if (commonParams.response_format) {
      const format = commonParams.response_format;

      if ('json_schema' in format && format.type === 'json_schema') {
        // OpenAI expects structured output format with specific structure
        transformed.response_format = {
          type: 'json_schema',
          json_schema: format.json_schema
        };
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

    // Remove parameters that OpenAI doesn't support
    delete transformed.repetition_penalty; // OpenAI doesn't have this
    delete transformed.verbosity; // OpenRouter specific

    return transformed;
  }

  protected mapModelName(model: string): string {
    // Accept OpenRouter namespaced forms by stripping provider prefix
    if (model.startsWith('openai/')) {
      return model.replace(/^openai\//, '');
    }
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
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }

    return await response.json();
  }

  protected normalizeResponse(response: any): CompletionResponse {
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
