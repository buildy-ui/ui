# Lucide Component

Компонент для работы с иконками [Lucide React](https://lucide.dev/).

## Использование

### Базовое использование

```tsx
import { Lucide } from '@twblocks/blocks';

// Использование по названию иконки
<Lucide component="ArrowRight" size={20} />

// Прямой импорт иконки
import { Star } from 'lucide-react';
<Lucide component={Star} size={24} className="text-yellow-500" />
```

### В блоках

```tsx
import { Button } from '@ui8kit/core';
import { Lucide } from '../utils/Lucide';

<Button>
  Узнать больше
  <Lucide component="ArrowRight" size={16} className="ml-2" />
</Button>
```

### Доступные иконки

Компонент поддерживает следующие иконки по названию:
- `Info`, `Rocket`, `ArrowRight`, `Play`, `Star`, `Heart`
- `Check`, `X`, `ChevronDown`, `ChevronUp`, `ChevronLeft`, `ChevronRight`
- `Menu`, `Search`, `User`, `Mail`, `Phone`, `MapPin`
- `Calendar`, `Clock`, `Download`, `Upload`, `Edit`, `Trash`
- `Plus`, `Minus`, `Home`, `Settings`

### Свойства

- `component`: Название иконки (строка) или компонент Lucide
- `size`: Размер иконки (по умолчанию 16)
- `className`: CSS классы
- `strokeWidth`: Толщина линий (по умолчанию 2) 