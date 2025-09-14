//import React from "react";
import { Block, Box, Container, Button, Icon, Text, Group, Stack, Title } from "../index";
import { Atom, Moon, Sun } from "lucide-react";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";

// Sidebar component used by the DashLayout factory
export interface SidebarProps {
  children?: React.ReactNode;
  className?: string;
  dataClass?: string;
  title?: string;
}

export function Sidebar({ children, className, dataClass, title }: SidebarProps) {
  return (
    <Block component="aside" className={className} data-class={dataClass}>
      <Box p="md">
        <Stack gap="md" data-role="dash-sidebar-stack">
          {title && <Text c="muted">{title}</Text>}
          {children}
        </Stack>
      </Box>
    </Block>
  );
}

// Minimal Navbar with brand and a single dark-mode toggle button
export interface NavbarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  brand?: string;
}

export function Navbar({ isDarkMode, toggleDarkMode, brand = "App" }: NavbarProps) {
  return (
    <Block component="nav" bg="card" p="md" data-role="dash-navbar">
      <Group justify="between" align="center">
        <Group gap="sm" align="center">
          <Icon component="span" lucideIcon={Atom} c="primary" />
          <Text fw="bold">{brand}</Text>
        </Group>

        <Button variant="ghost" title="Toggle dark mode" onClick={toggleDarkMode}>
          <Icon component="span" lucideIcon={isDarkMode ? Sun : Moon} />
          <Text size="sm">Theme</Text>
        </Button>
      </Group>
    </Block>
  );
}

// Dashboard layout composing react-resizable-panels with ui8kit primitives
export interface DashboardProps {
  /** Optional page component to render in the main panel */
  page?: React.ComponentType;
  /** Optional children to render in the main panel (used if `page` is not provided) */
  children?: React.ReactNode;
  /** Optional sidebar content */
  sidebar?: React.ReactNode;
  /** Navbar props */
  navbarProps?: Omit<NavbarProps, 'toggleDarkMode' | 'isDarkMode'> & Partial<Pick<NavbarProps, 'isDarkMode' | 'toggleDarkMode'>>;
}

export function Dashboard({ page: Page, children, sidebar, navbarProps }: DashboardProps) {
  // The Dashboard is intentionally minimal: it composes PanelGroup/Panel/PanelResizeHandle
  // and exposes slots for `Navbar`, `Sidebar` and main content.
  const toggle = typeof navbarProps?.toggleDarkMode === 'function' ? navbarProps.toggleDarkMode : () => {};
  const isDark = navbarProps?.isDarkMode ?? false;

  return (
    <>
      <Navbar isDarkMode={isDark} toggleDarkMode={toggle} brand={navbarProps?.brand} />

      <Block component="main" data-role="dash-main" position="relative" w="full">
        <PanelGroup direction="horizontal" autoSaveId="dashlayout-panels">
          <Panel defaultSize={20} minSize={10} maxSize={40}>
            <Sidebar>{sidebar}</Sidebar>
          </Panel>

          <PanelResizeHandle />

          <Panel defaultSize={80} minSize={50}>
            <Box p="md">
              <Container>{Page ? <Page /> : children}</Container>
            </Box>
          </Panel>
        </PanelGroup>
      </Block>
    </>
  );
}

// Default export: factory alias
export default function DashLayout(props: DashboardProps) {
  return <Dashboard {...props} />;
}


