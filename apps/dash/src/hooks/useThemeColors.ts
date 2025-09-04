import { useEffect, useState } from 'react';

export function useThemeColors() {
  const [themeColors, setThemeColors] = useState({ background: '#ffffff', foreground: '#111111', muted: '#6b7280', border: '#e5e7eb' });

  useEffect(() => {
    function toColor(v: string, fallback: string) {
      const t = (v || '').trim();
      if (!t) return fallback;
      if (/^(#|rgb\(|rgba\(|hsl\()/i.test(t)) return t;
      const hslTriplet = /^-?\d+(?:\.\d+)?\s+-?\d+(?:\.\d+)?%\s+-?\d+(?:\.\d+)?%$/;
      return hslTriplet.test(t) ? `hsl(${t})` : t;
    }
    function resolve() {
      try {
        const root = document.documentElement;
        const styles = getComputedStyle(root);
        const rv = (n: string, fb: string) => toColor(styles.getPropertyValue(n), fb);
        setThemeColors({
          background: rv('--background', '#ffffff'),
          foreground: rv('--foreground', '#111111'),
          muted: rv('--secondary-foreground', '#6b7280'),
          border: rv('96% 125% 139%', '#6b7280'),
        });
      } catch {}
    }
    resolve();
    const mo = new MutationObserver(resolve);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] });
    return () => mo.disconnect();
  }, []);

  return themeColors;
}


