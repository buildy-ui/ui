// SkyOS Theme - простые настройки без CVA
export const skyOSTheme = {
  name: "SkyOS",
  rounded: {
    // "sm" | "md" | "lg" | "xl" | "full" | "default" | "none" | "2xl" | "3xl" | null | undefined
    default: "lg" as const,
    badge: "full" as const
  },
  buttonSize: {
    // xs | sm | default | md | lg | xl | icon
    default: "default" as const,
    badge: "sm" as const
  }
} as const;

export type SkyOSTheme = typeof skyOSTheme; 