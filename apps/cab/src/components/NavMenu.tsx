import { Stack, Button, Icon, Text, Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@ui8kit/core";
import { Home, BarChart3, CreditCard, Users, Plug } from "lucide-react";
import { useAppTheme } from '@/hooks/use-theme';
import { useNavigate } from "react-router-dom";

export function NavMenu() {
  const { rounded, buttonSize } = useAppTheme();
  const navigate = useNavigate();
  return (
    <Stack gap="sm" align="start">
      <Button onClick={() => navigate('/')} variant="ghost" size={buttonSize.default} rounded={rounded.default} contentAlign="start" w="full">
        <Icon component="span" lucideIcon={Home} />
        <Text size="sm" c="muted">Overview</Text>
      </Button>

      <Button onClick={() => navigate('/stat')} variant="ghost" size={buttonSize.default} rounded={rounded.default} contentAlign="start" w="full">
        <Icon component="span" lucideIcon={BarChart3} />
        <Text size="sm" c="muted">Reports</Text>
      </Button>

      <Accordion type="single" collapsible w="full">
        <AccordionItem gap="sm" value="more">
          <AccordionTrigger>
            <Text size="sm" c="foreground">More</Text>
          </AccordionTrigger>
          <AccordionContent>
            <Stack gap="xs" align="start">
              <Button variant="ghost" size={buttonSize.default} rounded={rounded.default} contentAlign="start" w="full">
                <Icon component="span" lucideIcon={CreditCard} />
                <Text size="xs" c="muted">Billing</Text>
              </Button>
              <Button variant="ghost" size={buttonSize.default} rounded={rounded.default} contentAlign="start" w="full">
                <Icon component="span" lucideIcon={Users} />
                <Text size="xs" c="muted">Team</Text>
              </Button>
              <Button variant="ghost" size={buttonSize.default} rounded={rounded.default} contentAlign="start" w="full">
                <Icon component="span" lucideIcon={Plug} />
                <Text size="xs" c="muted">Integrations</Text>
              </Button>
            </Stack>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Stack>
  );
}


