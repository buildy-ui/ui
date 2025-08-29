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
      <Box overflow="auto" h="screen">
        <Stack p="md" align="start">
          <Text c="muted">Sidebar</Text>
        </Stack>
        <Stack gap="lg" p="md">
          <NavMenu />
          <Card rounded={rounded?.default}>
            <Calendar
              mode="single"
              month={month}
              onMonthChange={setMonth}
              selected={date}
              onSelect={setDate}
              className="bg-transparent p-0 w-full justify-center"
            />
          </Card>
        </Stack>
      </Box>
    </Block>
  )
}