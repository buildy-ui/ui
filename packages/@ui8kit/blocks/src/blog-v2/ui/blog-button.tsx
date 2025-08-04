import { forwardRef } from "react";
import { Button } from "@ui8kit/core";
import { skyOSTheme } from "@ui8kit/theme";
import type { BlogButtonProps } from "../types";

const theme = skyOSTheme;

export const BlogButton = forwardRef<HTMLButtonElement, BlogButtonProps>(
  ({ children, variant = "default", rightSection, onClick, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        rounded={theme.rounded.default}
        size={theme.buttonSize.default}
        rightSection={rightSection}
        onClick={onClick}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

BlogButton.displayName = "BlogButton";