import { Stack, Button, Icon, Text, Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@ui8kit/core";
import { Home, BarChart3, LogIn, UserPlus, FilePlus2, List, Boxes, Brain, TableProperties, Database, Share2 } from "lucide-react";
import { ListPlus } from "lucide-react";
import { useAppTheme } from '@/hooks/use-theme';
import { useNavigate } from "react-router-dom";

export function NavMenu() {
  const { buttonSize, rounded } = useAppTheme();
  const navigate = useNavigate();

  const roundedItem = rounded.button;

  return (
    <Stack gap="sm" align="start" data-class="dashboard-menu">
      <Button data-class="menu-item" onClick={() => navigate('/')} variant="ghost" size={buttonSize.default} rounded={roundedItem} contentAlign="start" w="full">
        <Icon component="span" lucideIcon={Home} />
        <Text size="sm" c="muted">Overview</Text>
      </Button>

      <Button data-class="menu-item" onClick={() => navigate('/stat')} variant="ghost" size={buttonSize.default} rounded={roundedItem} contentAlign="start" w="full">
        <Icon component="span" lucideIcon={BarChart3} />
        <Text size="sm" c="muted">Reports</Text>
      </Button>

      <Button data-class="menu-item" onClick={() => navigate('/blank')} variant="ghost" size={buttonSize.default} rounded={roundedItem} contentAlign="start" w="full">
        <Icon component="span" lucideIcon={Boxes} />
        <Text size="sm" c="muted">Blank</Text>
      </Button>

      <Accordion type="single" collapsible w="full">
        <AccordionItem gap="sm" value="tools">
          <AccordionTrigger rounded={roundedItem}>
            <Text size="sm" c="foreground">AI Brain</Text>
          </AccordionTrigger>
          <AccordionContent>
            <Stack gap="xs" align="start">
              <Button data-class="menu-item" onClick={() => navigate('/brain')} variant="ghost" size={buttonSize.default} rounded={roundedItem} contentAlign="start" w="full">
                <Icon component="span" lucideIcon={Brain} />
                <Text size="xs" c="muted">Tools</Text>
              </Button>
              <Button data-class="menu-item" onClick={() => navigate('/brain/items')} variant="ghost" size={buttonSize.default} rounded={roundedItem} contentAlign="start" w="full">
                <Icon component="span" lucideIcon={TableProperties} />
                <Text size="xs" c="muted">Items</Text>
              </Button>
              <Button data-class="menu-item" onClick={() => navigate('/brain/qdrant')} variant="ghost" size={buttonSize.default} rounded={roundedItem} contentAlign="start" w="full">
                <Icon component="span" lucideIcon={Database} />
                <Text size="xs" c="muted">Qdrant</Text>
              </Button>
              <Button data-class="menu-item" onClick={() => navigate('/brain/qdrant-graph')} variant="ghost" size={buttonSize.default} rounded={roundedItem} contentAlign="start" w="full">
                <Icon component="span" lucideIcon={Share2} />
                <Text size="xs" c="muted">Qdrant Graph</Text>
              </Button>
              <Button data-class="menu-item" onClick={() => navigate('/brain/new-item')} variant="ghost" size={buttonSize.default} rounded={roundedItem} contentAlign="start" w="full">
                <Icon component="span" lucideIcon={ListPlus} />
                <Text size="xs" c="muted">New item</Text>
              </Button>
            </Stack>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion type="single" collapsible w="full">
        <AccordionItem gap="sm" value="crud">
          <AccordionTrigger rounded={roundedItem}>
            <Text size="sm" c="foreground">CRUD</Text>
          </AccordionTrigger>
          <AccordionContent>
            <Stack gap="xs" align="start">
              <Button data-class="menu-item" onClick={() => navigate('/crud/create')} variant="ghost" size={buttonSize.default} rounded={roundedItem} contentAlign="start" w="full">
                <Icon component="span" lucideIcon={FilePlus2} />
                <Text size="xs" c="muted">Create post</Text>
              </Button>
              <Button data-class="menu-item" onClick={() => navigate('/crud/list')} variant="ghost" size={buttonSize.default} rounded={roundedItem} contentAlign="start" w="full">
                <Icon component="span" lucideIcon={List} />
                <Text size="xs" c="muted">Posts list</Text>
              </Button>
            </Stack>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem gap="sm" value="more">
          <AccordionTrigger rounded={roundedItem}>
            <Text size="sm" c="foreground">More</Text>
          </AccordionTrigger>
          <AccordionContent>
            <Stack gap="xs" align="start">
              <Button data-class="menu-item" onClick={() => navigate('/login')} variant="ghost" size={buttonSize.default} rounded={roundedItem} contentAlign="start" w="full">
                <Icon component="span" lucideIcon={LogIn} />
                <Text size="xs" c="muted">Login</Text>
              </Button>
              <Button data-class="menu-item" onClick={() => navigate('/register')} variant="ghost" size={buttonSize.default} rounded={roundedItem} contentAlign="start" w="full">
                <Icon component="span" lucideIcon={UserPlus} />
                <Text size="xs" c="muted">Register</Text>
              </Button>
            </Stack>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Stack>
  );
}
