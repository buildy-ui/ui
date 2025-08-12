"use client"
import { Panel, PanelResizeHandle, PanelGroup } from 'react-resizable-panels';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { useRef, type ComponentType } from 'react';
import { Block, Container, Box, Stack } from "@ui8kit/core"
import { useAppTheme } from '@/hooks/use-theme';
import { useMobile } from '@ui8kit/hooks';

interface DashboardLayoutProps {
  page: ComponentType;
}

export function Dashboard({ page }: DashboardLayoutProps) {
  const sidebarPanelRef = useRef<any>(null);
  const panelGroupRef = useRef<any>(null);

  const { isDarkMode, toggleDarkMode, isNavFixed } = useAppTheme();
  const isMobile = useMobile();

  return (
    <>
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <Block component="main" h="screen" position="relative" w="full" style={{ paddingTop: isNavFixed ? 'var(--app-navbar-h)' : undefined }}>
        <PanelGroup direction="horizontal" ref={panelGroupRef} autoSaveId="dashboard-panels">
          {!isMobile && (
            <Panel
              id="sidebar"
              order={1}
              ref={sidebarPanelRef}
              defaultSize={20}
              minSize={12}
              maxSize={40}
              collapsible={true}
            >
              <Sidebar className="bg-card/50 border-r border-border h-full w-full" data-class="sidebar" />
            </Panel>
          )}
          {!isMobile && (
            <PanelResizeHandle data-class="resize-handle" className="w-1 bg-border data-[panel-group-direction=horizontal]:cursor-col-resize" />
          )}
          <Panel id="main" order={2} defaultSize={!isMobile ? 80 : 100} minSize={50} className="flex flex-col" data-class="resize-panel">
            <Box p="md" overflow="auto" style={{ height: isNavFixed ? 'calc(100vh - var(--app-navbar-h))' : '100%' }}>
              <Container>
                {(() => { const Page = page; return <Page />; })()}
              </Container>
            </Box>
          </Panel>
        </PanelGroup>
      </Block>
    </>
  )
}
