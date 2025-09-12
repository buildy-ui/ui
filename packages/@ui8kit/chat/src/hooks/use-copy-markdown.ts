import { useCallback, useState } from 'react';

interface UseCopyMarkdownOptions {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export function useCopyMarkdown(options: UseCopyMarkdownOptions = {}) {
  const { onSuccess, onError } = options;
  const [isCopying, setIsCopying] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyMarkdown = useCallback(async (markdown: string) => {
    if (!markdown || typeof markdown !== 'string') return;
    setIsCopying(true);
    setCopied(false);
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(markdown);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = markdown;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      onSuccess?.();
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      onError?.(error);
    } finally {
      setIsCopying(false);
    }
  }, [onSuccess, onError]);

  return { copyMarkdown, isCopying, copied };
}


