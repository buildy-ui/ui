import { forwardRef, useState } from "react";
import { Group, Button } from "@ui8kit/core";
import { skyOSTheme } from "@ui8kit/theme";
import type { BlogFiltersProps } from "../types";

const theme = skyOSTheme;

export const BlogFilters = forwardRef<HTMLDivElement, BlogFiltersProps>(
  ({ categories, activeCategory = "all", onCategoryChange, ...props }, ref) => {
    const [active, setActive] = useState(activeCategory);

    const handleCategoryClick = (categoryId: string) => {
      setActive(categoryId);
      onCategoryChange?.(categoryId);
    };

    return (
      <Group
        ref={ref}
        gap="sm"
        align="center"
        wrap="wrap"
        {...props}
      >
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={active === category.id ? "filled" : "outline"}
            size="sm"
            rounded={theme.rounded.default}
            onClick={() => handleCategoryClick(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </Group>
    );
  }
);

BlogFilters.displayName = "BlogFilters";