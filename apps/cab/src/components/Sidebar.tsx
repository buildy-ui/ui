import { Block, Box, Card, Stack, Text } from "@ui8kit/core"
import { skyOSTheme } from "@ui8kit/theme";
import { NavMenu } from "./NavMenu";

const currentTheme = skyOSTheme;

const theme = {
  theme: currentTheme,
  rounded: currentTheme.rounded,
  buttonSize: currentTheme.buttonSize,
  textSize: "xs" as const
}

// No direct buttons here; use shared NavMenu to keep parity with mobile Sheet

interface SidebarProps {
  className?: string;
  dataClass?: string;
}

export function Sidebar( { className, dataClass }: SidebarProps ) {
  return (
    <Block component="aside" className={className} data-class={dataClass}>
      <Box>
        <Stack p="md" align="start">
          <Text c="muted">Sidebar</Text>
        </Stack>
        <Stack gap="sm" p="md">
          <NavMenu />
          <Card p="md" rounded={theme?.rounded.default} shadow="sm" bg="card" w="full">
            <Stack gap="md" align="start">
              <Text size={theme?.textSize} c="muted">Widgets</Text>
            </Stack>
          </Card>
        </Stack>
      </Box>
    </Block>
  )
}