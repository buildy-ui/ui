import { forwardRef } from "react";
import { Button, Icon } from "@ui8kit/core";
import { skyOSTheme } from "@ui8kit/theme";
import type { HeroButtonProps } from "../types";

const theme = skyOSTheme;

export const HeroButton = forwardRef<HTMLButtonElement, HeroButtonProps>(
  ({ children, variant = "default", icon, className, onClick, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        rounded={theme.rounded.default}
        size={theme.buttonSize.default}
        leftSection={icon ? (
          <Icon 
            lucideIcon={icon}
            c={variant === "default" ? "primary-foreground" : undefined}
          />
        ) : undefined}
        className={className}
        onClick={onClick}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

HeroButton.displayName = "HeroButton";