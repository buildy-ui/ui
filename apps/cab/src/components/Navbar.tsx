import { Block, Button, Icon, Text, Group } from "@ui8kit/core";
import { Home, Moon, Sun } from "lucide-react";

export function Navbar({ isDarkMode, toggleDarkMode }: { isDarkMode: boolean, toggleDarkMode: () => void }) {
  return (
    <Block component="nav" bg="card" p="md">
      <Group justify="between" align="center">
      <Text size="xl" fw="bold" c="primary">BuildY/UI</Text>
      <Group gap="sm" align="center">
      <Button variant="ghost" size="sm">
        <Icon
          component="span"
          lucideIcon={Home}
        />
        <Text size="sm" c="muted">Home</Text>
      </Button>
      <Button variant="ghost" size="sm" onClick={toggleDarkMode}>
        <Icon
          component="span"
          lucideIcon={isDarkMode ? Moon : Sun}
          />
        </Button>
        </Group>
      </Group>
    </Block>
  )
}