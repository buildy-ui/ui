import { forwardRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Block,
  Container,
  Stack,
  Grid,
  Group,
  Title,
  Text,
  Button,
  Card,
  Image,
  Icon
} from "@ui8kit/core";

interface BlogSliderSectionProps {
  content: {
    tagline: string;
    title: string;
    description: string;
    viewAllText: string;
    posts: Array<{
      id: string;
      title: string;
      description: string;
      author: string;
      date: string;
      readTime: string;
      image?: {
        src: string;
        alt: string;
      };
      category: string;
    }>;
  };
}

export const BlogSliderSection = forwardRef<HTMLElement, BlogSliderSectionProps>(
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
            <Group justify="space-between" align="start">
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
              
              <Button
                variant="outline"
                size="sm"
              >
                {content.viewAllText}
              </Button>
            </Group>
            
            {/* Blog Posts Slider */}
            <Block
              position="relative"
              w="full"
            >
              <Grid
                cols={1}
                colsSm={2}
                colsMd={3}
                colsLg={4}
                gap="lg"
              >
                {content.posts.slice(0, 4).map((post) => (
                  <Card
                    key={post.id}
                    padding="none"
                    shadow="sm"
                    radius="lg"
                    border="thin"
                    bg="background"
                  >
                    <Stack gap="none">
                      {/* Image */}
                      <Block
                        w="full"
                        bg="muted"
                        rounded="lg"
                        style={{ aspectRatio: "16/10" }}
                      >
                        {post.image?.src ? (
                          <Image
                            src={post.image.src}
                            alt={post.image.alt}
                            fit="cover"
                            radius="t_lg"
                            width="100%"
                            style={{ aspectRatio: "16/10" }}
                          />
                        ) : (
                          <Block
                            w="full"
                            h="full"
                            display="flex"
                            bg="muted"
                            rounded="t_lg"
                            style={{
                              alignItems: "center",
                              justifyContent: "center",
                              aspectRatio: "16/10"
                            }}
                          >
                            <svg
                              width="32"
                              height="32"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              style={{ opacity: 0.4 }}
                            >
                              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                            </svg>
                          </Block>
                        )}
                      </Block>
                      
                      {/* Content */}
                      <Stack gap="md" p="lg">
                        <Text
                          size="sm"
                          c="muted-foreground"
                          fw="medium"
                        >
                          {post.category}
                        </Text>
                        
                        <Title
                          order={3}
                          size="md"
                          fw="semibold"
                        >
                          {post.title}
                        </Title>
                        
                        <Text
                          size="sm"
                          c="muted-foreground"
                        >
                          {post.description}
                        </Text>
                        
                        {/* Author Info */}
                        <Group gap="md" align="center">
                          <Block
                            bg="muted"
                            rounded="full"
                            style={{
                              width: "32px",
                              height: "32px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              style={{ opacity: 0.6 }}
                            >
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                          </Block>
                          
                          <Stack gap="xs">
                            <Text size="sm" fw="medium">
                              {post.author}
                            </Text>
                            
                            <Group gap="sm" align="center">
                              <Text size="xs" c="muted-foreground">
                                {post.date}
                              </Text>
                              <Text size="xs" c="muted-foreground">
                                •
                              </Text>
                              <Text size="xs" c="muted-foreground">
                                {post.readTime}
                              </Text>
                            </Group>
                          </Stack>
                        </Group>
                      </Stack>
                    </Stack>
                  </Card>
                ))}
              </Grid>
              
              {/* Navigation Arrows */}
              <Group
                justify="end"
                gap="sm"
                mt="lg"
              >
                <Button
                  variant="outline"
                  size="icon"
                  rounded="full"
                >
                  <Icon
                    component="span"
                    size="sm"
                    lucideIcon={ChevronLeft}
                  />
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  rounded="full"
                >
                  <Icon
                    component="span"
                    size="sm"
                    lucideIcon={ChevronRight}
                  />
                </Button>
              </Group>
              
              {/* Dots Indicator */}
              <Group
                justify="start"
                gap="xs"
                mt="lg"
              >
                {[0, 1, 2, 3, 4].map((dot, index) => (
                  <Block
                    key={dot}
                    bg={index === 0 ? "foreground" : "muted"}
                    rounded="full"
                    style={{
                      width: "8px",
                      height: "8px"
                    }}
                  />
                ))}
              </Group>
            </Block>
          </Stack>
        </Container>
      </Block>
    );
  }
);

BlogSliderSection.displayName = "BlogSliderSection";

export const blogSliderSectionTemplate = {
  id: "blogSliderSection",
  name: "Blog Slider Section",
  description: "Blog section with horizontal slider layout and navigation",
  component: BlogSliderSection,
  defaultContent: {
    tagline: "Blog",
    title: "Short heading goes here",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    viewAllText: "View all",
    posts: [
      {
        id: "1",
        title: "Blog title heading will go here",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
        author: "Full name",
        date: "11 Jan 2022",
        readTime: "5 min read",
        category: "Category",
        image: {
          src: "",
          alt: "Blog post image"
        }
      },
      {
        id: "2",
        title: "Blog title heading will go here",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
        author: "Full name",
        date: "11 Jan 2022",
        readTime: "5 min read",
        category: "Category",
        image: {
          src: "",
          alt: "Blog post image"
        }
      },
      {
        id: "3",
        title: "Blog title heading will go here",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
        author: "Full name",
        date: "11 Jan 2022",
        readTime: "5 min read",
        category: "Category",
        image: {
          src: "",
          alt: "Blog post image"
        }
      },
      {
        id: "4",
        title: "Blog title heading will go here",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
        author: "Full name",
        date: "11 Jan 2022",
        readTime: "5 min read",
        category: "Category",
        image: {
          src: "",
          alt: "Blog post image"
        }
      }
    ]
  }
}; 