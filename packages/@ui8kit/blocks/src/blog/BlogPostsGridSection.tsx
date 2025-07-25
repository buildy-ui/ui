import { forwardRef } from "react";
import { ArrowRight } from "lucide-react";
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
  Icon,
  Box
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
                <Box width="fit">
                  <Badge variant="secondary">
                    {content.badge}
                  </Badge>
                </Box>
                
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
                      lucideIcon={ArrowRight}
                    />
                  }
              >
                {content.buttonText}
              </Button>
            </Group>
            
            {/* Posts Grid */}
                         <Grid cols="cols3" gap="lg">
               {content.posts.map((post) => (
                 <Card key={post.id} padding="none" radius="lg">
                   <Box>
                     <Image
                       src={post.image.src}
                       alt={post.image.alt}
                       radius="t_lg"
                       width="100%"
                       height="auto"
                       aspect="video"
                     />
                   </Box>
                   
                   <Card.Content>
                     <Stack gap="md">
                       <Box width="fit">
                         <Badge variant="outline">
                           {post.category}
                         </Badge>
                       </Box>
                       
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
                         <Box size="2xl" bg="primary" rounded="full" overflow="hidden">
                           <Image
                             src={post.author.avatar}
                             alt={post.author.name}
                             fit="full"
                           />
                         </Box>
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
                   </Card.Content>
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
          name: "Timothy Chen",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
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