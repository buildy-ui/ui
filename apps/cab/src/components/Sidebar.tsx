import { Block, Box, Card, Button, Icon, Stack, Text } from "@ui8kit/core"
import { skyOSTheme } from "@ui8kit/theme";
import { Settings, LayoutDashboard } from "lucide-react";

const currentTheme = skyOSTheme;

const theme = {
  theme: currentTheme,
  themeRounded: currentTheme.rounded,
  themeButtonSize: currentTheme.buttonSize
}

function ButtonItems(icon: React.ElementType, label: string, href: string) {
  return (
    <a href={href}>
      <Button
        variant="ghost"
        w="full"
        size={theme?.themeButtonSize.default}
        rounded={theme?.themeRounded.default}
        className="justify-start"
        data-class="sidebar-item"
      >
        <Icon
          component="span"
          lucideIcon={icon}
        />
        <Text size="sm" c="muted">{label}</Text>
      </Button>
    </a>
  )
}

export function Sidebar() {
  return (
    <Block>
      <Box>
        <Stack p="md" align="start">
          <Text size="lg" c="muted">Sidebar</Text>
        </Stack>
        <Stack gap="sm" p="md">
          {ButtonItems(LayoutDashboard, "Dashboard", "/dashboard")}
          {ButtonItems(Settings, "Settings", "/settings")}
          <Card p="md" rounded={theme?.themeRounded.default} shadow="sm" bg="card" className="w-full hover:shadow-md transition-shadow" data-class="widgets-card">
            <Stack gap="md" align="start">
              <Text size="sm" c="muted">Widgets</Text>
            </Stack>
          </Card>
        </Stack>
      </Box>
    </Block>
  )
}