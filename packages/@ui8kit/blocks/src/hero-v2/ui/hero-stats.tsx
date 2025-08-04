import { forwardRef } from "react";
import { Group, Stack, Text } from "@ui8kit/core";
import type { HeroStatsProps } from "../types";

export const HeroStats = forwardRef<HTMLDivElement, HeroStatsProps>(
  ({ stats, className, ...props }, ref) => {
    return (
      <Group
        ref={ref}
        gap="xl"
        align="center"
        justify="center"
        className={`flex-wrap ${className || ""}`}
        {...props}
      >
        {stats.map((stat) => (
          <Stack key={stat.id} gap="xs" align="center">
            <Text size="3xl" fw="bold" c="primary" className="leading-none">
              {stat.value}
            </Text>
            <Text c="secondary-foreground" ta="center">
              {stat.label}
            </Text>
          </Stack>
        ))}
      </Group>
    );
  }
);

HeroStats.displayName = "HeroStats";