import type { Meta, StoryObj } from '@storybook/react';
import { ChatComposition } from './chat-composition';
import type { Message } from '../core/interfaces';

const meta: Meta<typeof ChatComposition> = {
  title: 'Compositions/ChatComposition',
  component: ChatComposition,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Complete chat interface composition with AI integration.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'bubble', 'full'],
    },
    showModelSelector: {
      control: 'boolean',
    },
    streaming: {
      control: 'boolean',
    },
    autoScroll: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ChatComposition>;

const mockProviderConfig = {
  type: 'openrouter' as const,
  apiKey: 'mock-api-key',
};

const sampleMessages: Message[] = [
  {
    id: '1',
    role: 'user',
    content: 'Hello! Can you help me understand React hooks?',
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: '2',
    role: 'assistant',
    content: 'Of course! React hooks are functions that let you use state and other React features in functional components. The most common ones are useState for state management and useEffect for side effects.',
    timestamp: new Date(Date.now() - 240000),
  },
  {
    id: '3',
    role: 'user',
    content: 'Can you show me an example of useState?',
    timestamp: new Date(Date.now() - 180000),
  },
  {
    id: '4',
    role: 'assistant',
    content: 'Here\'s a simple example:\n\n```tsx\nimport { useState } from \'react\';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>\n        Increment\n      </button>\n    </div>\n  );\n}\n```',
    timestamp: new Date(Date.now() - 120000),
  },
];

export const Default: Story = {
  args: {
    providerConfig: mockProviderConfig,
    initialMessages: sampleMessages,
    systemPrompt: 'You are a helpful coding assistant with expertise in React and TypeScript.',
    placeholder: 'Ask me anything about coding...',
    showModelSelector: true,
    availableModels: ['gpt-5-mini', 'gpt-5-high'],
    defaultModel: 'gpt-5-mini',
    variant: 'default',
    streaming: true,
    autoScroll: true,
  },
};

export const BubbleVariant: Story = {
  args: {
    ...Default.args,
    variant: 'bubble',
    showModelSelector: false,
  },
};

export const FullVariant: Story = {
  args: {
    ...Default.args,
    variant: 'full',
    showModelSelector: false,
  },
};

export const WithoutModelSelector: Story = {
  args: {
    ...Default.args,
    showModelSelector: false,
  },
};

export const EmptyChat: Story = {
  args: {
    providerConfig: mockProviderConfig,
    initialMessages: [],
    placeholder: 'Start a conversation...',
    showModelSelector: true,
    variant: 'bubble',
  },
};

export const WithCustomSystemPrompt: Story = {
  args: {
    ...Default.args,
    systemPrompt: 'You are a creative writing assistant. Help users develop their stories and characters.',
    placeholder: 'Tell me about your story idea...',
    showModelSelector: false,
  },
};
