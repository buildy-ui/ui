"use client"
import { Panel, PanelResizeHandle, PanelGroup } from 'react-resizable-panels';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { useState, useRef, useCallback, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Home } from 'lucide-react';

import { Block, Container, Grid, Box, Card, Button, Icon, Stack, Text, Title } from "@ui8kit/core"

import { skyOSTheme } from "@ui8kit/theme";

const currentTheme = skyOSTheme;

const theme = {
  theme: currentTheme,
  rounded: currentTheme.rounded,
  buttonSize: {
    default: "sm" as const,
    large: "lg" as const,
  }
}

export default function Dashboard() {

  // Refs for panel control
  const sidebarPanelRef = useRef<any>(null);
  const panelGroupRef = useRef<any>(null);

  // Dark mode toggle
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Dark mode toggle
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      document.documentElement.classList.toggle('dark', newMode);
      return newMode;
    });
  }, []);

  // Initialize dark mode from system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const initialMode = mediaQuery.matches;
    setIsDarkMode(initialMode);
    document.documentElement.classList.toggle('dark', initialMode);
  }, []);

  const isMobile = useIsMobile();

  return (
    <Block className={`${isDarkMode ? 'dark' : ''}`}>
      <Navbar
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />
      {!isMobile && (
      <Block className="flex-1 h-screen relative" data-class="dashboard-layout">
        <PanelGroup direction="horizontal" ref={panelGroupRef}>
          <Panel
            ref={sidebarPanelRef}
            defaultSize={20}
            minSize={12}
            maxSize={40}
            collapsible={true}
          >
            <Sidebar className="bg-card border-r border-border h-full w-full" data-class="sidebar" />
          </Panel>
          <PanelResizeHandle data-class="resize-handle" className="w-1 bg-border hover:bg-accent transition-colors data-[panel-group-direction=horizontal]:cursor-col-resize" />
          <Panel defaultSize={80} minSize={50} className="flex flex-col" data-class="resize-panel">
            <Box component="main" p="md">
              <Container>
                <Stack gap="lg" align="start">
                  <Title size="2xl" c="secondary-foreground">Dashboard</Title>
                  <Text c="muted">Welcome to the dashboard</Text>
                  <Grid cols="1-2-3" gap="md" className="w-full">
                    <Card p="md" rounded={theme?.rounded.default} shadow="none" bg="card" w="full">
                      <Stack gap="sm" align="start">
                        <Text size="lg" fw="bold" c="primary">Card Title</Text>
                        <Text size="sm" c="muted">Card Description</Text>
                      <Button variant="ghost" size={theme?.buttonSize.default} rounded={theme?.rounded.default}>
                        <Icon component="span" lucideIcon={Home} />
                        <Text size="sm" c="muted">Call to action</Text>
                      </Button>
                      </Stack>
                    </Card>
                    <Card p="md" rounded={theme?.rounded.default} shadow="none" bg="card" w="full">
                      <Stack gap="sm" align="start">
                        <Text size="lg" fw="bold" c="primary">Card Title</Text>
                        <Text size="sm" c="muted">Card Description</Text>
                      <Button variant="ghost" size={theme?.buttonSize.default} rounded={theme?.rounded.default}>
                        <Icon component="span" lucideIcon={Home} />
                        <Text size="sm" c="muted">Call to action</Text>
                      </Button>
                      </Stack>
                    </Card>
                    <Card p="md" rounded={theme?.rounded.default} shadow="none" bg="card" w="full">
                      <Stack gap="sm" align="start">
                        <Text size="lg" fw="bold" c="primary">Card Title</Text>
                        <Text size="sm" c="muted">Card Description</Text>
                      <Button variant="ghost" size={theme?.buttonSize.default} rounded={theme?.rounded.default}>
                        <Icon component="span" lucideIcon={Home} />
                        <Text size="sm" c="muted">Call to action</Text>
                      </Button>
                      </Stack>
                    </Card>
                  </Grid>

                  <Card p="md" rounded={theme?.rounded.default} shadow="lg" bg="card" w="full">
                    <Stack gap="md" align="start">
                      <Text size="lg" fw="bold" c="primary">Full Width Card</Text>
                      <Text c="muted">This card is full width and spans the entire width of the container.</Text>
                    <Button variant="secondary" size={theme?.buttonSize.large} rounded={theme?.rounded.default}>
                      <Icon component="span" lucideIcon={Home} />
                      <Text size="sm" c="muted">Call to action</Text>
                    </Button>
                    </Stack>
                  </Card>
                </Stack>
              </Container>
            </Box>
          </Panel>
        </PanelGroup>
      </Block>
      )}
      {isMobile && (
        <Block component="main" p="md" className="flex-1 h-screen relative" data-class="dashboard-layout">
          <Card p="md" rounded={theme?.rounded.default} shadow="lg" bg="card" w="full">
            <Stack gap="md" align="start">
              <Text size="lg" fw="bold" c="primary">Mobile Dashboard</Text>
              <Text c="muted">This is a mobile dashboard.</Text>
            </Stack>
          </Card>
        </Block>
      )}
    </Block>
  )
}