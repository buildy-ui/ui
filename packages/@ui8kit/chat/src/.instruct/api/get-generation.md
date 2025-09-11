# Get Generation API

## Overview

Returns metadata about a specific generation request. This endpoint provides detailed information about a completed generation including costs, timing, token usage, and provider details.

### Endpoint
- **Method**: GET
- **URL**: `https://openrouter.ai/api/v1/generation`
- **Alternative URL**: `/api/v1/generation`

## Request Example

### JavaScript
```typescript
const url = 'https://openrouter.ai/api/v1/generation?id=gen-12345';
const options = {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  }
};

try {
  const response = await fetch(url, options);
  const data = await response.json();
  console.log(data);
} catch (error) {
  console.error(error);
}
```

## Response Example

**Status**: 200 (Retrieved)

```json
{
  "data": {
    "id": "gen-12345",
    "total_cost": 0.0012,
    "created_at": "2024-01-15T10:30:45Z",
    "model": "openai/gpt-3.5-turbo",
    "origin": "api",
    "usage": 0.0012,
    "is_byok": false,
    "upstream_id": "chatcmpl-abc123",
    "cache_discount": 0.0,
    "upstream_inference_cost": 0.001,
    "app_id": null,
    "streamed": true,
    "cancelled": false,
    "provider_name": "OpenAI",
    "latency": 1200,
    "moderation_latency": 50,
    "generation_time": 1150,
    "finish_reason": "stop",
    "native_finish_reason": "stop",
    "tokens_prompt": 25,
    "tokens_completion": 150,
    "native_tokens_prompt": 25,
    "native_tokens_completion": 150,
    "native_tokens_reasoning": 0,
    "num_media_prompt": 0,
    "num_media_completion": 0,
    "num_search_results": 0
  }
}
```

## Headers

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `Authorization` | string | **Required** | Bearer authentication of the form `Bearer <token>`, where token is your auth token. |

## Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | **Required** | The unique identifier of the generation to retrieve. |

## Response Structure

### Successful Response

| Property | Type | Description |
|----------|------|-------------|
| `data` | object | The generation metadata object. |

#### Generation Data Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | string | Unique identifier of the generation. |
| `total_cost` | number | Total cost of the generation in USD. |
| `created_at` | string | ISO 8601 timestamp when the generation was created. |
| `model` | string | The model used for generation. |
| `origin` | string | The origin of the request (e.g., "api", "web"). |
| `usage` | number | Total usage cost in USD. |
| `is_byok` | boolean | Whether this was a Bring Your Own Key (BYOK) request. |
| `upstream_id` | string \| null | The upstream provider's request ID. |
| `cache_discount` | number \| null | Cache discount applied to the request. |
| `upstream_inference_cost` | number \| null | The actual cost charged by the upstream AI provider for BYOK requests. |
| `app_id` | integer \| null | Application ID if applicable. |
| `streamed` | boolean \| null | Whether the response was streamed. |
| `cancelled` | boolean \| null | Whether the generation was cancelled. |
| `provider_name` | string \| null | Name of the upstream provider. |
| `latency` | integer \| null | Total latency in milliseconds. |
| `moderation_latency` | integer \| null | Latency spent on content moderation in milliseconds. |
| `generation_time` | integer \| null | Time spent on actual generation in milliseconds. |
| `finish_reason` | string \| null | The reason why generation stopped. |
| `native_finish_reason` | string \| null | The native provider's finish reason. |
| `tokens_prompt` | integer \| null | Number of tokens in the prompt. |
| `tokens_completion` | integer \| null | Number of tokens in the completion. |
| `native_tokens_prompt` | integer \| null | Native provider's prompt token count. |
| `native_tokens_completion` | integer \| null | Native provider's completion token count. |
| `native_tokens_reasoning` | integer \| null | Native provider's reasoning token count. |
| `num_media_prompt` | integer \| null | Number of media items in the prompt. |
| `num_media_completion` | integer \| null | Number of media items in the completion. |
| `num_search_results` | integer \| null | Number of search results used in generation. |

### Usage Examples

