import { forwardRef } from "react";
import { MapPin, Clock } from "lucide-react";
import {
  Block,
  Container,
  Stack,
  Grid,
  Group,
  Title,
  Text,
  Button,
  Icon
} from "@ui8kit/core";

interface FeaturesCareerStatsProps {
  content: {
    tagline: string;
    title: string;
    description: string;
    positions: Array<{
      id: string;
      jobTitle: string;
      department: string;
      description: string;
      location: string;
      contractType: string;
    }>;
  };
}

export const FeaturesCareerStats = forwardRef<HTMLElement, FeaturesCareerStatsProps>(
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
          <Grid
            cols={1}
            colsMd={2}
            gap="3xl"
            align="start"
          >
            {/* Left Side - Header */}
            <Stack gap="lg">
              <Text
                size="sm"
                c="muted-foreground"
                fw="medium"
              >
                {content.tagline}
              </Text>
              
              <Title
                order={2}
                size="3xl"
                fw="bold"
              >
                {content.title}
              </Title>
              
              <Text
                size="md"
                c="muted-foreground"
              >
                {content.description}
              </Text>
            </Stack>
            
            {/* Right Side - Positions List */}
            <Stack gap="lg">
              {content.positions.map((position, index) => (
                <Block key={position.id}>
                  <Stack gap="md">
                    {/* Position Header */}
                    <Group justify="space-between" align="start">
                      <Title
                        order={3}
                        size="lg"
                        fw="semibold"
                      >
                        {position.jobTitle}
                      </Title>
                      
                      <Text
                        size="sm"
                        c="muted-foreground"
                        fw="medium"
                      >
                        {position.department}
                      </Text>
                    </Group>
                    
                    {/* Description */}
                    <Text
                      size="sm"
                      c="muted-foreground"
                    >
                      {position.description}
                    </Text>
                    
                    {/* Location and Contract Type */}
                    <Group gap="lg" align="center">
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
                          {position.contractType}
                        </Text>
                      </Group>
                    </Group>
                    
                    {/* Apply Button */}
                    <Group justify="start">
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        Apply Now
                      </Button>
                    </Group>
                  </Stack>
                  
                  {/* Divider */}
                  {index < content.positions.length - 1 && (
                    <Block
                      w="full"
                      bg="border"
                      mt="lg"
                      style={{ height: "1px" }}
                    />
                  )}
                </Block>
              ))}
            </Stack>
          </Grid>
        </Container>
      </Block>
    );
  }
);

FeaturesCareerStats.displayName = "FeaturesCareerStats";

export const featuresCareerStatsTemplate = {
  id: "featuresCareerStats",
  name: "Features Career Stats",
  description: "Career positions section with split layout - info on left, job listings on right",
  component: FeaturesCareerStats,
  defaultContent: {
    tagline: "Tagline",
    title: "Open Positions",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
    positions: [
      {
        id: "1",
        jobTitle: "Job Title",
        department: "Department",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
        location: "Location",
        contractType: "Contract Type"
      },
      {
        id: "2",
        jobTitle: "Job Title",
        department: "Department", 
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
        location: "Location",
        contractType: "Contract Type"
      },
      {
        id: "3",
        jobTitle: "Job Title",
        department: "Department",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
        location: "Location",
        contractType: "Contract Type"
      }
    ]
  }
}; 