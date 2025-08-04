import { forwardRef } from "react";
import { Group, Image, Text } from "@ui8kit/core";
import type { BlogAuthorProps } from "../types";

export const BlogAuthor = forwardRef<HTMLDivElement, BlogAuthorProps>(
  ({ name, avatar, ...props }, ref) => {
    return (
      <Group ref={ref} gap="sm" align="center" {...props}>
        {avatar && (
          <Image
            src={avatar}
            alt={`${name} avatar`}
            width="32px"
            height="32px"
            fit="cover"
            rounded="full"
          />
        )}
        <Text size="sm" fw="medium">
          {name}
        </Text>
      </Group>
    );
  }
);

BlogAuthor.displayName = "BlogAuthor";