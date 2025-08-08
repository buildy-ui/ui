"use client"
import { Panel, PanelResizeHandle, PanelGroup } from 'react-resizable-panels';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { useState, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Block, Button, Icon } from "@ui8kit/core"

export default function Dashboard() {
  // Local state for sidebar visibility and size
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [savedSidebarSize, setSavedSidebarSize] = useState(25);

  // Refs for panel control
  const sidebarPanelRef = useRef<any>(null);
  const panelGroupRef = useRef<any>(null);

  // Toggle sidebar collapse/expand
  const toggleSidebar = useCallback(() => {
    const panel = sidebarPanelRef.current;
    if (!panel) return;

    // Use requestAnimationFrame to batch DOM operations
    requestAnimationFrame(() => {
      if (isSidebarCollapsed) {
        // Expand sidebar
        panel.resize(savedSidebarSize);
        setIsSidebarCollapsed(false);
      } else {
        // Collapse sidebar - get size before resize to avoid multiple reflows
        const currentSize = panel.getSize();
        setSavedSidebarSize(currentSize);
        panel.resize(0);
        setIsSidebarCollapsed(true);
      }
    });
  }, [isSidebarCollapsed, savedSidebarSize]);

  return (
    <>
      <Navbar />
      <Block className="flex-1 relative">
        <PanelGroup direction="horizontal" ref={panelGroupRef}>
          <Panel
            ref={sidebarPanelRef}
            defaultSize={25}
            minSize={0}
            maxSize={40}
            collapsible={true}
          >
            <Sidebar />
          </Panel>
          <PanelResizeHandle data-class="resize-handle" className="w-1 bg-border hover:bg-accent transition-colors data-[panel-group-direction=horizontal]:cursor-col-resize" />
          <Panel defaultSize={75} minSize={60} className="flex flex-col" data-class="resize-panel">
            <Button>Dashboard</Button>
          </Panel>
        </PanelGroup>

        {/* Floating Toggle Button */}
        <Button
          onClick={toggleSidebar}
          data-class="toggle-button"
          className="absolute -top-4 left-1 z-50 shadow-lg bg-transparent rounded-full !w-8 !h-8"
          variant="ghost"
        >
          {isSidebarCollapsed ? (
            <Icon
              component="span"
              lucideIcon={ChevronRight}
            />
          ) : (
            <Icon
              component="span"
              lucideIcon={ChevronLeft}
            />
          )}
        </Button>
      </Block>
    </>
  )
}