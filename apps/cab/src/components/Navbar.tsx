import { Block, Box, Button, Icon, Text } from "@ui8kit/core";
import { Home, Moon, Sun } from "lucide-react";

export function Navbar({ isDarkMode, toggleDarkMode }: { isDarkMode: boolean, toggleDarkMode: () => void }) {
  return (
    <Block component="nav" className="flex items-center justify-between p-4 bg-card" data-class="navbar">
      <Text size="xl" fw="bold" c="primary">BuildY/UI</Text>
      <Box className="flex items-center gap-2">
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
      </Box>
    </Block>
  )
}