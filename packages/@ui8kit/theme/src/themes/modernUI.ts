// ModernUI Theme
export const modernUITheme = {
  name: "ModernUI",
  rounded: {
    // none | default | sm | md | lg | xl | "2xl" | "3xl" | full
    default: "default" as const,
    button: "default" as const,
    badge: "default" as const
  },
  buttonSize: {
    // xs | sm | default | md | lg | xl | icon
    default: "default" as const,
    badge: "md" as const
  }
} as const;

export type ModernUITheme = typeof modernUITheme; 