#### Track Generation Costs
```typescript
const generationId = "gen-12345";
const metadata = await fetch(`https://openrouter.ai/api/v1/generation?id=${generationId}`, {
  headers: { 'Authorization': `Bearer ${token}` }
});
console.log(`Cost: $${metadata.data.total_cost}`);
```

#### Monitor Performance
```typescript
const metadata = await getGenerationData(generationId);
console.log(`Latency: ${metadata.data.latency}ms`);
console.log(`Tokens used: ${metadata.data.tokens_prompt + metadata.data.tokens_completion}`);
```

#### Analyze Provider Usage
```typescript
const metadata = await getGenerationData(generationId);
console.log(`Provider: ${metadata.data.provider_name}`);
console.log(`Model: ${metadata.data.model}`);
console.log(`Was streamed: ${metadata.data.streamed}`);
```

## Advanced Analytics & Monitoring

### Token Usage Analysis

#### Get Token Efficiency Metrics
```typescript
import { AIClient } from '@ui8kit/chat';

const client = new AIClient({
  type: 'openrouter',
  apiKey: process.env.OPENROUTER_API_KEY!
});

// Get generation data
const generationData = await client.getGeneration('gen-12345');

// Analyze token efficiency
const tokenAnalysis = client.analyzeTokenEfficiency(generationData);

console.log('Token Efficiency Analysis:');
console.log(`Total tokens: ${tokenAnalysis.efficiency}`);
console.log(`Cost per token: $${tokenAnalysis.costPerToken.toFixed(6)}`);
console.log(`Cache efficiency: ${tokenAnalysis.cacheEfficiency.toFixed(1)}%`);
console.log('Recommendations:', tokenAnalysis.recommendations);
```

#### Monitor Token Distribution
```typescript
const tokenMonitoring = client.monitorTokenUsage(generationData);

console.log('Token Distribution:');
console.log(`Prompt tokens: ${tokenMonitoring.tokenDistribution.prompt}`);
console.log(`Completion tokens: ${tokenMonitoring.tokenDistribution.completion}`);
console.log(`Reasoning tokens: ${tokenMonitoring.tokenDistribution.reasoning}`);

console.log('Efficiency Metrics:');
console.log(`Completion ratio: ${(tokenMonitoring.efficiencyMetrics.completionRatio * 100).toFixed(1)}%`);
console.log(`Reasoning efficiency: ${tokenMonitoring.efficiencyMetrics.reasoningEfficiency.toFixed(2)}`);

console.log('Cost Breakdown:');
console.log(`Base cost: $${tokenMonitoring.costBreakdown.baseCost.toFixed(6)}`);
console.log(`Cache discount: $${tokenMonitoring.costBreakdown.cacheDiscount.toFixed(6)}`);
console.log(`Final cost: $${tokenMonitoring.costBreakdown.finalCost.toFixed(6)}`);
```

### Cache Performance Monitoring

#### Analyze Cache Efficiency
```typescript
const cacheAnalysis = client.analyzeCachePerformance(generationData);

console.log('Cache Performance Analysis:');
console.log(`Cache hit rate: ${cacheAnalysis.cacheHitRate.toFixed(1)}%`);
console.log(`Potential savings: $${cacheAnalysis.potentialSavings.toFixed(6)}`);
console.log(`Cache efficiency: ${cacheAnalysis.cacheEfficiency.toFixed(1)}%`);
console.log('Recommendations:', cacheAnalysis.recommendations);
```

#### Real-time Cache Monitoring
```typescript
// Monitor cache performance in real-time
async function monitorCacheEfficiency(generationIds: string[]) {
  const results = [];

  for (const id of generationIds) {
    const data = await client.getGeneration(id);
    const cacheAnalysis = client.analyzeCachePerformance(data);
    results.push({
      id,
      cacheEfficiency: cacheAnalysis.cacheEfficiency,
      savings: cacheAnalysis.potentialSavings
    });
  }

  // Calculate average cache efficiency
  const avgEfficiency = results.reduce((sum, r) => sum + r.cacheEfficiency, 0) / results.length;
  const totalSavings = results.reduce((sum, r) => sum + r.savings, 0);

  console.log(`Average cache efficiency: ${avgEfficiency.toFixed(1)}%`);
  console.log(`Total potential savings: $${totalSavings.toFixed(4)}`);
}
```

### Advanced Cost Analysis

#### Detailed Cost Breakdown
```typescript
// Get comprehensive cost analysis
const generationData = await client.getGeneration('gen-12345');

