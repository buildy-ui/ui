import { forwardRef } from "react";
import {
  Block,
  Container,
  Stack,
  Grid,
  Title,
  Text,
  Button,
  Badge,
  Card,
  Image
} from "@ui8kit/core";

interface BlogCardsSectionProps {
  content: {
    badge: string;
    title: string;
    description: string;
    posts: Array<{
      id: string;
      title: string;
      description: string;
      author: string;
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

export const BlogCardsSection = forwardRef<HTMLElement, BlogCardsSectionProps>(
  ({ content }, ref) => {
    return (
      <Block
        component="section"
        ref={ref}
        w="full"
        py="lg"
      >
        <Container size="lg" padding="responsive" centered>
          <Stack gap="xl" align="center">
            {/* Header */}
            <Stack gap="md" align="center" ta="center" size="2xl">
              <Badge variant="secondary">
                {content.badge}
              </Badge>
              
              <Title
                order={2}
                size="3xl"
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
            
            {/* Blog Posts Grid */}
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
                    
                    <Stack gap="xs">
                      <Text size="sm" fw="medium">
                        {post.author}
                      </Text>
                      <Text size="xs" c="muted-foreground">
                        {post.date} • {post.readTime}
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

BlogCardsSection.displayName = "BlogCardsSection";

export const blogCardsSectionTemplate = {
  id: "blogCardsSection",
  name: "Blog Cards Section",
  description: "Blog section with cards layout displaying posts",
  component: BlogCardsSection,
  defaultContent: {
    badge: "Our Blog",
    title: "Latest Articles",
    description: "Stay up to date with the latest news and insights from our team.",
    posts: [
      {
        id: "post1",
        title: "Getting Started with React",
        description: "Learn the fundamentals of React and build your first application.",
        author: "John Doe",
        date: "Dec 15, 2023",
        readTime: "5 min read",
        image: {
          src: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
          alt: "React Development"
        },
        category: "Development"
      },
      {
        id: "post2",
        title: "Building Modern UIs",
        description: "Explore modern UI patterns and design principles for web applications.",
        author: "Jane Smith",
        date: "Dec 12, 2023",
        readTime: "8 min read",
        image: {
          src: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
          alt: "UI Design"
        },
        category: "Design"
      },
      {
        id: "post3",
        title: "Performance Optimization",
        description: "Tips and techniques to optimize your web application performance.",
        author: "Mike Johnson",
        date: "Dec 10, 2023",
        readTime: "6 min read",
        image: {
          src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
          alt: "Performance"
        },
        category: "Performance"
      }
    ]
  }
}; 