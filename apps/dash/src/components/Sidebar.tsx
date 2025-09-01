"use client"
import * as React from "react"
import { Block, Box, Card, Stack, Text } from "@ui8kit/core"
import { NavMenu } from "./NavMenu";
import { useAppTheme } from '@/hooks/use-theme';
import { Calendar } from "./ui/calendar";

interface SidebarProps {
  className?: string;
  dataClass?: string;
}

export function Sidebar({ className, dataClass }: SidebarProps) {
  const { rounded } = useAppTheme();
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(2025, 5, 12)
  )
  const [month, setMonth] = React.useState<Date | undefined>(new Date())
  return (
    <Block component="aside" className={className} data-class={dataClass}>
      <Box overflow="auto" h="screen" data-class="sidebar-main">
        <Stack p="md" align="start" data-class="sidebar-header">
          <Text c="muted" data-class="sidebar-header-text">Sidebar</Text>
        </Stack>
        <Stack gap="lg" p="md" data-class="sidebar-content">
          <NavMenu />
          <Card rounded={rounded?.default} data-class="sidebar-widget">
            <Calendar
              mode="single"
              month={month}
              onMonthChange={setMonth}
              selected={date}
              onSelect={setDate}
              className="bg-transparent p-0 w-full justify-center"
              data-class="widget-calendar"
            />
          </Card>
        </Stack>
      </Box>
    </Block>
  )
}