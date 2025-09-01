"use client"
import { Panel, PanelResizeHandle, PanelGroup } from 'react-resizable-panels';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { useRef, type ComponentType } from 'react';
import { Block, Container, Box } from "@ui8kit/core"
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
      <Block
        component="main"
        h={isNavFixed ? 'screen' : undefined}
        position="relative"
        w="full"
        data-class="dashboard-main"
        style={
          isNavFixed
            ? { marginTop: 'var(--app-navbar-h)', height: 'calc(100vh - var(--app-navbar-h))' }
            : undefined
        }
      >
        <PanelGroup direction="horizontal" ref={panelGroupRef} autoSaveId="dashboard-panels">
          {!isMobile && (
            <Panel
              id="panel-sidebar"
              order={1}
              ref={sidebarPanelRef}
              defaultSize={20}
              minSize={12}
              maxSize={40}
              collapsible={true}
            >
              <Sidebar className="bg-card/50 border-r border-border h-full w-full" data-class="dashboard-sidebar" />
            </Panel>
          )}
          {!isMobile && (
            <PanelResizeHandle
              data-class="resize-handle"
              className="w-0 bg-accent data-[panel-group-direction=horizontal]:cursor-col-resize data-[resize-handle-state=hover]:w-1 data-[resize-handle-state=drag]:w-1 data-[resize-handle-state=drag]:bg-primary/50"
            />
          )}
          <Panel id="panel-main" order={2} defaultSize={!isMobile ? 80 : 100} minSize={50} className="flex flex-col" data-class="resize-panel">
            <Box
              data-class="panel-main"
              p="md"
              overflow={isNavFixed ? 'auto' : 'visible'}
              style={isNavFixed ? { height: '100%' } : undefined}
            >
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
