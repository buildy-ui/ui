/**
 * Analytics utilities for generation metadata analysis
 */

export interface GenerationData {
  id: string;
  total_cost: number;
  created_at: string;
  model: string;
  origin: string;
  usage: number;
  is_byok: boolean;
  upstream_id?: string;
  cache_discount: number;
  upstream_inference_cost?: number;
  app_id?: number;
  streamed?: boolean;
  cancelled?: boolean;
  provider_name?: string;
  latency?: number;
  moderation_latency?: number;
  generation_time?: number;
  finish_reason?: string;
  native_finish_reason?: string;
  tokens_prompt: number;
  tokens_completion: number;
  native_tokens_prompt?: number;
  native_tokens_completion?: number;
  native_tokens_reasoning?: number;
  num_media_prompt?: number;
  num_media_completion?: number;
  num_search_results?: number;
}

/**
 * Calculate token efficiency metrics
 */
export function calculateTokenEfficiency(generation: GenerationData): {
  totalTokens: number;
  promptRatio: number;
  completionRatio: number;
  reasoningRatio: number;
  efficiency: number;
  costPerToken: number;
} {
  const totalTokens = generation.tokens_prompt + generation.tokens_completion;
  const reasoningTokens = generation.native_tokens_reasoning || 0;

  const promptRatio = totalTokens > 0 ? generation.tokens_prompt / totalTokens : 0;
  const completionRatio = totalTokens > 0 ? generation.tokens_completion / totalTokens : 0;
  const reasoningRatio = totalTokens > 0 ? reasoningTokens / totalTokens : 0;

  // Efficiency: how much completion we got relative to prompt
  const efficiency = completionRatio;

  // Cost per token (including cache discount)
  const effectiveCost = generation.total_cost;
  const costPerToken = totalTokens > 0 ? effectiveCost / totalTokens : 0;

  return {
    totalTokens,
    promptRatio,
    completionRatio,
    reasoningRatio,
    efficiency,
    costPerToken
  };
}

/**
 * Analyze cache performance
 */
export function analyzeCachePerformance(generation: GenerationData): {
  cacheSavings: number;
  cacheEfficiency: number;
  potentialSavings: number;
  cacheHitRate: number;
  recommendations: string[];
} {
  const cacheDiscount = generation.cache_discount || 0;
  const totalCost = generation.total_cost || 0;
  const upstreamCost = generation.upstream_inference_cost || totalCost;

  const cacheSavings = cacheDiscount;
  const cacheEfficiency = totalCost > 0 ? (cacheDiscount / totalCost) * 100 : 0;
  const potentialSavings = upstreamCost - cacheDiscount;
  const cacheHitRate = upstreamCost > 0 ? (cacheDiscount / upstreamCost) * 100 : 0;

  const recommendations: string[] = [];

  if (cacheHitRate < 20) {
    recommendations.push('Low cache utilization. Consider using more consistent prompt patterns.');
  } else if (cacheHitRate > 70) {
    recommendations.push('Excellent cache performance! Continue using similar request patterns.');
  }

  if (potentialSavings > totalCost * 0.3) {
    recommendations.push('Significant cost savings possible through better cache utilization.');
  }

  return {
    cacheSavings,
    cacheEfficiency,
    potentialSavings,
    cacheHitRate,
    recommendations
  };
}

/**
 * Analyze performance metrics
 */
export function analyzePerformance(generation: GenerationData): {
  latencyBreakdown: {
    total: number;
    generation: number;
    moderation: number;
    network: number;
  };
  throughput: number; // tokens per second
  efficiency: number;
  recommendations: string[];
} {
  const totalLatency = generation.latency || 0;
  const generationTime = generation.generation_time || 0;
  const moderationLatency = generation.moderation_latency || 0;
  const networkLatency = totalLatency - generationTime - moderationLatency;

  const totalTokens = generation.tokens_completion || 0;
  const throughput = generationTime > 0 ? (totalTokens / generationTime) * 1000 : 0;

  const efficiency = totalTokens > 0 && totalLatency > 0 ?
    (totalTokens / totalLatency) * 1000 : 0;

  const recommendations: string[] = [];

  if (throughput < 10) {
    recommendations.push('Low throughput. Consider using a smaller model or optimizing prompts.');
  }

  if (moderationLatency > totalLatency * 0.5) {
    recommendations.push('High moderation latency. Review content for potential issues.');
  }

  if (networkLatency > 1000) {
    recommendations.push('High network latency detected. Consider using a closer region.');
  }

  return {
    latencyBreakdown: {
      total: totalLatency,
      generation: generationTime,
      moderation: moderationLatency,
      network: networkLatency
    },
    throughput,
    efficiency,
    recommendations
  };
}

/**
 * Calculate cost efficiency metrics
 */
export function calculateCostEfficiency(generation: GenerationData): {
  totalCost: number;
  costBreakdown: {
    base: number;
    cacheDiscount: number;
    upstream: number;
  };
  costPerToken: number;
  costEfficiency: number;
  savings: number;
  recommendations: string[];
} {
  const totalCost = generation.total_cost || 0;
  const cacheDiscount = generation.cache_discount || 0;
  const upstreamCost = generation.upstream_inference_cost || totalCost;
  const baseCost = upstreamCost - cacheDiscount;

  const totalTokens = generation.tokens_prompt + generation.tokens_completion;
  const costPerToken = totalTokens > 0 ? totalCost / totalTokens : 0;

  // Cost efficiency: how much we saved vs base cost
  const costEfficiency = baseCost > 0 ? (cacheDiscount / baseCost) * 100 : 0;
  const savings = cacheDiscount;

  const recommendations: string[] = [];

  if (costPerToken > 0.0002) {
    recommendations.push('High cost per token. Consider using a smaller model or optimizing prompts.');
  }

  if (costEfficiency > 50) {
    recommendations.push('Good cost efficiency due to cache. Continue using similar patterns.');
  }

  if (savings > totalCost * 0.2) {
    recommendations.push(`You're saving $${savings.toFixed(4)} with cache. Great job!`);
  }

  return {
    totalCost,
    costBreakdown: {
      base: baseCost,
      cacheDiscount,
      upstream: upstreamCost
    },
    costPerToken,
    costEfficiency,
    savings,
    recommendations
  };
}

