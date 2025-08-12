"use client"
import { Panel, PanelResizeHandle, PanelGroup } from 'react-resizable-panels';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { useRef } from 'react';
import { useMobile } from '@ui8kit/hooks';
import { Home } from 'lucide-react';

import { Block, Container, Grid, Box, Card, Button, Icon, Stack, Text, Title } from "@ui8kit/core"
import { useTheme } from '@/providers/ThemeProvider';

export default function Dashboard() {
  const sidebarPanelRef = useRef<any>(null);
  const panelGroupRef = useRef<any>(null);

  const { isDarkMode, toggleDarkMode, rounded, buttonSize } = useTheme();
  const isMobile = useMobile();

  return (
    <>
      <Navbar
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />
      {!isMobile && (
        <Block component="main" h="screen" position="relative" w="full">
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
            <PanelResizeHandle data-class="resize-handle" className="w-1 bg-border data-[panel-group-direction=horizontal]:cursor-col-resize" />
            <Panel defaultSize={80} minSize={50} className="flex flex-col" data-class="resize-panel">
              <Box p="md">
                <Container>
                  <Stack gap="lg" align="start">
                    <Title size="2xl" c="secondary-foreground" mt="lg">Dashboard</Title>
                    <Text c="muted">Welcome to the dashboard</Text>
                    <Grid cols="1-2-3" gap="lg" w="full">
                      <Card p="md" rounded={rounded?.default} shadow="none" bg="card" w="full">
                        <Stack gap="sm" align="start">
                          <Text size="lg" fw="bold" c="primary">Card Title</Text>
                          <Text size="sm" c="muted">Card Description</Text>
                          <Button variant="ghost" size={buttonSize.default} rounded={rounded?.default}>
                            <Icon component="span" lucideIcon={Home} />
                            <Text size="sm" c="muted">Call to action</Text>
                          </Button>
                        </Stack>
                      </Card>
                      <Card p="md" rounded={rounded?.default} shadow="none" bg="card" w="full">
                        <Stack gap="sm" align="start">
                          <Text size="lg" fw="bold" c="primary">Card Title</Text>
                          <Text size="sm" c="muted">Card Description</Text>
                          <Button variant="ghost" size={buttonSize.default} rounded={rounded?.default}>
                            <Icon component="span" lucideIcon={Home} />
                            <Text size="sm" c="muted">Call to action</Text>
                          </Button>
                        </Stack>
                      </Card>
                      <Card p="md" rounded={rounded?.default} shadow="none" bg="card" w="full">
                        <Stack gap="sm" align="start">
                          <Text size="lg" fw="bold" c="primary">Card Title</Text>
                          <Text size="sm" c="muted">Card Description</Text>
                          <Button variant="ghost" size={buttonSize.default} rounded={rounded?.default}>
                            <Icon component="span" lucideIcon={Home} />
                            <Text size="sm" c="muted">Call to action</Text>
                          </Button>
                        </Stack>
                      </Card>
                    </Grid>

                    <Card p="md" rounded={rounded?.default} shadow="lg" bg="card" w="full">
                      <Stack gap="md" align="start">
                        <Text size="lg" fw="bold" c="primary">Full Width Card</Text>
                        <Text c="muted">This card is full width and spans the entire width of the container.</Text>
                        <Button variant="secondary" size={buttonSize.default} rounded={rounded?.default}>
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
          <Card p="md" rounded={rounded?.default} shadow="lg" bg="card" w="full">
            <Stack gap="md" align="start">
              <Text size="lg" fw="bold" c="primary">Mobile Dashboard</Text>
              <Text c="muted">This is a mobile dashboard.</Text>
            </Stack>
          </Card>
        </Block>
      )}
    </>
  )
}