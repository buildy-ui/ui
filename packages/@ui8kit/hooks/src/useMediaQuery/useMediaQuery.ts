
import { useState, useEffect } from "react";

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    // Set initial state
    setMatches(mediaQuery.matches);

    // Create event listener
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add listener (supports both legacy and modern browsers)
    if (mediaQuery.addListener) {
      mediaQuery.addListener(listener);
    } else {
      mediaQuery.addEventListener("change", listener);
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeListener) {
        mediaQuery.removeListener(listener);
      } else {
        mediaQuery.removeEventListener("change", listener);
      }
    };
  }, [query]);

  return matches;
} 