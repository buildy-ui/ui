import { Block, Button, Icon, Text, Group, Sheet, Box } from "@ui8kit/core";
import { Atom, Home, Moon, Sun, Menu, BarChart3 } from "lucide-react";
import { useLayoutEffect, useRef } from 'react';
import { useMobile } from "@ui8kit/hooks";

import { useAppTheme } from '@/hooks/use-theme';
import { NavMenu } from "./NavMenu";
import { useNavigate } from "react-router-dom";

export function Navbar({ isDarkMode, toggleDarkMode }: { isDarkMode: boolean, toggleDarkMode: () => void }) {
  const isMobile = useMobile();
  const { rounded, buttonSize, isNavFixed } = useAppTheme();
  const navRef = useRef<HTMLElement | null>(null);
  const navigate = useNavigate();
  // Measure navbar height and expose as a CSS variable for layout
  useLayoutEffect(() => {
    const updateVar = () => {
      const h = navRef.current?.getBoundingClientRect().height ?? 0;
      document.documentElement.style.setProperty('--app-navbar-h', `${Math.round(h)}px`);
    };
    updateVar();
    window.addEventListener('resize', updateVar);
    return () => window.removeEventListener('resize', updateVar);
  }, []);
  return (
    <Block
      ref={navRef as any}
      component="nav"
      bg="card"
      p="md"
      data-class="navbar"
      className={`border-b border-border ${isNavFixed ? 'fixed top-0 left-0 right-0 z-50' : ''}`}
      position={isNavFixed ? 'fixed' : 'relative'}
    >
      <Group justify="between" align="center">
        <Group onClick={() => navigate('/')} gap="sm" align="center" className="cursor-pointer">
          <Icon size="lg" c="primary" component="span" lucideIcon={Atom} />
          <Text size="lg" fw="bold" c="secondary-foreground">
            BuildY/UI
          </Text>
        </Group>

        {!isMobile && (
          <Group gap="xs" align="center">
            <Button variant="ghost" size={buttonSize.default} rounded={rounded.button} onClick={() => navigate('/')}>
              <Icon component="span" lucideIcon={Home} />
              <Text size="sm" c="muted">Home</Text>
            </Button>
            <Button variant="ghost" size={buttonSize.default} rounded={rounded.button} onClick={() => navigate('/stat')}>
              <Icon component="span" lucideIcon={BarChart3} />
              <Text size="sm" c="muted">Stat</Text>
            </Button>
            <Button variant="ghost" size={buttonSize.default} rounded={rounded.button} onClick={toggleDarkMode}>
              <Icon component="span" lucideIcon={isDarkMode ? Moon : Sun} />
            </Button>
          </Group>
        )}

        {isMobile && (
          <Group gap="xs" align="center">
            <Button variant="ghost" size={buttonSize.default} rounded={rounded.button} onClick={toggleDarkMode}>
              <Icon component="span" lucideIcon={isDarkMode ? Moon : Sun} />
            </Button>
            <Sheet id="main-nav" side="left" size="md" triggerIcon={Menu} title="Menu">
              <Box overflow="auto" h="screen">
                <NavMenu />
              </Box>
            </Sheet>
          </Group>
        )}
      </Group>
    </Block>
  )
}