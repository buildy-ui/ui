import { forwardRef } from "react";
import { Group, Text } from "@ui8kit/core";
import type { BlogMetaProps } from "../types";

export const BlogMeta = forwardRef<HTMLDivElement, BlogMetaProps>(
  ({ date, readTime, ...props }, ref) => {
    return (
      <Group ref={ref} gap="xs" align="center" {...props}>
        <Text size="xs" c="secondary-foreground">
          {date}
        </Text>
        <Text size="xs" c="secondary-foreground">
          •
        </Text>
        <Text size="xs" c="secondary-foreground">
          {readTime}
        </Text>
      </Group>
    );
  }
);

BlogMeta.displayName = "BlogMeta";