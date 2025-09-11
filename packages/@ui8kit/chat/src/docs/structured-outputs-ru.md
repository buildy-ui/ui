# 🎯 Structured Outputs

Полная поддержка структурированных выводов для получения консистентных, type-safe ответов от AI моделей.

## 📋 Обзор

Structured Outputs позволяют:

- ✅ **Принудительно структурировать** ответы AI согласно JSON Schema
- ✅ **Обеспечивать консистентность** данных для парсинга
- ✅ **Избегать ошибок парсинга** и галлюцинаций полей
- ✅ **Упрощать обработку** ответов в приложениях
- ✅ **Поддерживать потоковую передачу** со структурированными данными

## 🚀 Быстрый старт

### Базовое использование

```typescript
import { AIClient, CommonSchemas } from '@ui8kit/chat';

const client = new AIClient({
  type: 'openrouter',
  apiKey: process.env.OPENROUTER_API_KEY!
});

// Использование готовой схемы погоды
const response = await client.chatCompletion({
  model: 'openai/gpt-4',
  messages: [{ role: 'user', content: 'Какая погода в Москве?' }],
  parameters: {
    response_format: CommonSchemas.weather,
    temperature: 0.1 // Низкая температура для консистентности
  }
});

// Ответ будет строго соответствовать схеме
const weatherData = JSON.parse(response.choices[0].message.content);
console.log(weatherData.location); // "Moscow"
console.log(weatherData.temperature); // 15
```

### Создание кастомной схемы

```typescript
import {
  createStructuredOutput,
  createObjectSchema,
  createStringProperty,
  createNumberProperty
} from '@ui8kit/chat';

// Создание схемы для пользователя
const userSchema = createStructuredOutput(
  'user_profile',
  createObjectSchema({
    name: createStringProperty({ description: 'Имя пользователя' }),
    age: createNumberProperty({
      description: 'Возраст',
      minimum: 0,
      maximum: 150
    }),
    email: createStringProperty({
      description: 'Email адрес',
      pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'
    }),
    interests: createArrayProperty(
      createStringProperty({ description: 'Интерес' }),
      { description: 'Список интересов' }
    )
  }, {
    required: ['name', 'email'],
    description: 'Профиль пользователя'
  }),
  { strict: true }
);

// Использование схемы
const response = await client.chatCompletion({
  model: 'openai/gpt-4',
  messages: [{ role: 'user', content: 'Расскажи о себе как разработчике' }],
  parameters: {
    response_format: userSchema
  }
});
```

## 🏗️ Архитектура

### Типы данных

```typescript
// Основные типы для структурированных выводов
interface StructuredOutputConfig {
  type: 'json_schema';
  json_schema: {
    name: string;
    description?: string;
    strict: boolean;
    schema: JSONSchema;
  };
}

interface JSONSchema {
  type: string;
  properties?: Record<string, JSONSchemaProperty>;
  required?: string[];
  additionalProperties?: boolean;
  // ... другие JSON Schema поля
}
```

### Валидация схем

Архитектура включает встроенную валидацию:

```typescript
import { validateStructuredResponse, parseStructuredResponse } from '@ui8kit/chat';

// Валидация ответа
const response = await client.chatCompletion({...});
const content = response.choices[0].message.content;

const validation = validateStructuredResponse(
  JSON.parse(content),
  userSchema.json_schema.schema
);

if (validation.valid) {
  console.log('✅ Ответ соответствует схеме');
} else {
  console.log('❌ Ошибки валидации:', validation.errors);
}

// Или использовать готовый парсер
const parsed = parseStructuredResponse(content, userSchema.json_schema.schema);
if (parsed.success) {
  console.log('Данные:', parsed.data);
}
```

## 🎨 Встроенные схемы

### CommonSchemas

Библиотека включает готовые схемы для распространенных случаев:

```typescript
import { CommonSchemas } from '@ui8kit/chat';

// Погода
CommonSchemas.weather
// Продукт
CommonSchemas.product
// Список задач
CommonSchemas.taskList
// Анализ кода
CommonSchemas.codeAnalysis
```

### Примеры использования готовых схем

#### Погода
```typescript
const weatherResponse = await client.chatCompletion({
  model: 'openai/gpt-4',
  messages: [{ role: 'user', content: 'Какая погода в СПб?' }],
  parameters: { response_format: CommonSchemas.weather }
});

// Результат:
// {
//   "location": "Saint Petersburg",
//   "temperature": 18,
//   "conditions": "Облачно с прояснениями"
// }
```

#### Продукт
```typescript
const productResponse = await client.chatCompletion({
  model: 'anthropic/claude-3-sonnet',
  messages: [{ role: 'user', content: 'Опиши iPhone 15 Pro' }],
  parameters: { response_format: CommonSchemas.product }
});

// Результат:
// {
//   "name": "iPhone 15 Pro",
//   "price": 999,
//   "category": "Smartphone",
//   "description": "Флагманский смартфон Apple"
// }
```

