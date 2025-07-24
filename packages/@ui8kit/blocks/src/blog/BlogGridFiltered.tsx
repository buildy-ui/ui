import { forwardRef, useState } from "react";
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
  Image
} from "@ui8kit/core";

interface BlogGridFilteredProps {
  content: {
    tagline: string;
    title: string;
    description: string;
    categories: Array<{
      id: string;
      name: string;
    }>;
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
      categoryId: string;
    }>;
  };
}

export const BlogGridFiltered = forwardRef<HTMLElement, BlogGridFilteredProps>(
  ({ content }, ref) => {
    const [activeCategory, setActiveCategory] = useState("all");
    
    const filteredPosts = activeCategory === "all" 
      ? content.posts 
      : content.posts.filter(post => post.categoryId === activeCategory);

    return (
      <Block
        component="section"
        ref={ref}
        w="full"
        py="lg"
        bg="background"
      >
        <Container size="lg" padding="responsive" centered>
          <Stack gap="3xl" align="center">
            {/* Header */}
            <Stack gap="lg" align="center" ta="center">
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
                ta="center"
              >
                {content.title}
              </Title>
              
              <Text
                size="md"
                c="muted-foreground"
                ta="center"
              >
                {content.description}
              </Text>
            </Stack>
            
            {/* Category Filters */}
            <Group
              justify="center"
              gap="sm"
              wrap="wrap"
            >
              <Button
                variant={activeCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory("all")}
              >
                View all
              </Button>
              
              {content.categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </Group>
            
            {/* Blog Posts Grid */}
            <Grid
              cols={1}
              colsMd={2}
              gap="lg"
              w="full"
            >
              {filteredPosts.slice(0, 4).map((post) => (
                <Group
                  key={post.id}
                  gap="lg"
                  align="start"
                >
                  {/* Image */}
                  <Block
                    bg="muted"
                    rounded="md"
                    style={{
                      width: "200px",
                      aspectRatio: "4/3",
                      flexShrink: 0
                    }}
                  >
                    {post.image?.src ? (
                      <Image
                        src={post.image.src}
                        alt={post.image.alt}
                        fit="cover"
                        radius="md"
                        width="200px"
                        style={{ aspectRatio: "4/3" }}
                      />
                    ) : (
                      <Block
                        w="full"
                        h="full"
                        display="flex"
                        bg="muted"
                        rounded="md"
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                          aspectRatio: "4/3"
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
                  <Stack gap="md" style={{ flex: 1 }}>
                    <Text
                      size="sm"
                      c="muted-foreground"
                      fw="medium"
                    >
                      {post.category}
                    </Text>
                    
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
                </Group>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Block>
    );
  }
);

BlogGridFiltered.displayName = "BlogGridFiltered";

export const blogGridFilteredTemplate = {
  id: "blogGridFiltered",
  name: "Blog Grid Filtered",
  description: "Blog section with centered layout, category filters and 2x2 grid",
  component: BlogGridFiltered,
  defaultContent: {
    tagline: "Blog",
    title: "Short heading goes here",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    categories: [
      { id: "category1", name: "Category one" },
      { id: "category2", name: "Category two" },
      { id: "category3", name: "Category three" },
      { id: "category4", name: "Category four" }
    ],
    posts: [
      {
        id: "1",
        title: "Blog title heading will go here",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim...",
        author: "Full name",
        date: "11 Jan 2022",
        readTime: "5 min read",
        category: "Category",
        categoryId: "category1",
        image: {
          src: "",
          alt: "Blog post image"
        }
      },
      {
        id: "2",
        title: "Blog title heading will go here",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim...",
        author: "Full name",
        date: "11 Jan 2022",
        readTime: "5 min read",
        category: "Category",
        categoryId: "category2",
        image: {
          src: "",
          alt: "Blog post image"
        }
      },
      {
        id: "3",
        title: "Blog title heading will go here",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim...",
        author: "Full name",
        date: "11 Jan 2022",
        readTime: "5 min read",
        category: "Category",
        categoryId: "category3",
        image: {
          src: "",
          alt: "Blog post image"
        }
      },
      {
        id: "4",
        title: "Blog title heading will go here",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim...",
        author: "Full name",
        date: "11 Jan 2022",
        readTime: "5 min read",
        category: "Category",
        categoryId: "category4",
        image: {
          src: "",
          alt: "Blog post image"
        }
      }
    ]
  }
}; 