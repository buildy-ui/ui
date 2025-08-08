import { Block, Box, Card, Button, Icon, Stack, Text } from "@ui8kit/core"
import { Settings, LayoutDashboard } from "lucide-react";
import { skyOSTheme } from "@ui8kit/theme";

const currentTheme = skyOSTheme;

const theme = {
  theme: currentTheme,
  rounded: currentTheme.rounded,
  buttonSize: currentTheme.buttonSize,
  textSize: "xs" as const
}

function ButtonItems(icon: React.ElementType, label: string, href: string) {
  return (
    <a href={href}>
      <Button
        variant="ghost"
        w="full"
        size={theme?.buttonSize.default}
        rounded={theme?.rounded.default}
        className="justify-start"
        data-class="sidebar-item"
      >
        <Icon
          component="span"
          lucideIcon={icon}
        />
        <Text size={theme?.textSize} c="muted">{label}</Text>
      </Button>
    </a>
  )
}

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
          {ButtonItems(LayoutDashboard, "Dashboard", "/dashboard")}
          {ButtonItems(Settings, "Settings", "/settings")}
          <Card p="md" rounded={theme?.rounded.default} shadow="sm" bg="card" className="w-full hover:shadow-md transition-shadow" data-class="widgets-card">
            <Stack gap="md" align="start">
              <Text size={theme?.textSize} c="muted">Widgets</Text>
            </Stack>
          </Card>
        </Stack>
      </Box>
    </Block>
  )
}