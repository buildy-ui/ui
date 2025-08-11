import { Block, Button, Icon, Text, Group, Sheet } from "@ui8kit/core";
import { Atom, Home, Moon, Sun, Menu } from "lucide-react";
import { useMobile } from "@ui8kit/hooks";
import { NavMenu } from "./NavMenu";

export function Navbar({ isDarkMode, toggleDarkMode }: { isDarkMode: boolean, toggleDarkMode: () => void }) {
  const isMobile = useMobile();
  return (
    <Block component="nav" bg="card" p="md" data-class="navbar" className="h-16 border-b border-border">
      <Group justify="between" align="center">
        <Group gap="sm" align="center">
            <Icon size="lg" c="primary" component="span" lucideIcon={Atom} />
          <Text size="lg" fw="bold" c="secondary-foreground">
            BuildY/UI
          </Text>
        </Group>

        {!isMobile && (
          <Group gap="xs" align="center">
            <Button variant="ghost" size="sm">
              <Icon component="span" lucideIcon={Home} />
              <Text size="sm" c="muted">Home</Text>
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleDarkMode}>
              <Icon component="span" lucideIcon={isDarkMode ? Moon : Sun} />
            </Button>
          </Group>
        )}

        {isMobile && (
          <Group gap="xs" align="center">
            <Button variant="ghost" size="sm" onClick={toggleDarkMode}>
              <Icon component="span" lucideIcon={isDarkMode ? Moon : Sun} />
            </Button>
            <Sheet id="main-nav" side="left" size="md" triggerIcon={Menu} title="Menu">
              <NavMenu />
            </Sheet>
          </Group>
        )}
      </Group>
    </Block>
  )
}