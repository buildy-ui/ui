# 🛠️ Tools & Integrations

Мощная система инструментов для расширения возможностей AI чата с внешними сервисами и данными.

## 🎯 Возможности

- **🔧 Гибкая архитектура инструментов** - Создавайте кастомные инструменты с валидацией и безопасностью
- **📊 Управление жизненным циклом** - Регистрация, активация/деактивация, метрики выполнения
- **🛡️ Безопасность** - Контроль доступа, валидация параметров, ограничения ресурсов
- **📈 Мониторинг** - Метрики производительности, логирование, health checks
- **🔄 Интеграция с AI** - Прозрачная интеграция с Chat Completion API
- **⚡ Производительность** - Параллельное выполнение, таймауты, повторные попытки

## 🏗️ Архитектура

### Основные компоненты

```
tools/
├── tool-registry.ts      # Реестр инструментов
├── base-tool.ts          # Абстрактный базовый класс
├── tool-manager.ts       # Менеджер жизненного цикла
├── examples/             # Примеры реализаций
│   ├── web-search-tool.ts
│   ├── database-query-tool.ts
│   ├── file-system-tool.ts
│   └── tool-integration-example.ts
└── README.md
```

### Ключевые концепции

#### 1. **Tool Registry** - Централизованное управление
```typescript
import { toolRegistry, WebSearchTool } from '@ui8kit/chat';

// Регистрация инструмента
const webSearch = new WebSearchTool();
toolRegistry.register(webSearch);

// Управление инструментами
toolRegistry.setToolEnabled('web-search', true);
const enabledTools = toolRegistry.getEnabledTools();
```

#### 2. **Tool Manager** - Исполнение и мониторинг
```typescript
import { toolManager } from '@ui8kit/chat';

// Выполнение инструмента
const result = await toolManager.executeToolCall(toolCall, context, {
  timeout: 30000,
  retries: 2,
  validateParams: true
});

// Метрики производительности
const metrics = toolManager.getToolMetrics('web-search');
```

#### 3. **Abstract Tool** - Базовый класс для создания инструментов
```typescript
import { AbstractTool, createToolMetadata } from '@ui8kit/chat';

class CustomTool extends AbstractTool {
  constructor() {
    super(createToolMetadata(
      'custom-tool',
      'Custom Tool',
      'Description of what this tool does',
      {
        tags: ['custom', 'utility'],
        permissions: ['read'],
        version: '1.0.0'
      }
    ));
  }

  protected buildSchema() {
    return {
      type: 'function',
      function: {
        name: 'custom_function',
        description: 'Custom tool functionality',
        parameters: {
          type: 'object',
          properties: {
            param1: { type: 'string' }
          },
          required: ['param1']
        }
      }
    };
  }

  async execute(params, context) {
    // Tool implementation
    return { success: true, data: result };
  }
}
```

## 📚 Встроенные инструменты

### 🔍 **Web Search Tool**
```typescript
const webSearch = new WebSearchTool();

// Использование в AI чате
const tools = toolManager.getToolsForAI();
const response = await client.chatCompletion({
  model: 'openai/gpt-4',
  messages: [{ role: 'user', content: 'Search for AI news' }],
  parameters: { tools }
});
```

**Возможности:**
- Поиск в интернете с безопасными фильтрами
- Настраиваемый лимит результатов
- Поддержка разных языков
- Мок-реализация для тестирования

### 💾 **Database Query Tool**
```typescript
const dbTool = new DatabaseQueryTool('postgresql://...');

// SQL запросы с безопасностью
const result = await toolManager.executeToolCall({
  id: 'call_123',
  type: 'function',
  function: {
    name: 'execute_query',
    arguments: JSON.stringify({
      query: 'SELECT * FROM users WHERE active = true',
      readOnly: true,
      limit: 100
    })
  }
}, context);
```

**Особенности:**
- Защита от SQL-инъекций
- Read-only и write режимы
- Валидация запросов
- Поддержка разных СУБД

### 📁 **File System Tool**
```typescript
const fsTool = new FileSystemTool({
  allowedPaths: ['./data', './temp'],
  maxFileSize: 1024 * 1024
});

// Операции с файлами
const result = await fsTool.execute({
  operation: 'read',
  path: './data/config.json',
  encoding: 'utf8'
}, context);
```

**Функции:**
- Чтение/запись файлов
- Список директорий
- Проверка существования
- Статистика файлов
- Строгий контроль доступа

## 🚀 Полная интеграция

### Tool-Integrated Chat
```typescript
import { ToolIntegratedChat } from '@ui8kit/chat';

const chat = new ToolIntegratedChat({
  type: 'openrouter',
  apiKey: process.env.OPENROUTER_API_KEY!
});

// AI автоматически использует инструменты
const result = await chat.sendMessage(
  'Проанализируй данные в файле sales.csv и создай отчет'
);

// Результат включает:
// - AI ответ с анализом
// - Вызовы инструментов
// - Результаты выполнения
```

### Расширенные возможности

#### Параллельное выполнение
```typescript
// Выполнение нескольких инструментов параллельно
const results = await toolManager.executeToolCalls(
  toolCalls,
  context,
  { parallel: true, timeout: 30000 }
);
```

