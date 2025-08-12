// SkyOS Theme
export const skyOSTheme = {
  name: "SkyOS",
  rounded: {
    // "sm" | "md" | "lg" | "xl" | "full" | "default" | "none" | "2xl" | "3xl" | null | undefined
    default: "lg" as const,
    button: "lg" as const,
    badge: "full" as const
  },
  buttonSize: {
    // xs | sm | default | md | lg | xl | icon
    default: "default" as const,
    badge: "sm" as const
  },
  isNavFixed: false
} as const;

export type SkyOSTheme = typeof skyOSTheme; 