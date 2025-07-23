import { forwardRef } from "react";
import {
  Block,
  Container,
  Stack,
  Group,
  Grid,
  Title,
  Text,
  Button,
  Badge,
  Card,
  Image,
  Icon
} from "@ui8kit/core";

interface BlogPostsGridSectionProps {
  content: {
    badge: string;
    title: string;
    description: string;
    buttonText: string;
    posts: Array<{
      id: string;
      title: string;
      description: string;
      author: {
        name: string;
        avatar: string;
      };
      date: string;
      readTime: string;
      image: {
        src: string;
        alt: string;
      };
      category: string;
    }>;
  };
}

export const BlogPostsGridSection = forwardRef<HTMLElement, BlogPostsGridSectionProps>(
  ({ content }, ref) => {
    return (
      <Block
        component="section"
        ref={ref}
        w="full"
        py="lg"
      >
        <Container size="lg" padding="responsive" centered>
          <Stack gap="xl">
            {/* Header */}
            <Group justify="between" align="center" responsive="sm_between">
              <Stack gap="md" size="2xl">
                <Badge variant="secondary" className="w-fit">
                  {content.badge}
                </Badge>
                
                <Title
                  order={2}
                  size="3xl"
                  fw="bold"
                >
                  {content.title}
                </Title>
                
                <Text
                  size="lg"
                  c="muted-foreground"
                >
                  {content.description}
                </Text>
              </Stack>
              
              <Button
                variant="outline"
                rightSection={
                  <Icon
                    component="span"
                    size="sm"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3' /%3e%3c/svg%3e")`,
                      backgroundSize: 'contain',
                      backgroundRepeat: 'no-repeat',
                      width: '1rem',
                      height: '1rem'
                    }}
                  />
                }
              >
                {content.buttonText}
              </Button>
            </Group>
            
            {/* Posts Grid */}
            <Grid cols="cols3" gap="lg">
              {content.posts.map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  <Block className="aspect-video relative overflow-hidden">
                    <Image
                      src={post.image.src}
                      alt={post.image.alt}
                      className="w-full h-full object-cover"
                    />
                  </Block>
                  
                  <Stack gap="md" className="p-6">
                    <Badge variant="outline" className="w-fit">
                      {post.category}
                    </Badge>
                    
                    <Title
                      order={3}
                      size="lg"
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
                    
                    <Group gap="sm" align="center">
                      <Image
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <Stack gap="xs">
                        <Text size="sm" fw="medium">
                          {post.author.name}
                        </Text>
                        <Text size="xs" c="muted-foreground">
                          {post.date} • {post.readTime}
                        </Text>
                      </Stack>
                    </Group>
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

BlogPostsGridSection.displayName = "BlogPostsGridSection";

export const blogPostsGridSectionTemplate = {
  id: "blogPostsGridSection",
  name: "Blog Posts Grid Section",
  description: "Blog section with grid layout and author information",
  component: BlogPostsGridSection,
  defaultContent: {
    badge: "Blog",
    title: "Latest from our blog",
    description: "Discover insights, tutorials, and updates from our team.",
    buttonText: "View all posts",
    posts: [
      {
        id: "post1",
        title: "Building Scalable Applications",
        description: "Learn best practices for building applications that can handle growth and scale effectively.",
        author: {
          name: "Sarah Chen",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b77c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
        },
        date: "Dec 18, 2023",
        readTime: "7 min read",
        image: {
          src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
          alt: "Scalable Applications"
        },
        category: "Development"
      },
      {
        id: "post2",
        title: "The Future of Web Development",
        description: "Exploring emerging trends and technologies that will shape the future of web development.",
        author: {
          name: "Alex Rodriguez",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
        },
        date: "Dec 16, 2023",
        readTime: "5 min read",
        image: {
          src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
          alt: "Future of Web Development"
        },
        category: "Technology"
      },
      {
        id: "post3",
        title: "Design Systems at Scale",
        description: "How to create and maintain design systems that work across large organizations.",
        author: {
          name: "Emma Thompson",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
        },
        date: "Dec 14, 2023",
        readTime: "9 min read",
        image: {
          src: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
          alt: "Design Systems"
        },
        category: "Design"
      }
    ]
  }
}; 