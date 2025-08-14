import { useState, useEffect, useRef } from 'react';
import { Block, Box, Button, Group, Stack, Text, Title, Icon } from "@ui8kit/core";
import { Textarea, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@ui8kit/form';
import { Image as ImageIcon, ChevronDown } from 'lucide-react';
import { useAppTheme } from '@/hooks/use-theme';
import { useChat } from '@/page/chat/context';
import { alternativePrompts, imageConfig } from './prompt'; // imagePrompt

const imagePrompt = alternativePrompts.laptop_work;

declare global {
  interface ImportMeta {
    env: {
      VITE_POLLINATIONS_TOKEN: string;
    };
  }
}

export function ImagePage() {
  const { rounded, buttonSize } = useAppTheme();
  const { sendImage } = useChat();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>(imagePrompt);
  const [model, setModel] = useState<string>('pollinations');
  const [modelOpen, setModelOpen] = useState<boolean>(false);
  const modelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // noop: reserved for possible auto-preview
    const generateImage = async () => {
      try {
        setError(null);
        const encodedPrompt = encodeURIComponent(imagePrompt);
        
        // Get token from environment variable
        const token = import.meta.env.VITE_POLLINATIONS_TOKEN || 'YOUR_TOKEN_HERE';

        // Use local proxy to avoid CORS issues
        let url = `/api/pollinations/prompt/${encodedPrompt}?width=${imageConfig.width}&height=${imageConfig.height}&seed=${imageConfig.seed}&model=${imageConfig.model}&nologo=${imageConfig.nologo}`;
        
        // Add token to URL if available
        if (token && token !== 'YOUR_TOKEN_HERE') {
          url += `&token=${token}`;
        }

        if (imageConfig.private) {
          url += `&private=true`;
        }
        if (imageConfig.enhance) {
          url += `&enhance=true`;
        }
        if (imageConfig.safe && imageConfig.safe === true) {
          url += `&safe=true`;
        }
        //if (imageConfig.referrer) {
        //  url += `&referrer=${imageConfig.referrer}`;
        //}

        //console.log('Generating image via proxy:', url.replace(token || '', 'HIDDEN_TOKEN'));

        const headers: HeadersInit = {
          'Accept': 'image/*'
        };

        // Add Authorization header if token is available
        if (token && token !== 'YOUR_TOKEN_HERE') {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url, {
          method: 'GET',
          headers
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }

        // Create blob URL for the image
        const blob = await response.blob();
        const imageObjectUrl = URL.createObjectURL(blob);
        setImageUrl(imageObjectUrl);
        setIsLoading(false);
      } catch (error) {
        console.error('Error generating image:', error);
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
        setIsLoading(false);
      }
    };

    // optional initial preview
  }, []);

  // Cleanup blob URL when component unmounts
  useEffect(() => {
    return () => {
      if (imageUrl && imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  // const tokenConfigured = import.meta.env.VITE_POLLINATIONS_TOKEN;

  return (
    <Box w="full">
      <Stack gap="lg">
        <Title size="xl" c="secondary-foreground" mt="lg">Image generation</Title>

        <Block p="md" rounded={rounded?.default} bg="card" border="1px">
          <Stack gap="md">
            {error && (
              <Text c="destructive">{error}</Text>
            )}
            <Box w="full" h="auto">
              <Stack gap="md">
                {!imageUrl && (
                  <Text c="muted">Describe an image and press Generate.</Text>
                )}
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Generated image"
                    className="max-w-full h-auto rounded-xl shadow"
                    onError={() => setError('Failed to load generated image')}
                  />
                )}
              </Stack>
            </Box>

            <Stack gap="sm">
              <Textarea
                placeholder="Describe your image..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
              />
              <Group justify="between" align="center" gap="sm">
                <Box w="auto" className="relative min-w-36" ref={modelRef as any}>
                  <Select className="hidden" value={model} onChange={() => {}} />
                  <SelectTrigger onClick={() => setModelOpen((v) => !v)}>
                    <SelectValue value={model} placeholder="Select" />
                    <Icon size="sm" c="secondary-foreground" component="span" lucideIcon={ChevronDown} className="ml-2" />
                  </SelectTrigger>
                  {modelOpen && (
                    <SelectContent className="absolute left-0 top-full bg-card">
                      <SelectItem value="pollinations" onClick={(v) => { setModel(v); setModelOpen(false); }}>Pollinations</SelectItem>
                      <SelectItem value="sdxl" onClick={(v) => { setModel(v); setModelOpen(false); }}>Stable Diffusion XL</SelectItem>
                    </SelectContent>
                  )}
                </Box>
                <Button variant="secondary" size={buttonSize.default} rounded={rounded.button} onClick={async () => {
                  try {
                    setIsLoading(true);
                    setError(null);
                    // Trigger remote generation and set imageUrl; reusing existing logic
                    const encodedPrompt = encodeURIComponent(prompt);
                    const token = import.meta.env.VITE_POLLINATIONS_TOKEN || 'YOUR_TOKEN_HERE';
                    let url = `/api/pollinations/prompt/${encodedPrompt}?width=${imageConfig.width}&height=${imageConfig.height}&seed=${imageConfig.seed}&model=${imageConfig.model}&nologo=${imageConfig.nologo}`;
                    if (token && token !== 'YOUR_TOKEN_HERE') url += `&token=${token}`;
                    if (imageConfig.private) url += `&private=true`;
                    if (imageConfig.enhance) url += `&enhance=true`;
                    if (imageConfig.safe && imageConfig.safe === true) url += `&safe=true`;
                    const headers: HeadersInit = { 'Accept': 'image/*' };
                    if (token && token !== 'YOUR_TOKEN_HERE') headers['Authorization'] = `Bearer ${token}`;
                    const response = await fetch(url, { method: 'GET', headers });
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    const blob = await response.blob();
                    const imageObjectUrl = URL.createObjectURL(blob);
                    setImageUrl(imageObjectUrl);
                    sendImage(prompt, imageObjectUrl);
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'Unknown error occurred');
                  } finally {
                    setIsLoading(false);
                  }
                }}>
                  <Icon component="span" lucideIcon={ImageIcon} />
                  <Text size="sm" c="secondary-foreground">Generate</Text>
                </Button>
              </Group>
            </Stack>
          </Stack>
        </Block>
      </Stack>
    </Box>
  );
}