// Use analytics utilities for detailed analysis
import {
  getGenerationAnalytics,
  analyzeGenerationBatch
} from '@ui8kit/chat/utils/generation-analytics';

const analytics = getGenerationAnalytics(generationData.data);

console.log('=== COMPREHENSIVE ANALYSIS ===');
console.log(`Generation ID: ${analytics.overview.id}`);
console.log(`Model: ${analytics.overview.model}`);
console.log(`Provider: ${analytics.overview.provider}`);
console.log(`Total Cost: $${analytics.overview.totalCost.toFixed(6)}`);
console.log(`Total Tokens: ${analytics.overview.totalTokens}`);
console.log(`Latency: ${analytics.overview.latency}ms`);

console.log('\n=== EFFICIENCY SCORE ===');
console.log(`Overall Score: ${analytics.summary.score.toFixed(1)}/100`);
console.log(`Grade: ${analytics.summary.grade}`);

console.log('\n=== TOKEN ANALYSIS ===');
console.log(`Efficiency: ${(analytics.tokens.efficiency * 100).toFixed(1)}%`);
console.log(`Cost per Token: $${analytics.tokens.costPerToken.toFixed(6)}`);

console.log('\n=== CACHE ANALYSIS ===');
console.log(`Cache Efficiency: ${analytics.cache.cacheEfficiency.toFixed(1)}%`);
console.log(`Cache Savings: $${analytics.cache.cacheSavings.toFixed(6)}`);
console.log(`Potential Savings: $${analytics.cache.potentialSavings.toFixed(6)}`);

console.log('\n=== PERFORMANCE ANALYSIS ===');
console.log(`Throughput: ${analytics.performance.throughput.toFixed(1)} tokens/sec`);
console.log(`Generation Time: ${analytics.performance.latencyBreakdown.generation}ms`);
console.log(`Network Latency: ${analytics.performance.latencyBreakdown.network}ms`);

console.log('\n=== RECOMMENDATIONS ===');
analytics.summary.recommendations.forEach((rec, index) => {
  console.log(`${index + 1}. ${rec}`);
});
```

#### Batch Analysis for Multiple Generations
```typescript
// Analyze multiple generations at once
const generationIds = ['gen-123', 'gen-124', 'gen-125'];
const generations = [];

for (const id of generationIds) {
  const data = await client.getGeneration(id);
  generations.push(data.data);
}

const batchAnalysis = analyzeGenerationBatch(generations);

console.log('=== BATCH ANALYSIS ===');
console.log(`Total Generations: ${batchAnalysis.summary.totalGenerations}`);
console.log(`Total Cost: $${batchAnalysis.summary.totalCost.toFixed(4)}`);
console.log(`Total Tokens: ${batchAnalysis.summary.totalTokens}`);
console.log(`Average Latency: ${batchAnalysis.summary.averageLatency.toFixed(0)}ms`);
console.log(`Average Cost/Token: $${batchAnalysis.summary.averageCostPerToken.toFixed(6)}`);
console.log(`Cache Savings: $${batchAnalysis.summary.cacheSavings.toFixed(4)}`);

console.log('\n=== TOP RECOMMENDATIONS ===');
batchAnalysis.topRecommendations.forEach((rec, index) => {
  console.log(`${index + 1}. ${rec}`);
});
```

### Performance Monitoring

#### Real-time Performance Tracking
```typescript
class PerformanceMonitor {
  private client: AIClient;
  private metrics: Map<string, any[]> = new Map();

  constructor(client: AIClient) {
    this.client = client;
  }

  async trackGeneration(generationId: string) {
    const data = await this.client.getGeneration(generationId);
    const analytics = getGenerationAnalytics(data.data);

    // Store metrics by model
    const model = analytics.overview.model;
    if (!this.metrics.has(model)) {
      this.metrics.set(model, []);
    }

    this.metrics.get(model)!.push({
      timestamp: new Date(),
      cost: analytics.overview.totalCost,
      tokens: analytics.overview.totalTokens,
      latency: analytics.overview.latency,
      efficiency: analytics.summary.score
    });
  }