#### Условное выполнение
```typescript
// Инструменты с условиями
const conditionalTools = toolManager.getFilteredTools({
  userPermissions: ['read', 'write'],
  requiredTags: ['database'],
  excludedTags: ['dangerous']
});
```

#### Мониторинг и метрики
```typescript
// Получение статистики использования
const allMetrics = toolManager.getToolMetrics();
const toolMetrics = toolManager.getToolMetrics('web-search');

// Health checks
const health = await toolManager.getToolHealth('database-query');
```

## 🛡️ Безопасность

### Уровни защиты

#### 1. **Parameter Validation**
```typescript
// Автоматическая валидация параметров
const validation = tool.validate(parameters);
if (!validation.valid) {
  throw new Error(validation.errors?.join(', '));
}
```

#### 2. **Permission System**
```typescript
// Контроль доступа на основе ролей
const userTools = toolManager.getFilteredTools({
  userPermissions: ['read', 'database'],
  requiredTags: ['safe']
});
```

#### 3. **Resource Limits**
```typescript
// Ограничения на ресурсы
const fsTool = new FileSystemTool({
  maxFileSize: 1024 * 1024, // 1MB
  allowedPaths: ['./safe-zone']
});
```

#### 4. **Execution Timeouts**
```typescript
// Таймауты выполнения
await toolManager.executeToolCall(toolCall, context, {
  timeout: 30000,
  retries: 2
});
```

## 📊 Мониторинг

### Метрики производительности
```typescript
const metrics = toolManager.getToolMetrics('web-search');
// {
//   executions: 150,
//   successes: 145,
//   failures: 5,
//   avgExecutionTime: 1250,
//   lastExecutionTime: 1100
// }
```

### Health Monitoring
```typescript
// Проверка здоровья инструментов
for (const tool of toolManager.getAvailableTools()) {
  const health = await toolManager.getToolHealth(tool.id);
  console.log(`${tool.name}: ${health.healthy ? '✅' : '❌'}`);
}
```

## 🔧 Создание кастомных инструментов

### Шаблон инструмента
```typescript
import { AbstractTool, createToolMetadata } from '@ui8kit/chat';

export class MyCustomTool extends AbstractTool {
  constructor() {
    super(createToolMetadata(
      'my-tool',
      'My Custom Tool',
      'Does amazing things',
      {
        tags: ['custom', 'utility'],
        permissions: ['read'],
        version: '1.0.0'
      }
    ));
  }

  protected buildSchema() {
    return {
      type: 'function',
      function: {
        name: 'my_custom_function',
        description: 'What this function does',
        parameters: {
          type: 'object',
          properties: {
            input: { type: 'string', description: 'Input parameter' }
          },
          required: ['input']
        }
      }
    };
  }

  async execute(parameters, context) {
    try {
      // Your tool logic here
      const result = await this.doSomething(parameters.input);

      return {
        success: true,
        data: result,
        executionTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        executionTime: Date.now() - startTime
      };
    }
  }
}
```

### Регистрация и использование
```typescript
// Регистрация
const myTool = new MyCustomTool();
toolManager.registerTool(myTool);

// Использование в AI
const tools = toolManager.getToolsForAI();
const response = await client.chatCompletion({
  model: 'openai/gpt-4',
  messages: [{ role: 'user', content: 'Use my custom tool' }],
  parameters: { tools }
});
```

## 🎯 Лучшие практики

### 1. **Безопасность превыше всего**
- Всегда валидируйте входные параметры
- Используйте whitelist для путей и URL
- Ограничивайте ресурсы (размер файлов, время выполнения)
- Логируйте подозрительную активность

### 2. **Производительность**
- Используйте таймауты для всех операций
- Кешируйте результаты где возможно
- Оптимизируйте параллельное выполнение
- Мониторьте метрики производительности

### 3. **Надежность**
- Реализуйте механизм повторных попыток
- Добавляйте health checks
- Graceful handling ошибок
- Подробное логирование

### 4. **Пользовательский опыт**
- Предоставляйте понятные описания
- Валидируйте параметры с понятными сообщениями
- Возвращайте структурированные результаты
- Поддерживайте различные форматы вывода

## 📈 Продвинутые возможности

### Interleaved Thinking
```typescript
// AI может рассуждать между вызовами инструментов
const result = await chat.sendMessage(
  'Исследуй влияние ИИ на рынок труда в 2024 году'
);
// AI может:
// 1. Сначала поискать статистику
// 2. Проанализировать результаты
// 3. Сделать дополнительные запросы
// 4. Синтезировать финальный ответ
```

### Multi-Tool Workflows
```typescript
// Создание цепочек инструментов
const workflow = [
  'web-search',     // Поиск информации
  'database-query', // Сохранение результатов
  'file-system',    // Создание отчета
  'email-tool'      // Отправка результатов
];
```

### Conditional Tool Selection
```typescript
// Условный выбор инструментов на основе контекста
const contextTools = toolManager.getFilteredTools({
  userPermissions: user.permissions,
  requiredTags: ['safe', 'production'],
  excludedTags: ['experimental']
});
```

Эта система инструментов предоставляет мощную и гибкую платформу для расширения возможностей AI с внешними сервисами и данными! 🚀