#### Список задач
```typescript
const taskResponse = await client.chatCompletion({
  model: 'openai/gpt-4',
  messages: [{ role: 'user', content: 'Создай план разработки веб-приложения' }],
  parameters: { response_format: CommonSchemas.taskList }
});

// Результат:
// {
//   "tasks": [
//     { "title": "Настроить проект", "priority": "high" },
//     { "title": "Создать компоненты", "priority": "medium" }
//   ],
//   "total_tasks": 5
// }
```

## 🔧 Создание схем

### Вспомогательные функции

```typescript
import {
  createStructuredOutput,
  createObjectSchema,
  createStringProperty,
  createNumberProperty,
  createBooleanProperty,
  createArrayProperty
} from '@ui8kit/chat';

// Создание простой схемы
const simpleSchema = createStructuredOutput(
  'person',
  createObjectSchema({
    name: createStringProperty({
      description: 'Имя человека',
      minLength: 2,
      maxLength: 50
    }),
    age: createNumberProperty({
      description: 'Возраст в годах',
      minimum: 0,
      maximum: 150
    }),
    is_student: createBooleanProperty({
      description: 'Студент ли человек',
      default: false
    })
  }, {
    required: ['name'],
    additionalProperties: false
  })
);
```

### Сложные схемы

```typescript
// Схема для заказа
const orderSchema = createStructuredOutput(
  'order',
  createObjectSchema({
    order_id: createStringProperty({ description: 'ID заказа' }),
    customer: createObjectSchema({
      name: createStringProperty({ description: 'Имя клиента' }),
      email: createStringProperty({ description: 'Email клиента' })
    }, { required: ['name', 'email'] }),
    items: createArrayProperty(
      createObjectSchema({
        product_id: createStringProperty({ description: 'ID продукта' }),
        quantity: createNumberProperty({
          description: 'Количество',
          minimum: 1
        }),
        price: createNumberProperty({
          description: 'Цена за единицу',
          minimum: 0
        })
      }, { required: ['product_id', 'quantity', 'price'] }),
      { description: 'Список товаров в заказе' }
    ),
    total_amount: createNumberProperty({
      description: 'Общая сумма заказа',
      minimum: 0
    })
  }, {
    required: ['order_id', 'customer', 'items', 'total_amount']
  })
);
```

## 🌊 Потоковая передача

Structured Outputs полностью поддерживают потоковую передачу:

```typescript
const stream = client.chatCompletionStream({
  model: 'openai/gpt-4',
  messages: [{ role: 'user', content: 'Опиши погоду в Токио' }],
  parameters: {
    response_format: CommonSchemas.weather,
    stream: true
  }
});

let accumulatedContent = '';

for await (const chunk of stream) {
  if (chunk.choices[0]?.delta?.content) {
    accumulatedContent += chunk.choices[0].delta.content;

    // Попытка парсинга частичного JSON
    try {
      const partialData = JSON.parse(accumulatedContent);
      console.log('Частичные данные:', partialData);
    } catch {
      // JSON еще не полон
      console.log('Накоплено:', accumulatedContent.length, 'символов');
    }
  }
}
```

## 🔄 Поддержка провайдеров

### OpenRouter
- ✅ Полная поддержка `json_schema` формата
- ✅ Преобразование legacy `json_object` в `json_schema`
- ✅ Специфичные параметры провайдера

### OpenAI
- ✅ Нативная поддержка структурированных выводов
- ✅ GPT-4o и более новые модели
- ✅ Автоматическое преобразование форматов

### Fireworks
- ✅ Полная поддержка через OpenRouter
- ✅ Все модели с поддержкой структурированных выводов

## 🛠️ Расширенные возможности

### Кастомные валидаторы

```typescript
// Создание кастомного валидатора
function customValidator(data: any, schema: JSONSchema): boolean {
  // Ваша логика валидации
  return true;
}

// Использование в схеме
const customSchema = createStructuredOutput('custom', schema, {
  validator: customValidator
});
```

### Контекстная валидация

```typescript
// Валидация с учетом контекста
const contextValidator = (data: any, context: ValidationContext) => {
  // Проверка данных с учетом контекста запроса
  return data.user_id === context.userId;
};
```

### Преобразование данных

```typescript
// Преобразование ответа после валидации
const transformer = (data: any) => {
  return {
    ...data,
    created_at: new Date(),
    processed: true
  };
};
```

## 📊 Мониторинг и отладка

### Валидация в реальном времени

```typescript
// Включение детального логирования
const client = new AIClient({
  type: 'openrouter',
  apiKey: apiKey,
  options: {
    structuredOutputValidation: true,
    logValidationErrors: true
  }
});
```