  getModelStats(model: string) {
    const modelMetrics = this.metrics.get(model) || [];
    if (modelMetrics.length === 0) return null;

    const avgCost = modelMetrics.reduce((sum, m) => sum + m.cost, 0) / modelMetrics.length;
    const avgTokens = modelMetrics.reduce((sum, m) => sum + m.tokens, 0) / modelMetrics.length;
    const avgLatency = modelMetrics.reduce((sum, m) => sum + m.latency, 0) / modelMetrics.length;
    const avgEfficiency = modelMetrics.reduce((sum, m) => sum + m.efficiency, 0) / modelMetrics.length;

    return {
      model,
      sampleSize: modelMetrics.length,
      averageCost: avgCost,
      averageTokens: avgTokens,
      averageLatency: avgLatency,
      averageEfficiency: avgEfficiency,
      costPerToken: avgTokens > 0 ? avgCost / avgTokens : 0
    };
  }

  getAllStats() {
    const stats = [];
    for (const model of this.metrics.keys()) {
      const modelStats = this.getModelStats(model);
      if (modelStats) stats.push(modelStats);
    }
    return stats;
  }
}

// Usage
const monitor = new PerformanceMonitor(client);
await monitor.trackGeneration('gen-12345');

const gpt4Stats = monitor.getModelStats('openai/gpt-4');
if (gpt4Stats) {
  console.log(`GPT-4 Performance:`);
  console.log(`Average cost: $${gpt4Stats.averageCost.toFixed(4)}`);
  console.log(`Average efficiency: ${gpt4Stats.averageEfficiency.toFixed(1)}%`);
}
```

### Cost Optimization Strategies

#### Smart Model Selection
```typescript
async function selectOptimalModel(prompt: string, requirements: {
  maxCost?: number;
  maxLatency?: number;
  minQuality?: number;
}) {
  const models = [
    { name: 'openai/gpt-3.5-turbo', costPerToken: 0.0000015 },
    { name: 'openai/gpt-4', costPerToken: 0.00003 },
    { name: 'anthropic/claude-3-haiku', costPerToken: 0.0000025 }
  ];

  // Test each model with a sample prompt
  const results = [];
  for (const model of models) {
    try {
      const response = await client.chatCompletion({
        model: model.name,
        messages: [{ role: 'user', content: prompt.substring(0, 100) }],
        parameters: { max_tokens: 50 }
      });

      const cost = (response.usage?.total_tokens || 0) * model.costPerToken;
      results.push({
        model: model.name,
        cost,
        latency: response.usage?.latency || 0,
        quality: response.choices[0]?.message?.content?.length || 0
      });
    } catch (error) {
      console.warn(`Failed to test ${model.name}:`, error);
    }
  }

  // Select best model based on requirements
  const optimal = results
    .filter(r => !requirements.maxCost || r.cost <= requirements.maxCost)
    .filter(r => !requirements.maxLatency || r.latency <= requirements.maxLatency)
    .filter(r => !requirements.minQuality || r.quality >= requirements.minQuality)
    .sort((a, b) => a.cost - b.cost)[0];

  return optimal?.model || models[0].name;
}
```

#### Cache Optimization
```typescript
async function optimizeForCache(prompt: string, history: Message[] = []) {
  // Extract common patterns from history
  const commonPatterns = extractCommonPatterns(history);

  // Modify prompt to match cache patterns
  const optimizedPrompt = adaptPromptForCache(prompt, commonPatterns);

  // Use consistent parameters for better cache hits
  const response = await client.chatCompletion({
    model: 'openai/gpt-4',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      ...history.slice(-3), // Keep recent context
      { role: 'user', content: optimizedPrompt }
    ],
    parameters: {
      temperature: 0.7, // Consistent temperature
      max_tokens: 1000,
      // Use consistent parameter values for better cache hits
    }
  });

  return response;
}

function extractCommonPatterns(history: Message[]): string[] {
  // Analyze history for common prompt patterns
  const userMessages = history.filter(m => m.role === 'user');
  const patterns = [];

  // Simple pattern extraction (can be enhanced with NLP)
  if (userMessages.some(m => m.content?.includes('explain'))) {
    patterns.push('explanation');
  }
  if (userMessages.some(m => m.content?.includes('code'))) {
    patterns.push('coding');
  }

  return patterns;
}

