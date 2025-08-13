import { Stack, Button, Icon, Text, Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@ui8kit/core";
import { Home, BarChart3, CreditCard, Users, Plug, LogIn, UserPlus, FilePlus2, List, Blocks } from "lucide-react";
import { allTemplates } from "@/blocks";
import { useAppTheme } from '@/hooks/use-theme';
import { useNavigate } from "react-router-dom";

export function NavMenu() {
  const { buttonSize, rounded } = useAppTheme();
  const navigate = useNavigate();

  const roundedItem = rounded.button;

  // Derive block categories dynamically from allTemplates
  const getTemplateCategoryFromId = (templateId: string): string => {
    const parts = templateId.match(/[A-Z]+[a-z]*|^[a-z]+/g) || [];
    const token = parts[1] || parts[0] || "";
    return token.toLowerCase();
  };
  const blockCategories = Array.from(new Set((allTemplates as any[]).map(t => getTemplateCategoryFromId(t.id)))).sort();

  return (
    <Stack gap="sm" align="start">
      <Button onClick={() => navigate('/')} variant="ghost" size={buttonSize.default} rounded={roundedItem} contentAlign="start" w="full">
        <Icon component="span" lucideIcon={Home} />
        <Text size="sm" c="muted">Overview</Text>
      </Button>

      <Button onClick={() => navigate('/stat')} variant="ghost" size={buttonSize.default} rounded={roundedItem} contentAlign="start" w="full">
        <Icon component="span" lucideIcon={BarChart3} />
        <Text size="sm" c="muted">Reports</Text>
      </Button>

      <Accordion type="single" collapsible w="full">
        <AccordionItem gap="sm" value="crud">
          <AccordionTrigger rounded={roundedItem}>
            <Text size="sm" c="foreground">CRUD</Text>
          </AccordionTrigger>
          <AccordionContent>
            <Stack gap="xs" align="start">
              <Button onClick={() => navigate('/crud/create')} variant="ghost" size={buttonSize.default} rounded={roundedItem} contentAlign="start" w="full">
                <Icon component="span" lucideIcon={FilePlus2} />
                <Text size="xs" c="muted">Create post</Text>
              </Button>
              <Button onClick={() => navigate('/crud/list')} variant="ghost" size={buttonSize.default} rounded={roundedItem} contentAlign="start" w="full">
                <Icon component="span" lucideIcon={List} />
                <Text size="xs" c="muted">Posts list</Text>
              </Button>
            </Stack>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem gap="sm" value="blocks">
          <AccordionTrigger rounded={roundedItem}>
            <Text size="sm" c="foreground">Blocks</Text>
          </AccordionTrigger>
          <AccordionContent>
            <Stack gap="xs" align="start">
              {blockCategories.map((cat) => (
                <Button key={cat} onClick={() => navigate(`/blocks/${cat}`)} variant="ghost" size={buttonSize.default} rounded={roundedItem} contentAlign="start" w="full">
                  <Icon component="span" lucideIcon={Blocks} />
                  <Text size="xs" c="muted">{cat}</Text>
                </Button>
              ))}
            </Stack>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem gap="sm" value="more">
          <AccordionTrigger rounded={roundedItem}>
            <Text size="sm" c="foreground">More</Text>
          </AccordionTrigger>
          <AccordionContent>
            <Stack gap="xs" align="start">
              <Button onClick={() => navigate('/login')} variant="ghost" size={buttonSize.default} rounded={roundedItem} contentAlign="start" w="full">
                <Icon component="span" lucideIcon={LogIn} />
                <Text size="xs" c="muted">Login</Text>
              </Button>
              <Button onClick={() => navigate('/register')} variant="ghost" size={buttonSize.default} rounded={roundedItem} contentAlign="start" w="full">
                <Icon component="span" lucideIcon={UserPlus} />
                <Text size="xs" c="muted">Register</Text>
              </Button>
              <Button onClick={() => navigate('/billing')} variant="ghost" size={buttonSize.default} rounded={roundedItem} contentAlign="start" w="full">
                <Icon component="span" lucideIcon={CreditCard} />
                <Text size="xs" c="muted">Billing</Text>
              </Button>
              <Button onClick={() => navigate('/team')} variant="ghost" size={buttonSize.default} rounded={roundedItem} contentAlign="start" w="full">
                <Icon component="span" lucideIcon={Users} />
                <Text size="xs" c="muted">Team</Text>
              </Button>
              <Button onClick={() => navigate('/integrations')} variant="ghost" size={buttonSize.default} rounded={roundedItem} contentAlign="start" w="full">
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


