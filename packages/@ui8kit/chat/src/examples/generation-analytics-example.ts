import { AIClient } from '../core/ai-client';
import {
  getGenerationAnalytics,
  analyzeGenerationBatch,
  type GenerationData
} from '../utils/generation-analytics';

/**
 * Complete example of using generation analytics for monitoring and optimization
 */
export class GenerationAnalyticsExample {
  private client: AIClient;

  constructor(providerConfig: any) {
    this.client = new AIClient(providerConfig);
  }

  /**
   * Example 1: Real-time generation monitoring
   */
  async monitorGenerationRealtime(generationId: string) {
    console.log('🔍 Monitoring generation:', generationId);

    try {
      // Get generation data
      const generationData = await this.client.getGeneration(generationId);

      // Perform comprehensive analysis
      const analytics = getGenerationAnalytics(generationData.data);

      console.log('\n📊 COMPREHENSIVE ANALYSIS');
      console.log('=' .repeat(50));
      console.log(`Generation ID: ${analytics.overview.id}`);
      console.log(`Model: ${analytics.overview.model}`);
      console.log(`Provider: ${analytics.overview.provider}`);
      console.log(`Total Cost: $${analytics.overview.totalCost.toFixed(6)}`);
      console.log(`Total Tokens: ${analytics.overview.totalTokens}`);
      console.log(`Latency: ${analytics.overview.latency}ms`);

      console.log('\n🏆 EFFICIENCY SCORE');
      console.log(`Overall Score: ${analytics.summary.score.toFixed(1)}/100`);
      console.log(`Grade: ${analytics.summary.grade}`);

      console.log('\n💰 TOKEN ANALYSIS');
      console.log(`Efficiency: ${(analytics.tokens.efficiency * 100).toFixed(1)}%`);
      console.log(`Prompt Tokens: ${analytics.tokens.totalTokens * analytics.tokens.promptRatio}`);
      console.log(`Completion Tokens: ${analytics.tokens.totalTokens * analytics.tokens.completionRatio}`);
      console.log(`Cost per Token: $${analytics.tokens.costPerToken.toFixed(6)}`);

      console.log('\n⚡ CACHE ANALYSIS');
      console.log(`Cache Efficiency: ${analytics.cache.cacheEfficiency.toFixed(1)}%`);
      console.log(`Cache Savings: $${analytics.cache.cacheSavings.toFixed(6)}`);
      console.log(`Cache Hit Rate: ${analytics.cache.cacheHitRate.toFixed(1)}%`);

      console.log('\n🚀 PERFORMANCE ANALYSIS');
      console.log(`Throughput: ${analytics.performance.throughput.toFixed(1)} tokens/sec`);
      console.log(`Generation Time: ${analytics.performance.latencyBreakdown.generation}ms`);
      console.log(`Network Latency: ${analytics.performance.latencyBreakdown.network}ms`);
      console.log(`Moderation Latency: ${analytics.performance.latencyBreakdown.moderation}ms`);

      console.log('\n💡 RECOMMENDATIONS');
      analytics.summary.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec}`);
      });

      return analytics;

    } catch (error) {
      console.error('❌ Error monitoring generation:', error);
      return null;
    }
  }

  /**
   * Example 2: Batch analysis of multiple generations
   */
  async analyzeGenerationBatch(generationIds: string[]) {
    console.log('📈 Analyzing batch of', generationIds.length, 'generations');

    try {
      const generations: GenerationData[] = [];

      // Collect all generation data
      for (const id of generationIds) {
        const data = await this.client.getGeneration(id);
        generations.push(data.data);
      }

      // Perform batch analysis
      const batchAnalysis = analyzeGenerationBatch(generations);

      console.log('\n📊 BATCH ANALYSIS RESULTS');
      console.log('=' .repeat(50));
      console.log(`Total Generations: ${batchAnalysis.summary.totalGenerations}`);
      console.log(`Total Cost: $${batchAnalysis.summary.totalCost.toFixed(4)}`);
      console.log(`Total Tokens: ${batchAnalysis.summary.totalTokens}`);
      console.log(`Average Latency: ${batchAnalysis.summary.averageLatency.toFixed(0)}ms`);
      console.log(`Average Cost/Token: $${batchAnalysis.summary.averageCostPerToken.toFixed(6)}`);
      console.log(`Cache Savings: $${batchAnalysis.summary.cacheSavings.toFixed(4)}`);

      console.log('\n📈 TRENDS');
      console.log(`Cost Trend: ${batchAnalysis.trends.costTrend > 0 ? '↗️' : '↘️'} ${Math.abs(batchAnalysis.trends.costTrend).toFixed(1)}%`);

      console.log('\n🎯 TOP RECOMMENDATIONS');
      batchAnalysis.topRecommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec}`);
      });

      return batchAnalysis;

    } catch (error) {
      console.error('❌ Error in batch analysis:', error);
      return null;
    }
  }

  /**
   * Example 3: Cost monitoring and alerts
   */
  async setupCostMonitoring(budgetLimit: number = 10.0) {
    console.log('💰 Setting up cost monitoring with budget limit: $' + budgetLimit);

    const CostMonitor = {
      budget: budgetLimit,
      alerts: [] as ((message: string) => void)[],

      addAlert: function(callback: (message: string) => void) {
        this.alerts.push(callback);
      },

      checkBudget: async function(client: AIClient, generationIds: string[]) {
        const generations: GenerationData[] = [];

        for (const id of generationIds) {
          const data = await client.getGeneration(id);
          generations.push(data.data);
        }

        const batchAnalysis = analyzeGenerationBatch(generations);
        const usagePercent = (batchAnalysis.summary.totalCost / this.budget) * 100;

        if (usagePercent > 80) {
          const message = `🚨 COST ALERT: ${usagePercent.toFixed(1)}% of budget used ($${batchAnalysis.summary.totalCost.toFixed(4)})`;
          this.alerts.forEach(callback => callback(message));
        }

        return {
          usagePercent,
          totalCost: batchAnalysis.summary.totalCost,
          remainingBudget: this.budget - batchAnalysis.summary.totalCost
        };
      }
    };

    // Example usage
    CostMonitor.addAlert((message) => {
      console.log(message);
      // Here you could send email, Slack notification, etc.
    });

    return CostMonitor;
  }

  /**
   * Example 4: Performance comparison between models
   */
  async compareModelPerformance(generationIds: string[], models: string[]) {
    console.log('⚖️ Comparing performance between models:', models.join(', '));

    const modelStats = new Map<string, {
      generations: number;
      totalCost: number;
      totalTokens: number;
      averageLatency: number;
      averageEfficiency: number;
    }>();

    // Initialize stats for each model
    models.forEach(model => {
      modelStats.set(model, {
        generations: 0,
        totalCost: 0,
        totalTokens: 0,
        averageLatency: 0,
        averageEfficiency: 0
      });
    });

    // Analyze each generation
    for (const id of generationIds) {
      try {
        const data = await this.client.getGeneration(id);
        const analytics = getGenerationAnalytics(data.data);
        const model = analytics.overview.model;

        if (modelStats.has(model)) {
          const stats = modelStats.get(model)!;
          stats.generations++;
          stats.totalCost += analytics.overview.totalCost;
          stats.totalTokens += analytics.overview.totalTokens;
          stats.averageLatency = (stats.averageLatency + analytics.overview.latency) / 2;
          stats.averageEfficiency = (stats.averageEfficiency + analytics.summary.score) / 2;
        }
      } catch (error) {
        console.warn(`Failed to analyze generation ${id}:`, error);
      }
    }

    // Display comparison
    console.log('\n📊 MODEL PERFORMANCE COMPARISON');
    console.log('=' .repeat(60));

    models.forEach(model => {
      const stats = modelStats.get(model)!;
      if (stats.generations > 0) {
        console.log(`\n🤖 ${model}`);
        console.log(`   Generations: ${stats.generations}`);
        console.log(`   Total Cost: $${stats.totalCost.toFixed(4)}`);
        console.log(`   Average Cost/Token: $${(stats.totalCost / stats.totalTokens).toFixed(6)}`);
        console.log(`   Average Latency: ${stats.averageLatency.toFixed(0)}ms`);
        console.log(`   Average Efficiency: ${stats.averageEfficiency.toFixed(1)}%`);
      }
    });

    return modelStats;
  }

  /**
   * Example 5: Cache optimization suggestions
   */
  async analyzeCacheOptimization(generationIds: string[]) {
    console.log('🎯 Analyzing cache optimization opportunities');

    const generations: GenerationData[] = [];
    let totalSavings = 0;
    let totalPotentialSavings = 0;

    for (const id of generationIds) {
      const data = await this.client.getGeneration(id);
      generations.push(data.data);
    }

    console.log('\n💾 CACHE ANALYSIS');
    console.log('=' .repeat(50));

    generations.forEach((gen, index) => {
      const analytics = getGenerationAnalytics(gen);
      const cacheAnalysis = analytics.cache;

      console.log(`\nGeneration ${index + 1}: ${gen.id}`);
      console.log(`   Cache Efficiency: ${cacheAnalysis.cacheEfficiency.toFixed(1)}%`);
      console.log(`   Cache Savings: $${cacheAnalysis.cacheSavings.toFixed(6)}`);
      console.log(`   Potential Savings: $${cacheAnalysis.potentialSavings.toFixed(6)}`);

      totalSavings += cacheAnalysis.cacheSavings;
      totalPotentialSavings += cacheAnalysis.potentialSavings;

      if (cacheAnalysis.cacheEfficiency < 30) {
        console.log(`   ⚠️  Low cache efficiency - ${cacheAnalysis.recommendations[0] || 'Consider optimization'}`);
      } else if (cacheAnalysis.cacheEfficiency > 70) {
        console.log(`   ✅ Excellent cache performance!`);
      }
    });

    console.log('\n📈 SUMMARY');
    console.log(`Total Cache Savings: $${totalSavings.toFixed(4)}`);
    console.log(`Total Potential Savings: $${totalPotentialSavings.toFixed(4)}`);
    console.log(`Average Cache Efficiency: ${((totalSavings / (totalSavings + totalPotentialSavings)) * 100).toFixed(1)}%`);

    return {
      totalSavings,
      totalPotentialSavings,
      averageEfficiency: (totalSavings / (totalSavings + totalPotentialSavings)) * 100
    };
  }

  /**
   * Example 6: Automated optimization recommendations
   */
  async generateOptimizationReport(generationIds: string[]) {
    console.log('📋 Generating optimization report');

    const generations: GenerationData[] = [];
    const recommendations = new Map<string, number>();

    for (const id of generationIds) {
      const data = await this.client.getGeneration(id);
      generations.push(data.data);
    }

    // Collect all recommendations
    generations.forEach(gen => {
      const analytics = getGenerationAnalytics(gen);
      analytics.summary.recommendations.forEach(rec => {
        recommendations.set(rec, (recommendations.get(rec) || 0) + 1);
      });
    });

    console.log('\n🎯 OPTIMIZATION RECOMMENDATIONS');
    console.log('=' .repeat(50));

    // Sort by frequency
    const sortedRecs = Array.from(recommendations.entries())
      .sort(([, a], [, b]) => b - a);

    sortedRecs.forEach(([recommendation, frequency], index) => {
      const priority = frequency > generations.length * 0.5 ? '🔴 HIGH' :
                      frequency > generations.length * 0.3 ? '🟡 MEDIUM' : '🟢 LOW';
      console.log(`${index + 1}. ${priority} (${frequency}/${generations.length})`);
      console.log(`   ${recommendation}`);
    });

    return {
      recommendations: sortedRecs,
      totalGenerations: generations.length
    };
  }
}

