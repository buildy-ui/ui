import { Box, Text, Group, Icon } from "@ui8kit/core";
import { RequestStatus } from './use-chat';
import {
  CircleGauge,
  Radius,
  CircleDotDashed,
  CheckCircle,
  Loader2,
  CircleDashed
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface RequestStatusIndicatorProps {
  status: RequestStatus;
  className?: string;
  theme: {
    rounded: { default: any };
    buttonSize: { default: any };
  };
}

const statusConfig = {
  idle: {
    icon: CheckCircle,
    text: 'Ready to work!',
    color: 'text-secondary-foreground',
    bgColor: 'bg-primary/15',
    borderColor: 'border border-primary',
  },
  connecting_openrouter: {
    icon: CircleGauge,
    text: 'Connecting to API...',
    color: 'text-primary',
    bgColor: 'bg-primary/15',
    borderColor: 'border border-primary',
  },
  openrouter_response: {
    icon: Radius,
    text: 'OpenRouter responded',
    color: 'text-muted-foreground',
    bgColor: 'bg-card',
    borderColor: 'border',
  },
  calling_openai: {
    icon: Radius,
    text: 'Calling OpenAI API...',
    color: 'text-muted-foreground',
    bgColor: 'bg-card',
    borderColor: 'border',
  },
  openai_processing: {
    icon: CircleDashed,
    text: 'OpenAI processing request...',
    color: 'text-muted-foreground',
    bgColor: 'bg-card',
    borderColor: 'border',
  },
  model_reasoning: {
    icon: CircleDotDashed,
    text: 'Model is reasoning...',
    color: 'text-muted-foreground',
    bgColor: 'bg-card',
    borderColor: 'border',
  },
  generating_response: {
    icon: CircleDotDashed,
    text: 'Generating response...',
    color: 'text-muted-foreground',
    bgColor: 'bg-card',
    borderColor: 'border',
  },
  streaming_tokens: {
    icon: Loader2,
    text: 'Streaming response...',
    color: 'text-muted-foreground',
    bgColor: 'bg-card',
    borderColor: 'border',
  },
  completed: {
    icon: CheckCircle,
    text: 'Completed!',
    color: 'text-emerald-600',
    bgColor: 'bg-card',
    borderColor: 'border',
  },
};

export function RequestStatusIndicator({ status, className }: RequestStatusIndicatorProps) {
  const [isVisible, setIsVisible] = useState(status !== 'idle');

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  // Show indicator only when active
  useEffect(() => {
    if (status === 'idle') {
      const timer = setTimeout(() => setIsVisible(false), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [status]);

  if (!isVisible) return null;

  const isAnimated = status === 'connecting_openrouter' || status === 'calling_openai' || status === 'openai_processing' || status === 'model_reasoning' || status === 'generating_response' || status === 'streaming_tokens';

  return (
    <Box className={`transition-all duration-300 ${className}`}>
      <Group gap="xs" align="center">
        <Icon
          lucideIcon={StatusIcon}
          size="xs"
          className={`${config.color} ${isAnimated ? 'animate-spin' : ''}`}
        />
        <Text size="xs" className={config.color} fw="medium">
          {config.text}
        </Text>
      </Group>
    </Box>
  );
}