function adaptPromptForCache(prompt: string, patterns: string[]): string {
  // Adapt prompt to match common patterns for better cache hits
  let adaptedPrompt = prompt;

  if (patterns.includes('explanation') && !prompt.includes('explain')) {
    adaptedPrompt = `Please explain: ${prompt}`;
  }

  if (patterns.includes('coding') && !prompt.includes('code')) {
    adaptedPrompt = `Write code for: ${prompt}`;
  }

  return adaptedPrompt;
}
```

## API Reference

### AIClient Methods

#### `getGeneration(generationId: string)`
Получить метаданные генерации по ID.

#### `analyzeTokenEfficiency(generationData: any)`
Анализировать эффективность использования токенов.

#### `analyzeCachePerformance(generationData: any)`
Анализировать производительность кэширования.

#### `monitorTokenUsage(generationData: any)`
Мониторить распределение токенов.

### Analytics Functions

#### `getGenerationAnalytics(generation: GenerationData)`
Получить комплексный анализ генерации.

#### `analyzeGenerationBatch(generations: GenerationData[])`
Анализировать пакет генераций.

#### `calculateTokenEfficiency(generation: GenerationData)`
Рассчитать метрики эффективности токенов.

#### `analyzeCachePerformance(generation: GenerationData)`
Анализировать производительность кэша.

#### `analyzePerformance(generation: GenerationData)`
Анализировать метрики производительности.

#### `calculateCostEfficiency(generation: GenerationData)`
Рассчитать эффективность затрат.

## Best Practices

### 1. **Регулярный мониторинг**
```typescript
// Настройте регулярный мониторинг генераций
setInterval(async () => {
  const analytics = await client.getUsageAnalytics({ limit: 100 });
  console.log(`Total cost: $${analytics.totalCost.toFixed(4)}`);
  console.log(`Cache savings: $${analytics.cacheSavings.toFixed(4)}`);

  if (analytics.totalCost > BUDGET_LIMIT) {
    console.warn('Budget limit exceeded!');
  }
}, 3600000); // Каждый час
```

### 2. **Оптимизация кэша**
```typescript
// Используйте консистентные промпты для лучшего кэширования
const systemPrompt = "You are a helpful coding assistant. Always provide clear, concise answers with code examples.";

const response = await client.chatCompletion({
  model: 'openai/gpt-4',
  messages: [
    { role: 'system', content: systemPrompt }, // Консистентный промпт
    { role: 'user', content: userQuery }
  ],
  parameters: {
    temperature: 0.7, // Консистентные параметры
    max_tokens: 1000
  }
});
```

### 3. **Автоматическая оптимизация**
```typescript
// Автоматически выбирать оптимальную модель
async function getOptimalModel(userQuery: string) {
  const models = ['openai/gpt-3.5-turbo', 'openai/gpt-4', 'anthropic/claude-3-haiku'];

  let bestModel = models[0];
  let bestScore = 0;

  for (const model of models) {
    try {
      const response = await client.chatCompletion({
        model,
        messages: [{ role: 'user', content: userQuery.substring(0, 50) }],
        parameters: { max_tokens: 10 }
      });

      // Простая оценка качества (можно улучшить)
      const score = (response.choices[0]?.message?.content?.length || 0) /
                   (response.usage?.total_tokens || 1);

      if (score > bestScore) {
        bestScore = score;
        bestModel = model;
      }
    } catch (error) {
      console.warn(`Model ${model} failed:`, error);
    }
  }

  return bestModel;
}
```

### 4. **Cost Alert System**
```typescript
class CostMonitor {
  private client: AIClient;
  private budget: number;
  private alerts: ((message: string) => void)[];

  constructor(client: AIClient, budget: number) {
    this.client = client;
    this.budget = budget;
    this.alerts = [];
  }

  addAlertCallback(callback: (message: string) => void) {
    this.alerts.push(callback);
  }

  async checkBudget() {
    const analytics = await this.client.getUsageAnalytics({ limit: 1000 });

    if (analytics.totalCost > this.budget * 0.8) {
      const message = `Budget usage: ${(analytics.totalCost / this.budget * 100).toFixed(1)}% ($${analytics.totalCost.toFixed(4)})`;
      this.alerts.forEach(callback => callback(message));
    }

    return analytics;
  }
}

// Usage
const costMonitor = new CostMonitor(client, 10.00); // $10 budget
costMonitor.addAlertCallback(message => {
  console.warn('💰 COST ALERT:', message);
});

// Check budget periodically
setInterval(() => costMonitor.checkBudget(), 300000); // Every 5 minutes
```