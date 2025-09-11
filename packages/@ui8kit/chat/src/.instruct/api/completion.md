# Completion API

## Overview

Send a completion request to a selected model (text-only format). The request must contain a "prompt" parameter. All advanced options from the base request are also supported.

### Endpoint
- **Method**: POST
- **URL**: `https://openrouter.ai/api/v1/completions`
- **Alternative URL**: `/api/v1/completions`

## Request Example

### JavaScript
```typescript
const url = 'https://openrouter.ai/api/v1/completions';
const options = {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    "model": "openai/gpt-3.5-turbo",
    "prompt": "The meaning of life is"
  })
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

**Status**: 200 (Successful)

```json
{
  "id": "gen-12345",
  "choices": [
    {
      "text": "a complex and subjective question that has been pondered by philosophers...",
      "index": 0,
      "finish_reason": "stop"
    }
  ]
}
```

## Headers

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `Authorization` | string | **Required** | Bearer authentication of the form `Bearer <token>`, where token is your auth token. |

## Request Parameters

This endpoint expects an object with the following parameters:

### Core Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `model` | string | **Required** | The model ID to use. If unspecified, the user's default is used. |
| `prompt` | string | **Required** | The text prompt to complete. |

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `models` | array of strings | Optional | Alternate list of models for routing overrides. |
| `provider` | object | Optional | Preferences for provider routing. |

#### Provider Preferences
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `sort` | string | Optional | Sort preference (e.g., price, throughput). |

### Reasoning Configuration

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `reasoning` | object | Optional | Configuration for model reasoning/thinking tokens. |

#### Reasoning Properties
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `effort` | enum | Optional | OpenAI-style reasoning effort setting. Allowed values: `high`, `medium`, `low` |
| `max_tokens` | integer | Optional | Non-OpenAI-style reasoning effort setting. Cannot be used simultaneously with `effort`. |
| `exclude` | boolean | Optional | Defaults to `false`. Whether to exclude reasoning from the response. |

### Usage Configuration

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `usage` | object | Optional | Whether to include usage information in the response. |

#### Usage Properties
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `include` | boolean | Optional | Whether to include usage information in the response. |

### Additional Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `transforms` | array of strings | Optional | List of prompt transforms (OpenRouter-only). |
| `stream` | boolean | Optional | Defaults to `false`. Enable streaming of results. |
| `max_tokens` | integer | Optional | Maximum number of tokens (range: [1, context_length)). |
| `temperature` | number | Optional | Sampling temperature (range: [0, 2]). |
| `seed` | integer | Optional | Seed for deterministic outputs. |
| `top_p` | number | Optional | Top-p sampling value (range: (0, 1]). |
| `top_k` | integer | Optional | Top-k sampling value (range: [1, Infinity)). |
| `frequency_penalty` | number | Optional | Frequency penalty (range: [-2, 2]). |
| `presence_penalty` | number | Optional | Presence penalty (range: [-2, 2]). |
| `repetition_penalty` | number | Optional | Repetition penalty (range: (0, 2]). |
| `logit_bias` | object | Optional | Mapping of token IDs to bias values. |
| `top_logprobs` | integer | Optional | Number of top log probabilities to return. |
| `min_p` | number | Optional | Minimum probability threshold (range: [0, 1]). |
| `top_a` | number | Optional | Alternate top sampling parameter (range: [0, 1]). |
| `user` | string | Optional | A stable identifier for your end-users. Used to help detect and prevent abuse. |

## Response Structure

### Successful Completion

| Property | Type | Description |
|----------|------|-------------|
| `id` | string \| null | Unique identifier for the completion. |
| `choices` | array of objects \| null | List of completion choices. |

#### Choice Structure
Each choice object contains:

| Property | Type | Description |
|----------|------|-------------|
| `text` | string \| null | The completed text. |
| `index` | integer \| null | The index of this completion in the choices array. |
| `finish_reason` | string \| null | The reason why the completion stopped (e.g., "stop", "length"). |

Additional response properties include:
- `provider`: The provider that handled the request
- `model`: The model that was used
- `object`: The object type (always "text_completion")
- `created`: Unix timestamp of when the completion was created
- `usage`: Token usage statistics
Was this page helpful?
Yes
