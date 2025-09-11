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