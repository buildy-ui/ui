// Export variants and utilities from core
export * from './core/variants';
export * from './core/utils';

// Export core primitives with Base prefix to avoid conflicts
export {
  Block as BaseBlock,
  Container as BaseContainer,
  Grid as BaseGrid,
  Flex as BaseFlex,
  Box as BaseBox,
  Stack as BaseStack,
  Component as BaseComponent,
  Element as BaseElement,
  Card as BaseCard,
  Button as BaseButton,
  Badge as BaseBadge,
  Image as BaseImage,
  Icon as BaseIcon
} from './core/ui';

// Composite components with prop forwarding API (main exports)
export * from './components';

// Factory components (blocks)
export * from './factory';