### Метрики использования

```typescript
// Получение статистики структурированных выводов
const metrics = await client.getStructuredOutputMetrics();

// Пример метрик:
// {
//   totalRequests: 100,
//   successfulValidations: 95,
//   validationErrors: 5,
//   averageResponseTime: 1200,
//   schemaUsage: { weather: 40, product: 30, custom: 30 }
// }
```

## 🎯 Лучшие практики

### 1. **Выбирайте подходящие модели**
```typescript
// Для простых схем используйте быстрые модели
const simpleResponse = await client.chatCompletion({
  model: 'anthropic/claude-3-haiku', // Быстрая модель
  parameters: { response_format: simpleSchema }
});

// Для сложных схем используйте мощные модели
const complexResponse = await client.chatCompletion({
  model: 'openai/gpt-4', // Мощная модель
  parameters: { response_format: complexSchema }
});
```

### 2. **Оптимизируйте схемы**
```typescript
// Хорошая практика
const optimizedSchema = createObjectSchema({
  title: createStringProperty({ maxLength: 100 }),
  summary: createStringProperty({ maxLength: 500 }),
  tags: createArrayProperty(
    createStringProperty({ maxLength: 20 }),
    { maxItems: 10 }
  )
}, {
  required: ['title'],
  additionalProperties: false
});
```

### 3. **Обработка ошибок**
```typescript
try {
  const response = await client.chatCompletion({
    model: 'openai/gpt-4',
    messages: messages,
    parameters: { response_format: schema }
  });

  const parsed = parseStructuredResponse(
    response.choices[0].message.content,
    schema.json_schema.schema
  );

  if (!parsed.success) {
    // Обработка ошибок валидации
    console.error('Validation failed:', parsed.error);
    // Fallback логика
  }

} catch (error) {
  // Обработка ошибок API
  if (error.message.includes('structured outputs')) {
    // Модель не поддерживает структурированные выводы
    // Используйте альтернативный подход
  }
}
```

### 4. **Производительность**
```typescript
// Используйте кеширование для часто используемых схем
const cachedWeatherSchema = await schemaCache.get('weather') ||
  createStructuredOutput('weather', weatherDefinition);

const response = await client.chatCompletion({
  model: 'openai/gpt-4',
  messages: messages,
  parameters: {
    response_format: cachedWeatherSchema,
    temperature: 0.1 // Низкая температура для консистентности
  }
});
```

## 🔗 Интеграция с инструментами

Structured Outputs отлично работают с инструментами:

```typescript
// Инструмент возвращает структурированные данные
const weatherTool = new WebSearchTool();
weatherTool.setResponseFormat(CommonSchemas.weather);

// AI использует инструмент и получает структурированный ответ
const result = await toolManager.executeToolCall(toolCall, context);
const validated = validateStructuredResponse(result.data, schema);
```

## 📚 Примеры приложений

### E-commerce
```typescript
// Извлечение информации о продукте
const productSchema = createStructuredOutput('product_extraction',
  createObjectSchema({
    name: createStringProperty({ description: 'Название продукта' }),
    price: createNumberProperty({ description: 'Цена в рублях' }),
    category: createStringProperty({ description: 'Категория товара' }),
    features: createArrayProperty(
      createStringProperty({ description: 'Особенность продукта' })
    )
  })
);
```

### CRM системы
```typescript
// Анализ клиентских данных
const customerSchema = createStructuredOutput('customer_analysis',
  createObjectSchema({
    sentiment: createStringProperty({
      enum: ['positive', 'neutral', 'negative'],
      description: 'Общий тон общения'
    }),
    intent: createStringProperty({
      description: 'Цель обращения клиента'
    }),
    urgency: createStringProperty({
      enum: ['low', 'medium', 'high'],
      description: 'Срочность запроса'
    })
  })
);
```

### Аналитика кода
```typescript
// Анализ качества кода
const codeAnalysisSchema = createStructuredOutput('code_quality',
  createObjectSchema({
    language: createStringProperty({ description: 'Язык программирования' }),
    complexity: createNumberProperty({
      description: 'Уровень сложности',
      minimum: 1,
      maximum: 10
    }),
    issues: createArrayProperty(
      createObjectSchema({
        type: createStringProperty({ enum: ['error', 'warning', 'info'] }),
        message: createStringProperty({ description: 'Описание проблемы' }),
        line: createNumberProperty({ description: 'Номер строки' })
      })
    ),
    score: createNumberProperty({
      description: 'Общая оценка качества',
      minimum: 0,
      maximum: 100
    })
  })
);
```

Эта система структурированных выводов предоставляет мощные возможности для создания надежных, type-safe AI-приложений с консистентными данными! 🚀
