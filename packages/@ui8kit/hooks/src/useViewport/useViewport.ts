import { useState, useEffect } from "react";

interface ViewportSize {
  width: number;
  height: number;
}

interface BreakpointConfig {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  "2xl": number;
}

const defaultBreakpoints: BreakpointConfig = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

export function useViewport(breakpoints: BreakpointConfig = defaultBreakpoints) {
  const [viewport, setViewport] = useState<ViewportSize>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set initial viewport
    updateViewport();

    // Add event listener
    window.addEventListener("resize", updateViewport);
    window.addEventListener("orientationchange", updateViewport);

    // Cleanup
    return () => {
      window.removeEventListener("resize", updateViewport);
      window.removeEventListener("orientationchange", updateViewport);
    };
  }, []);

  const getCurrentBreakpoint = () => {
    const { width } = viewport;
    if (width >= breakpoints["2xl"]) return "2xl";
    if (width >= breakpoints.xl) return "xl";
    if (width >= breakpoints.lg) return "lg";
    if (width >= breakpoints.md) return "md";
    if (width >= breakpoints.sm) return "sm";
    if (width >= breakpoints.xs) return "xs";
    return "xs";
  };

  const isBreakpoint = (breakpoint: keyof BreakpointConfig) => {
    return viewport.width >= breakpoints[breakpoint];
  };

  const isMobile = !isBreakpoint("md");
  const isTablet = isBreakpoint("md") && !isBreakpoint("lg");
  const isDesktop = isBreakpoint("lg");

  return {
    width: viewport.width,
    height: viewport.height,
    breakpoint: getCurrentBreakpoint(),
    isBreakpoint,
    isMobile,
    isTablet,
    isDesktop,
  };
} 