import { forwardRef } from "react";
import { MapPin, Clock, DollarSign } from "lucide-react";
import {
  Block,
  Container,
  Stack,
  Grid,
  Title,
  Text,
  Card,
  Group,
  Badge,
  Icon
} from "@ui8kit/core";

interface FeaturesCareerPositionsProps {
  content: {
    title: string;
    description: string;
    positions: Array<{
      id: string;
      title: string;
      department: string;
      location: string;
      type: string;
      salary: string;
      description: string;
    }>;
  };
}

export const FeaturesCareerPositions = forwardRef<HTMLElement, FeaturesCareerPositionsProps>(
  ({ content }, ref) => {
    return (
      <Block
        component="section"
        ref={ref}
        w="full"
        py="lg"
        bg="background"
      >
        <Container size="lg" padding="responsive" centered>
          <Stack gap="3xl">
            {/* Header */}
            <Stack gap="lg" align="center" ta="center">
              <Title
                order={2}
                size="2xl"
                fw="bold"
                ta="center"
              >
                {content.title}
              </Title>
              
              <Text
                size="lg"
                c="muted-foreground"
                ta="center"
              >
                {content.description}
              </Text>
            </Stack>
            
            {/* Positions Grid */}
            <Grid
              cols={1}
              colsMd={2}
              gap="lg"
            >
              {content.positions.map((position) => (
                <Card
                  key={position.id}
                  padding="lg"
                  shadow="sm"
                  radius="lg"
                  border="thin"
                  bg="background"
                >
                  <Stack gap="md">
                    {/* Position Header */}
                    <Stack gap="sm">
                      <Group justify="space-between" align="start">
                        <Stack gap="xs">
                          <Title
                            order={3}
                            size="lg"
                            fw="semibold"
                          >
                            {position.title}
                          </Title>
                          
                          <Badge variant="secondary">
                            {position.department}
                          </Badge>
                        </Stack>
                      </Group>
                    </Stack>
                    
                    {/* Position Details */}
                    <Stack gap="sm">
                      <Group gap="md" align="center">
                        <Group gap="xs" align="center">
                          <Icon
                            component="span"
                            size="sm"
                            lucideIcon={MapPin}
                            c="muted-foreground"
                          />
                          <Text size="sm" c="muted-foreground">
                            {position.location}
                          </Text>
                        </Group>
                        
                        <Group gap="xs" align="center">
                          <Icon
                            component="span"
                            size="sm"
                            lucideIcon={Clock}
                            c="muted-foreground"
                          />
                          <Text size="sm" c="muted-foreground">
                            {position.type}
                          </Text>
                        </Group>
                        
                        <Group gap="xs" align="center">
                          <Icon
                            component="span"
                            size="sm"
                            lucideIcon={DollarSign}
                            c="muted-foreground"
                          />
                          <Text size="sm" c="muted-foreground">
                            {position.salary}
                          </Text>
                        </Group>
                      </Group>
                      
                      <Text
                        size="sm"
                        c="muted-foreground"
                      >
                        {position.description}
                      </Text>
                    </Stack>
                  </Stack>
                </Card>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Block>
    );
  }
);

FeaturesCareerPositions.displayName = "FeaturesCareerPositions";

export const featuresCareerPositionsTemplate = {
  id: "featuresCareerPositions",
  name: "Features Career Positions",
  description: "Career positions section with job cards displaying details",
  component: FeaturesCareerPositions,
  defaultContent: {
    title: "Open Positions",
    description: "Join our team and help us build the future of business solutions",
    positions: [
      {
        id: "1",
        title: "Senior Frontend Developer",
        department: "Engineering",
        location: "Remote",
        type: "Full-time",
        salary: "$80k - $120k",
        description: "We're looking for an experienced frontend developer to join our growing team and help build amazing user experiences."
      },
      {
        id: "2",
        title: "Product Manager",
        department: "Product",
        location: "New York",
        type: "Full-time", 
        salary: "$90k - $130k",
        description: "Lead product strategy and work closely with engineering and design teams to deliver exceptional products."
      },
      {
        id: "3",
        title: "UX Designer",
        department: "Design",
        location: "San Francisco",
        type: "Full-time",
        salary: "$70k - $100k",
        description: "Design intuitive and beautiful user experiences that delight our customers and drive business growth."
      },
      {
        id: "4",
        title: "Marketing Specialist",
        department: "Marketing",
        location: "Remote",
        type: "Part-time",
        salary: "$50k - $70k",
        description: "Develop and execute marketing campaigns to grow our brand awareness and customer acquisition."
      }
    ]
  }
}; 