/**
 * Demonstration function
 */
export async function demonstrateGenerationAnalytics() {
  const example = new GenerationAnalyticsExample({
    type: 'openrouter',
    apiKey: process.env.OPENROUTER_API_KEY!
  });

  console.log('🚀 GENERATION ANALYTICS DEMONSTRATION');
  console.log('=' .repeat(60));

  // Example 1: Single generation analysis
  const generationId = 'gen-12345'; // Replace with actual ID
  console.log('\n1️⃣ SINGLE GENERATION ANALYSIS');
  await example.monitorGenerationRealtime(generationId);

  // Example 2: Batch analysis
  const generationIds = ['gen-123', 'gen-124', 'gen-125']; // Replace with actual IDs
  console.log('\n2️⃣ BATCH ANALYSIS');
  await example.analyzeGenerationBatch(generationIds);

  // Example 3: Cost monitoring setup
  console.log('\n3️⃣ COST MONITORING SETUP');
  const costMonitor = await example.setupCostMonitoring(10.0);
  console.log('Cost monitoring configured with $10 budget limit');

  // Example 4: Model comparison
  console.log('\n4️⃣ MODEL PERFORMANCE COMPARISON');
  await example.compareModelPerformance(
    generationIds,
    ['gpt-5-mini', 'gpt-5-high']
  );

  // Example 5: Cache optimization
  console.log('\n5️⃣ CACHE OPTIMIZATION ANALYSIS');
  await example.analyzeCacheOptimization(generationIds);

  // Example 6: Optimization report
  console.log('\n6️⃣ AUTOMATED OPTIMIZATION REPORT');
  await example.generateOptimizationReport(generationIds);

  console.log('\n✅ Analytics demonstration completed!');
}

export default GenerationAnalyticsExample;
