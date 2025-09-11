import { BaseAIProvider } from './base-provider';
import { DEFAULT_MODEL } from './config';
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
    model: string = DEFAULT_MODEL,
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
    model: string = DEFAULT_MODEL,
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
    model: string = DEFAULT_MODEL,
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

  /**
   * Get generation metadata by ID
   */
  async getGeneration(generationId: string): Promise<any> {
    const provider = this.provider as any;

    // Use the provider's specific method to get generation data
    if (provider.getDefaultBaseURL().includes('openrouter.ai')) {
      const url = `${provider.baseURL}/generation?id=${generationId}`;
      const response = await provider.makeRequest(url, 'GET', undefined, {
        'Authorization': `Bearer ${provider.apiKey}`
      });
      return response;
    }

    throw new Error('Generation metadata retrieval not supported for this provider');
  }

  /**
   * Get usage analytics for recent generations
   */
  async getUsageAnalytics(options: {
    limit?: number;
    since?: Date;
    model?: string;
    provider?: string;
  } = {}): Promise<{
    totalCost: number;
    totalTokens: number;
    cacheSavings: number;
    averageLatency: number;
    generations: any[];
  }> {
    const { limit = 10, since, model, provider } = options;

    // This would typically require a list endpoint or database query
    // For now, return mock data structure
    return {
      totalCost: 0,
      totalTokens: 0,
      cacheSavings: 0,
      averageLatency: 0,
      generations: []
    };
  }

  /**
   * Analyze token efficiency for a generation
   */
  analyzeTokenEfficiency(generationData: any): {
    efficiency: number;
    costPerToken: number;
    cacheEfficiency: number;
    recommendations: string[];
  } {
    const data = generationData.data || generationData;

    const totalTokens = (data.tokens_prompt || 0) + (data.tokens_completion || 0);
    const totalCost = data.total_cost || 0;
    const cacheDiscount = data.cache_discount || 0;

    // Calculate efficiency metrics
    const efficiency = totalTokens > 0 ? (data.tokens_completion || 0) / totalTokens : 0;
    const costPerToken = totalTokens > 0 ? totalCost / totalTokens : 0;
    const cacheEfficiency = totalCost > 0 ? (cacheDiscount / totalCost) * 100 : 0;

    const recommendations: string[] = [];

    if (efficiency < 0.3) {
      recommendations.push('Consider using more specific prompts to reduce input tokens');
    }

    if (costPerToken > 0.0001) {
      recommendations.push('Consider using a smaller model or optimizing prompts for cost efficiency');
    }

    if (cacheEfficiency > 50) {
      recommendations.push('Great cache usage! Consider similar prompt patterns for better performance');
    }

    return {
      efficiency,
      costPerToken,
      cacheEfficiency,
      recommendations
    };
  }

  /**
   * Get cache performance metrics
   */
  analyzeCachePerformance(generationData: any): {
    cacheHitRate: number;
    potentialSavings: number;
    cacheEfficiency: number;
    recommendations: string[];
  } {
    const data = generationData.data || generationData;

    const cacheDiscount = data.cache_discount || 0;
    const totalCost = data.total_cost || 0;
    const upstreamCost = data.upstream_inference_cost || totalCost;

    // Estimate cache hit rate (simplified)
    const cacheHitRate = upstreamCost > 0 ? (cacheDiscount / upstreamCost) * 100 : 0;

    // Calculate potential savings
    const potentialSavings = upstreamCost - cacheDiscount;

    // Overall cache efficiency
    const cacheEfficiency = totalCost > 0 ? (cacheDiscount / totalCost) * 100 : 0;

    const recommendations: string[] = [];

    if (cacheHitRate < 30) {
      recommendations.push('Consider using more consistent prompt patterns to improve cache hit rate');
    }

    if (cacheEfficiency > 70) {
      recommendations.push('Excellent cache performance! Continue using similar request patterns');
    }

    if (potentialSavings > totalCost * 0.5) {
      recommendations.push('Significant cost savings possible with better cache utilization');
    }

    return {
      cacheHitRate,
      potentialSavings,
      cacheEfficiency,
      recommendations
    };
  }

  /**
   * Monitor token usage patterns
   */
  monitorTokenUsage(generationData: any): {
    tokenDistribution: {
      prompt: number;
      completion: number;
      reasoning: number;
    };
    efficiencyMetrics: {
      completionRatio: number;
      reasoningEfficiency: number;
    };
    costBreakdown: {
      baseCost: number;
      cacheDiscount: number;
      finalCost: number;
    };
  } {
    const data = generationData.data || generationData;

    const tokenDistribution = {
      prompt: data.tokens_prompt || 0,
      completion: data.tokens_completion || 0,
      reasoning: data.native_tokens_reasoning || 0
    };

    const totalTokens = tokenDistribution.prompt + tokenDistribution.completion;
    const efficiencyMetrics = {
      completionRatio: totalTokens > 0 ? tokenDistribution.completion / totalTokens : 0,
      reasoningEfficiency: tokenDistribution.reasoning > 0 ?
        tokenDistribution.completion / tokenDistribution.reasoning : 0
    };

    const costBreakdown = {
      baseCost: data.upstream_inference_cost || data.total_cost || 0,
      cacheDiscount: data.cache_discount || 0,
      finalCost: data.total_cost || 0
    };

    return {
      tokenDistribution,
      efficiencyMetrics,
      costBreakdown
    };
  }
}
