import { forwardRef } from "react";
import { 
  Box,
  Block, 
  Container, 
  Stack, 
  Group, 
  Grid,
  Title, 
  Text, 
  Badge,
  Card,
  Image
} from "@ui8kit/core";

interface Article {
  title: string;
  excerpt: string;
  image: string;
  date: string;
  readTime: string;
}

interface BlogNewsBlockProps {
  content: {
    title: string;
    subtitle: string;
    articles: Article[];
  };
  className?: string;
}

export const BlogNewsBlock = forwardRef<HTMLElement, BlogNewsBlockProps>(
  ({ content, className, ...props }, ref) => {
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    return (
      <Block
        ref={ref}
        variant="section"
        className="py-20 px-6 bg-background"
        data-class="blog-news-block"
        {...props}
      >
        <Container size="xl" padding="responsive">
          <Stack gap="xl" align="center">
            {/* Header */}
            <Stack gap="md" align="center" className="text-center max-w-2xl mx-auto">
              <Badge 
                variant="secondary"
                className="mb-4 px-4 py-2 text-sm"
              >
                News & Updates
              </Badge>
              
              <Title
                order={2}
                size="3xl"
                fw="bold"
                c="foreground"
                className="text-3xl md:text-5xl"
              >
                {content.title}
              </Title>
              
              <Text
                size="xl"
                c="muted-foreground"
                ta="center"
                className="leading-relaxed"
              >
                {content.subtitle}
              </Text>
            </Stack>

            {/* Articles Grid */}
            <Grid cols={2} gap="lg" align="stretch" className="w-full" data-class="blog-articles-grid">
              {content.articles.map((article: Article, index: number) => (
                <Grid.Col key={index} span={1}>
                  <Card 
                    padding="none"
                    className="group overflow-hidden hover:shadow-lg transition-all duration-300 border border-border bg-card hover:scale-105 rounded-lg cursor-pointer"
                    data-class="blog-article-card"
                  >
                    {/* Article Image */}
                    <Box className="aspect-video overflow-hidden rounded-t-lg" data-class="blog-article-image-wrapper">
                      <Image 
                        src={article.image} 
                        alt={article.title}
                        width={400}
                        height={300}
                        fit="cover"
                        className="w-full h-auto group-hover:scale-110 transition-transform duration-500"
                      />
                    </Box>
                    
                    {/* Article Content */}
                    <Card.Content padding="lg" data-class="blog-article-content">
                      <Stack gap="sm">
                        {/* Date */}
                        <Group gap="xs" align="center">
                          <Box 
                            component="span" 
                            className="inline-block w-4 h-4"
                            style={{ 
                              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5' /%3e%3c/svg%3e")`,
                              backgroundSize: 'contain',
                              backgroundRepeat: 'no-repeat'
                            }}
                          />
                          <Text size="sm" c="muted-foreground">
                            {formatDate(article.date)}
                          </Text>
                        </Group>
                        
                        {/* Title */}
                        <Title
                          order={3}
                          size="xl"
                          fw="semibold"
                          c="card-foreground"
                          className="group-hover:text-primary transition-colors"
                        >
                          {article.title}
                        </Title>
                        
                        {/* Excerpt */}
                        <Text
                          c="muted-foreground"
                          className="leading-relaxed"
                        >
                          {article.excerpt}
                        </Text>
                        
                        {/* Read More */}
                        <Group 
                          gap="xs" 
                          align="center"
                          className="text-primary font-medium group-hover:gap-3 transition-all"
                        >
                          <Text c="primary" fw="medium">Read more</Text>
                          <Box 
                            component="span" 
                            className="inline-block w-4 h-4 group-hover:translate-x-1 transition-transform"
                            style={{ 
                              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3' /%3e%3c/svg%3e")`,
                              backgroundSize: 'contain',
                              backgroundRepeat: 'no-repeat'
                            }}
                          />
                        </Group>
                      </Stack>
                    </Card.Content>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Block>
    );
  }
);

BlogNewsBlock.displayName = "BlogNewsBlock";

export const blogNewsBlockTemplate = {
  id: "blogNewsBlock",
  name: "News & Updates",
  description: "Latest news and blog posts",
  component: BlogNewsBlock,
  defaultContent: {
    title: "Latest News",
    subtitle: "Stay updated with our latest announcements",
    articles: [
      {
        title: "New Features Released",
        excerpt: "We've added amazing new capabilities to help you build better.",
        date: "2025-01-15",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300&q=80"
      },
      {
        title: "Performance Updates",
        excerpt: "Experience faster loading times and smoother interactions.",
        date: "2025-01-10",
        readTime: "3 min read",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300&q=80"
      }
    ]
  }
}; 