import { cva, type VariantProps } from "class-variance-authority";

// Text size variants
export const textSizeVariants = cva("", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
      "5xl": "text-5xl"
    }
  },
  defaultVariants: {
    size: "md"
  }
});

// Font weight variants
export const fontWeightVariants = cva("", {
  variants: {
    fw: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold"
    }
  },
  defaultVariants: {
    fw: "normal"
  }
});

// Text alignment variants
export const textAlignVariants = cva("", {
  variants: {
    ta: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify"
    }
  },
  defaultVariants: {
    ta: "left"
  }
});

// Leading (line height) variants
export const leadingVariants = cva("", {
  variants: {
    leading: {
      tight: "leading-tight",
      normal: "leading-normal",
      relaxed: "leading-relaxed"
    }
  },
  defaultVariants: {
    leading: "normal"
  }
});

// Typography modifiers
export const typographyModifierVariants = cva("", {
  variants: {
    truncate: {
      true: "truncate",
      false: ""
    },
    italic: {
      true: "italic",
      false: ""
    },
    underline: {
      true: "underline",
      false: ""
    }
  },
  defaultVariants: {
    truncate: false,
    italic: false,
    underline: false
  }
});

// Letter spacing (tracking) variants
export const trackingVariants = cva("", {
  variants: {
    tracking: {
      tighter: "tracking-tighter",
      tight: "tracking-tight",
      normal: "tracking-normal",
      wide: "tracking-wide",
      wider: "tracking-wider",
      widest: "tracking-widest"
    }
  },
  defaultVariants: {
    tracking: undefined
  }
});

export interface TextSizeProps extends VariantProps<typeof textSizeVariants> {}
export interface FontWeightProps extends VariantProps<typeof fontWeightVariants> {}
export interface TextAlignProps extends VariantProps<typeof textAlignVariants> {}
export interface LeadingProps extends VariantProps<typeof leadingVariants> {}
export interface TypographyModifierProps extends VariantProps<typeof typographyModifierVariants> {} 
export interface TrackingProps extends VariantProps<typeof trackingVariants> {}

// Text transform
export const textTransformVariants = cva("", {
  variants: {
    transform: {
      uppercase: "uppercase",
      lowercase: "lowercase",
      capitalize: "capitalize",
      normal: "normal-case"
    }
  }
});

// Whitespace handling
export const whitespaceVariants = cva("", {
  variants: {
    whitespace: {
      normal: "whitespace-normal",
      nowrap: "whitespace-nowrap",
      pre: "whitespace-pre",
      preLine: "whitespace-pre-line",
      preWrap: "whitespace-pre-wrap",
      breakSpaces: "whitespace-break-spaces"
    }
  }
});

// Word/line breaking
export const breakVariants = cva("", {
  variants: {
    break: {
      normal: "break-normal",
      words: "break-words",
      all: "break-all"
    }
  }
});

// Hyphens
export const hyphenVariants = cva("", {
  variants: {
    hyphens: {
      none: "hyphens-none",
      manual: "hyphens-manual",
      auto: "hyphens-auto"
    }
  }
});

export interface TextTransformProps extends VariantProps<typeof textTransformVariants> {}
export interface WhitespaceProps extends VariantProps<typeof whitespaceVariants> {}
export interface BreakProps extends VariantProps<typeof breakVariants> {}
export interface HyphenProps extends VariantProps<typeof hyphenVariants> {}