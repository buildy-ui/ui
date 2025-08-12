import { Block, Box, Card, Stack, Text } from "@ui8kit/core"
import { NavMenu } from "./NavMenu";
import { useAppTheme } from '@/hooks/use-theme';

const textSize = "xs" as const;

// No direct buttons here; use shared NavMenu to keep parity with mobile Sheet

interface SidebarProps {
  className?: string;
  dataClass?: string;
}

export function Sidebar( { className, dataClass }: SidebarProps ) {
  const { rounded } = useAppTheme();
  return (
    <Block component="aside" className={className} data-class={dataClass}>
      <Box overflow="auto" h="screen">
        <Stack p="md" align="start">
          <Text c="muted">Sidebar</Text>
        </Stack>
        <Stack gap="sm" p="md">
          <NavMenu />
          <Card p="md" rounded={rounded?.default} shadow="sm" bg="card" w="full">
            <Stack gap="md" align="start">
              <Text size={textSize} c="muted">Widgets</Text>
            </Stack>
          </Card>
        </Stack>
      </Box>
    </Block>
  )
}