/**
 * Get comprehensive analytics for a generation
 */
export function getGenerationAnalytics(generation: GenerationData): {
  overview: {
    id: string;
    model: string;
    provider: string;
    totalCost: number;
    totalTokens: number;
    latency: number;
  };
  tokens: ReturnType<typeof calculateTokenEfficiency>;
  cache: ReturnType<typeof analyzeCachePerformance>;
  performance: ReturnType<typeof analyzePerformance>;
  cost: ReturnType<typeof calculateCostEfficiency>;
  summary: {
    score: number; // Overall efficiency score 0-100
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    recommendations: string[];
  };
} {
  const tokens = calculateTokenEfficiency(generation);
  const cache = analyzeCachePerformance(generation);
  const performance = analyzePerformance(generation);
  const cost = calculateCostEfficiency(generation);

  // Calculate overall efficiency score
  const tokenScore = Math.min(tokens.efficiency * 100, 100);
  const cacheScore = cache.cacheEfficiency;
  const costScore = Math.max(0, 100 - (cost.costPerToken * 100000)); // Lower cost = higher score
  const performanceScore = Math.min(performance.throughput * 10, 100);

  const score = (tokenScore + cacheScore + costScore + performanceScore) / 4;

  let grade: 'A' | 'B' | 'C' | 'D' | 'F';
  if (score >= 90) grade = 'A';
  else if (score >= 80) grade = 'B';
  else if (score >= 70) grade = 'C';
  else if (score >= 60) grade = 'D';
  else grade = 'F';

  // Combine all recommendations
  const allRecommendations = [
    ...cache.recommendations,
    ...performance.recommendations,
    ...cost.recommendations
  ];

  // Remove duplicates
  const uniqueRecommendations = [...new Set(allRecommendations)];

  return {
    overview: {
      id: generation.id,
      model: generation.model,
      provider: generation.provider_name || 'Unknown',
      totalCost: generation.total_cost || 0,
      totalTokens: tokens.totalTokens,
      latency: generation.latency || 0
    },
    tokens,
    cache,
    performance,
    cost,
    summary: {
      score,
      grade,
      recommendations: uniqueRecommendations
    }
  };
}

/**
 * Batch analytics for multiple generations
 */
export function analyzeGenerationBatch(generations: GenerationData[]): {
  summary: {
    totalGenerations: number;
    totalCost: number;
    totalTokens: number;
    averageLatency: number;
    averageCostPerToken: number;
    cacheSavings: number;
  };
  trends: {
    costTrend: number;
    tokenTrend: number;
    latencyTrend: number;
  };
  topRecommendations: string[];
} {
  if (generations.length === 0) {
    return {
      summary: {
        totalGenerations: 0,
        totalCost: 0,
        totalTokens: 0,
        averageLatency: 0,
        averageCostPerToken: 0,
        cacheSavings: 0
      },
      trends: {
        costTrend: 0,
        tokenTrend: 0,
        latencyTrend: 0
      },
      topRecommendations: []
    };
  }

  const totalCost = generations.reduce((sum, g) => sum + (g.total_cost || 0), 0);
  const totalTokens = generations.reduce((sum, g) => sum + g.tokens_prompt + g.tokens_completion, 0);
  const totalLatency = generations.reduce((sum, g) => sum + (g.latency || 0), 0);
  const cacheSavings = generations.reduce((sum, g) => sum + (g.cache_discount || 0), 0);

  const averageLatency = totalLatency / generations.length;
  const averageCostPerToken = totalTokens > 0 ? totalCost / totalTokens : 0;

  // Calculate trends (simplified - comparing first half vs second half)
  const midPoint = Math.floor(generations.length / 2);
  const firstHalf = generations.slice(0, midPoint);
  const secondHalf = generations.slice(midPoint);

  const firstHalfAvgCost = firstHalf.reduce((sum, g) => sum + (g.total_cost || 0), 0) / firstHalf.length;
  const secondHalfAvgCost = secondHalf.reduce((sum, g) => sum + (g.total_cost || 0), 0) / secondHalf.length;
  const costTrend = firstHalfAvgCost > 0 ? ((secondHalfAvgCost - firstHalfAvgCost) / firstHalfAvgCost) * 100 : 0;

  // Collect all recommendations
  const allRecommendations = generations.flatMap(g => {
    const analytics = getGenerationAnalytics(g);
    return analytics.summary.recommendations;
  });

  // Count recommendation frequency
  const recommendationCount = allRecommendations.reduce((acc, rec) => {
    acc[rec] = (acc[rec] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get top recommendations
  const topRecommendations = Object.entries(recommendationCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([rec]) => rec);

  return {
    summary: {
      totalGenerations: generations.length,
      totalCost,
      totalTokens,
      averageLatency,
      averageCostPerToken,
      cacheSavings
    },
    trends: {
      costTrend,
      tokenTrend: 0, // Would need more complex analysis
      latencyTrend: 0 // Would need more complex analysis
    },
    topRecommendations
  };
}

export default {
  calculateTokenEfficiency,
  analyzeCachePerformance,
  analyzePerformance,
  calculateCostEfficiency,
  getGenerationAnalytics,
  analyzeGenerationBatch
};
