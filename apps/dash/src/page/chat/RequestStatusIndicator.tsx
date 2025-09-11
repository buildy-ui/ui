import { Box, Text, Group, Icon } from "@ui8kit/core";
import { RequestStatus } from './use-chat';
import {
  Wifi,
  Server,
  Cpu,
  Brain,
  CheckCircle,
  Loader2,
  Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface RequestStatusIndicatorProps {
  status: RequestStatus;
  className?: string;
  theme: {
    rounded : { default: any };
    buttonSize : { default: any };
  };
}

const statusConfig = {
  idle: {
    icon: CheckCircle,
    text: 'Ready to work',
    color: 'text-green-600',
    bgColor: 'bg-card',
    borderColor: 'border',
  },
  connecting_openrouter: {
    icon: Wifi,
    text: 'Connecting to OpenRouter...',
    color: 'text-blue-600',
    bgColor: 'bg-card',
    borderColor: 'border',
  },
  openrouter_response: {
    icon: Server,
    text: 'OpenRouter responded',
    color: 'text-purple-600',
    bgColor: 'bg-card',
    borderColor: 'border',
  },
  calling_openai: {
    icon: Cpu,
    text: 'Calling OpenAI API...',
    color: 'text-orange-600',
    bgColor: 'bg-card',
    borderColor: 'border',
  },
  openai_processing: {
    icon: Zap,
    text: 'OpenAI processing request...',
    color: 'text-orange-600',
    bgColor: 'bg-card',
    borderColor: 'border',
  },
  model_reasoning: {
    icon: Brain,
    text: 'Model is reasoning...',
    color: 'text-indigo-600',
    bgColor: 'bg-card',
    borderColor: 'border',
  },
  generating_response: {
    icon: Brain,
    text: 'Generating response...',
    color: 'text-indigo-600',
    bgColor: 'bg-card',
    borderColor: 'border',
  },
  streaming_tokens: {
    icon: Loader2,
    text: 'Streaming response...',
    color: 'text-cyan-600',
    bgColor: 'bg-card',
    borderColor: 'border',
  },
  completed: {
    icon: CheckCircle,
    text: 'Completed!',
    color: 'text-green-600',
    bgColor: 'bg-card',
    borderColor: 'border',
  },
};

export function RequestStatusIndicator({ status, theme, className }: RequestStatusIndicatorProps) {
  const [isVisible, setIsVisible] = useState(status !== 'idle');

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  // Show indicator only when active
  useEffect(() => {
    if (status === 'idle') {
      const timer = setTimeout(() => setIsVisible(false), 2000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [status]);

  if (!isVisible) return null;

  const isAnimated = status === 'connecting_openrouter' || status === 'calling_openai' || status === 'openai_processing' ||
                    status === 'model_reasoning' || status === 'generating_response' || status === 'streaming_tokens';

  return (
    <Box
      p="sm"
      rounded={theme.rounded.default}
      className={`border transition-all duration-300 ${config.bgColor} ${config.borderColor} ${className}`}
    >
      <Group gap="sm" align="center">
        <Icon
          lucideIcon={StatusIcon}
          size={theme.buttonSize.default}
          className={`${config.color} ${isAnimated ? 'animate-spin' : ''}`}
        />
        <Text size={theme.buttonSize.default} className={config.color} fw="medium">
          {config.text}
        </Text>

        {/* Completion checkmark animation */}
        {status === 'completed' && (
          <Box
            w="14px"
            h="14px"
            rounded="full"
            bg="green-500"
            display="flex"
            align="center"
            justify="center"
            className="animate-pulse"
          >
            <Icon lucideIcon={CheckCircle} size="xs" className="text-white" />
          </Box>
        )}
      </Group>
    </Box>
  );
}
