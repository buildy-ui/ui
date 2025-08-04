import { useState, useCallback, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@ui8kit/core";
import type { Block } from "@/types";

import BlockSidebar from "./components/BlockSidebar";
import BuilderCanvas from "./components/BuilderCanvas";

export default function PageBuilder() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Optimized block update function
  const updateBlocks = useCallback((newBlocks: Block[] | ((prev: Block[]) => Block[])) => {
    setBlocks(newBlocks);
  }, []);

  // Dark mode toggle
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      document.documentElement.classList.toggle('dark', newMode);
      return newMode;
    });
  }, []);

  // Sidebar toggle
  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed(prev => !prev);
  }, []);

  // Initialize dark mode from system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const initialMode = mediaQuery.matches;
    setIsDarkMode(initialMode);
    document.documentElement.classList.toggle('dark', initialMode);
  }, []);

  return (
    <div className={`h-screen flex ${isDarkMode ? 'dark' : ''}`}>
      <div className={`border-r transition-all duration-300 ${isSidebarCollapsed ? 'w-0' : 'w-80'}`}>
        <BlockSidebar 
          blocks={blocks}
          setBlocks={updateBlocks}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          isSidebarCollapsed={isSidebarCollapsed}
          toggleSidebar={toggleSidebar}
        />
      </div>
      <div className="flex-1 relative">
        <BuilderCanvas 
          blocks={blocks}
          setBlocks={updateBlocks}
        />
        
        {/* Floating button to show sidebar when collapsed */}
        {isSidebarCollapsed && (
          <Button
            onClick={toggleSidebar}
            className="fixed top-4 left-4 z-50 shadow-lg"
            size="icon"
            variant="default"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
