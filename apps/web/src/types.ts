export interface Block {
  id: string;
  type: string;
  content: Record<string, any>;
  order: number;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType<any>;
  defaultProps?: Record<string, any>;  // Props из template (variant, leftMedia, etc)
  defaults?: Record<string, any>;      // Default content data
  schema?: Record<string, any>;        // JSON schema для валидации
}