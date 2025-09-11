# @ui8kit/chat - Provider-Agnostic AI Client

Универсальный клиент для работы с различными AI провайдерами через единый интерфейс.

## 🎯 Особенности

- **Независимость от провайдера**: Один интерфейс для OpenRouter, OpenAI, Anthropic и других
- **Автоматическая трансформация параметров**: Специфичные параметры провайдеров обрабатываются автоматически
- **TypeScript**: Полная типизация для лучшего DX
- **Streaming**: Поддержка потоковых ответов
- **Tool Calling**: Встроенная поддержка инструментов
- **Расширяемость**: Легко добавить новый провайдер

## 📦 Установка

```bash
npm install @ui8kit/chat
```

## 🚀 Быстрый старт

```typescript
import { AIClient } from '@ui8kit/chat';

// Создаем клиент с OpenRouter
const client = new AIClient({
  type: 'openrouter',
  apiKey: process.env.OPENROUTER_API_KEY!
});

// Простая генерация текста
const text = await client.generateText(
  'Объясни квантовые вычисления простыми словами'
);

// Chat с историей сообщений
const response = await client.chat([
  { role: 'system', content: 'Ты - эксперт по JavaScript' },
  { role: 'user', content: 'Как работает замыкание?' }
]);
```

## 🏗️ Архитектура

### Core компоненты

```
src/
├── core/
│   ├── interfaces.ts      # Типы и интерфейсы
│   ├── base-provider.ts   # Абстрактный базовый класс
│   └── ai-client.ts       # Главный клиент
├── providers/
│   ├── openrouter-provider.ts
│   ├── openai-provider.ts
│   └── provider-factory.ts
└── examples/
    └── usage-examples.ts
```

### Интерфейсы

```typescript
interface CompletionRequest {
  model: string;
  prompt: string;
  parameters?: CommonParameters & ProviderSpecificParameters;
}

interface ChatCompletionRequest {
  model: string;
  messages: Message[];
  parameters?: CommonParameters & ProviderSpecificParameters;
}
```

## 🔧 Поддерживаемые провайдеры

### OpenRouter
```typescript
const client = new AIClient({
  type: 'openrouter',
  apiKey: 'your-api-key',
  baseURL: 'https://openrouter.ai/api/v1' // опционально
});
```

**Специфичные параметры OpenRouter:**
- `verbosity`: `'low' | 'medium' | 'high'`
- `reasoning`: Конфигурация reasoning токенов
- `transforms`: Промпт трансформации

### OpenAI
```typescript
const client = new AIClient({
  type: 'openai',
  apiKey: 'your-api-key'
});
```

**Специфичные параметры OpenAI:**
- `min_p`: Минимальная вероятность
- `top_a`: Альтернативный top sampling
- `structured_outputs`: Структурированные выходы

## 📋 Общие параметры

| Параметр | Тип | Описание | Поддержка |
|-----------|-----|----------|-----------|
| `temperature` | number | Температура выборки (0-2) | ✅ Все |
| `top_p` | number | Top-p sampling (0-1) | ✅ Все |
| `top_k` | number | Top-k sampling | ✅ Большинство |
| `max_tokens` | number | Максимум токенов | ✅ Все |
| `stop` | string[] | Стоп-токены | ✅ Все |
| `tools` | Tool[] | Инструменты | ✅ Современные модели |
| `stream` | boolean | Потоковый режим | ✅ Все |

## 🎨 Примеры использования

### 1. Переключение провайдеров

```typescript
const client = new AIClient({
  type: 'openai',
  apiKey: process.env.OPENAI_API_KEY!
});

// Используем OpenAI
const openaiResult = await client.generateText('Hello world');

// Переключаемся на OpenRouter
client.setProvider({
  type: 'openrouter',
  apiKey: process.env.OPENROUTER_API_KEY!
});

// Тот же интерфейс работает с любым провайдером
const orResult = await client.generateText('Hello world');
```

### 2. Agent-style разговор

```typescript
const response = await client.agentChat(
  'Создай REST API для управления пользователями',
  'Ты - senior fullstack разработчик. Предоставляй production-ready код.',
  'openai/gpt-4',
  { max_tokens: 1000 }
);
```

### 3. Специфичные параметры провайдера

```typescript
// OpenRouter с verbosity
const response = await client.chatCompletion({
  model: 'anthropic/claude-3-sonnet',
  messages: [{ role: 'user', content: 'Объясни нейросети' }],
  parameters: {
    temperature: 0.7,
    verbosity: 'high' // Только для OpenRouter
  }
});
```

### 4. Streaming

```typescript
const stream = client.chatCompletionStream({
  model: 'openai/gpt-4',
  messages: [{ role: 'user', content: 'Напиши рассказ' }]
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || '');
}
```

### 5. Tool Calling

```typescript
const tools = [{
  type: 'function',
  function: {
    name: 'get_weather',
    description: 'Получить погоду',
    parameters: {
      type: 'object',
      properties: { location: { type: 'string' } }
    }
  }
}];

const response = await client.chatCompletion({
  model: 'openai/gpt-4',
  messages: [{ role: 'user', content: 'Какая погода в Москве?' }],
  parameters: { tools, tool_choice: 'auto' }
});
```

## 🔧 Добавление нового провайдера

1. Создайте новый класс провайдера:

```typescript
export class AnthropicProvider extends BaseAIProvider {
  protected getDefaultBaseURL(): string {
    return 'https://api.anthropic.com/v1';
  }

  protected transformParameters(common: CommonParameters, provider: ProviderSpecificParameters) {
    // Трансформация параметров для Anthropic
    return { ...common, ...provider };
  }

  protected mapModelName(model: string): string {
    return model; // Или маппинг если нужно
  }

  protected async makeRequest(endpoint: string, method: 'GET' | 'POST', body?: any) {
    // Специфичная логика запросов для Anthropic
  }

  protected normalizeResponse(response: any): CompletionResponse {
    // Нормализация ответа к общему формату
  }
}
```

2. Добавьте провайдер в фабрику:

```typescript
// provider-factory.ts
export type ProviderType = 'openrouter' | 'openai' | 'anthropic';

export class ProviderFactory {
  static createProvider(config: ProviderConfig): BaseAIProvider {
    switch (config.type) {
      case 'anthropic':
        return new AnthropicProvider(config.apiKey, config.baseURL);
      // ... остальные провайдеры
    }
  }
}
```

## 🧪 Тестирование

```typescript
import { basicExample, streamingExample } from './examples/usage-examples';

// Запуск примеров
basicExample().then(() => console.log('Basic example completed'));
streamingExample().then(() => console.log('Streaming example completed'));
```

## 📚 API Reference

- [BaseAIProvider](./core/base-provider.ts) - Абстрактный базовый класс
- [AIClient](./core/ai-client.ts) - Главный клиент
- [Interfaces](./core/interfaces.ts) - Типы и интерфейсы
- [Examples](./examples/usage-examples.ts) - Примеры использования

## 🤝 Вклад в проект

1. Fork репозиторий
2. Создайте feature branch
3. Добавьте новый провайдер или улучшения
4. Напишите тесты
5. Создайте Pull Request

## 📄 Лицензия

MIT License - см. [LICENSE](../LICENSE) файл.
