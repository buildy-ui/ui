# Hero v2 - shadcn-style Architecture

## 🎉 Новая архитектура готова!

### Структура:
```
/hero-v2/
  /ui/                   # Атомарные компоненты (20-35 строк каждый)
    hero-badge.tsx       
    hero-title.tsx       
    hero-description.tsx 
    hero-button.tsx      
    hero-actions.tsx     
    hero-stats.tsx       
    
  /components/           # Составные компоненты (30-60 строк каждый)
    hero-section.tsx     # Контейнер с layout
    hero-content.tsx     # Текстовая область
    hero-media.tsx       # Медиа область
    
  /presets/             # Готовые комбинации (80-120 строк)
    split-hero.tsx       # Вместо 530 строк!
    centered-hero.tsx    # Простой и понятный
    
  types.ts              # Все интерфейсы
  content.ts            # Default data  
  schema.ts             # JSON schemas
  index.ts              # Экспорты + templates
```

## 🚀 Примеры использования:

### 1. Композиция из атомарных компонентов:
```tsx
<HeroSection layout="split">
  <HeroContent>
    <HeroBadge>New Release</HeroBadge>
    <HeroTitle>Build the future with modern technology</HeroTitle>
    <HeroDescription>Transform your ideas into reality...</HeroDescription>
    <HeroActions>
      <HeroButton icon={Rocket}>Get Started Free</HeroButton>
      <HeroButton variant="outline" icon={Info}>View Demo</HeroButton>
    </HeroActions>
  </HeroContent>
  <HeroMedia src="..." alt="..." />
</HeroSection>
```

### 2. Готовые presets (как раньше):
```tsx
<SplitHero 
  variant="media" 
  content={{ 
    title: "My Custom Title",
    description: "My custom description" 
  }} 
/>
```

### 3. Центрированный hero со статистикой:
```tsx
<CenteredHero variant="withStats" />
```

## ✅ Преимущества vs старый подход:

| Старый подход | Новый подход |
|---------------|--------------|
| 530 строк в одном файле | 20-120 строк в файле |
| Сложно понять | Интуитивно понятно |
| Сложно кастомизировать | Легко заменить любую часть |
| Монолитная структура | Модульная архитектура |
| Когнитивная перегрузка | Простота как в shadcn |

## 🔄 Обратная совместимость:

Старый API продолжает работать через templates:
```tsx
// Работает как раньше
<SplitHero variant="media" content={{}} />
```

Но теперь можно использовать и композицию:
```tsx
// Новые возможности
<HeroSection layout="split">
  <MyCustomContent />
  <MyCustomMedia />  
</HeroSection>
```