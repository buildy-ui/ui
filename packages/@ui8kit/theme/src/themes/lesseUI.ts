// LesseUI Theme
export const lesseUITheme = {
  name: "LesseUI",
  rounded: {
    // none | default | sm | md | lg | xl | "2xl" | "3xl" | full
    default: "2xl" as const,
    button: "lg" as const,
    badge: "full" as const
  },
  buttonSize: {
    // xs | sm | default | md | lg | xl | icon
    default: "sm" as const,
    badge: "sm" as const
  },
  isNavFixed: true
} as const;

export type LesseUITheme = typeof lesseUITheme; 