import { forwardRef } from "react";
import { Grid } from "@ui8kit/core";
import type { BlogGridProps } from "../types";

export const BlogGrid = forwardRef<HTMLDivElement, BlogGridProps>(
  ({ children, cols = "1-2-3", gap = "lg", ...props }, ref) => {
    return (
      <Grid
        ref={ref}
        cols={cols}
        gap={gap}
        {...props}
      >
        {children}
      </Grid>
    );
  }
);

BlogGrid.displayName = "BlogGrid";