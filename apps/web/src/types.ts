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
  defaultProps?: Record<string, any>;
  defaults?: Record<string, any>;
  schema?: Record<string, any>;
}