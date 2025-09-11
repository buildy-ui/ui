import {
  Message,
  CompletionRequest,
  ChatCompletionRequest,
  CompletionResponse,
  StreamChunk,
  CommonParameters,
  ProviderSpecificParameters
} from './interfaces';

export abstract class BaseAIProvider {
  protected apiKey: string;
  protected baseURL: string;

  constructor(apiKey: string, baseURL?: string) {
    this.apiKey = apiKey;
    this.baseURL = baseURL || this.getDefaultBaseURL();
  }

  protected abstract getDefaultBaseURL(): string;

  /**
   * Validates and transforms parameters for this specific provider
   */
  protected abstract transformParameters(
    commonParams: CommonParameters,
    providerParams: ProviderSpecificParameters
  ): Record<string, any>;

  /**
   * Maps provider-specific model names to standardized names
   */
  protected abstract mapModelName(model: string): string;

  /**
   * Makes HTTP request to the provider
   */
  protected abstract makeRequest(
    endpoint: string,
    method: 'GET' | 'POST',
    body?: any,
    headers?: Record<string, string>
  ): Promise<any>;

  /**
   * Chat Completion - main method
   */
  async chatCompletion(request: ChatCompletionRequest): Promise<CompletionResponse> {
    const { model, messages, parameters = {}, stream = false } = request;

    const transformedParams = this.transformParameters(
      this.extractCommonParams(parameters),
      this.extractProviderParams(parameters)
    );

    const payload = {
      model: this.mapModelName(model),
      messages,
      stream,
      ...transformedParams
    };

    const response = await this.makeRequest('/chat/completions', 'POST', payload);

    return this.normalizeResponse(response);
  }

  /**
   * Text Completion
   */
  async completion(request: CompletionRequest): Promise<CompletionResponse> {
    const { model, prompt, parameters = {}, stream = false } = request;

    const transformedParams = this.transformParameters(
      this.extractCommonParams(parameters),
      this.extractProviderParams(parameters)
    );

    const payload = {
      model: this.mapModelName(model),
      prompt,
      stream,
      ...transformedParams
    };

    const response = await this.makeRequest('/completions', 'POST', payload);

    return this.normalizeResponse(response);
  }

  /**
   * Streaming support
   */
  async *chatCompletionStream(request: ChatCompletionRequest): AsyncGenerator<StreamChunk> {
    request.stream = true;
    const response = await this.chatCompletion(request);

    // This would be implemented differently for each provider
    // For now, returning a mock implementation
    yield response as any;
  }

  /**
   * Separates common parameters from provider-specific ones
   */
  protected extractCommonParams(params: CommonParameters & ProviderSpecificParameters): CommonParameters {
    const {
      temperature,
      top_p,
      top_k,
      max_tokens,
      seed,
      stop,
      frequency_penalty,
      presence_penalty,
      repetition_penalty,
      logit_bias,
      logprobs,
      top_logprobs,
      response_format,
      tools,
      tool_choice,
      parallel_tool_calls,
      ...providerParams
    } = params;

    return {
      temperature,
      top_p,
      top_k,
      max_tokens,
      seed,
      stop,
      frequency_penalty,
      presence_penalty,
      repetition_penalty,
      logit_bias,
      logprobs,
      top_logprobs,
      response_format,
      tools,
      tool_choice,
      parallel_tool_calls
    };
  }

  /**
   * Extracts provider-specific parameters
   */
  protected extractProviderParams(params: CommonParameters & ProviderSpecificParameters): ProviderSpecificParameters {
    const commonKeys = [
      'temperature', 'top_p', 'top_k', 'max_tokens', 'seed', 'stop',
      'frequency_penalty', 'presence_penalty', 'repetition_penalty',
      'logit_bias', 'logprobs', 'top_logprobs', 'response_format',
      'tools', 'tool_choice', 'parallel_tool_calls'
    ];

    const providerParams: ProviderSpecificParameters = {};
    Object.keys(params).forEach(key => {
      if (!commonKeys.includes(key)) {
        providerParams[key] = params[key];
      }
    });

    return providerParams;
  }

  /**
   * Normalizes response to common format
   */
  protected abstract normalizeResponse(response: any): CompletionResponse;
}
