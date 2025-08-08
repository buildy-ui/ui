import { Block, Button, Icon, Text } from "@ui8kit/core";
import { Home } from "lucide-react";

export function Navbar() {
  return (
    <Block component="nav" className="flex items-center justify-between p-4 bg-card">
      <Text size="xl" fw="bold" c="primary">BuildY/UI</Text>
      <Button variant="ghost" size="sm">
        <Icon
          component="span"
          lucideIcon={Home}
        />
        <Text size="sm" c="muted">Home</Text>
      </Button>
    </Block>
  )
}