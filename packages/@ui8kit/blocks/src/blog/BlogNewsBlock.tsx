import { forwardRef } from "react";
import { Calendar, ArrowRight } from "lucide-react";
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
  Image,
  Icon
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
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const BlogNewsBlock = forwardRef<HTMLElement, BlogNewsBlockProps>(
  ({ content }, ref) => {
    return (
      <Block
        component="section"
        ref={ref}
        py="xl"
      >
        <Container size="xl" padding="responsive">
          <Stack gap="xl" align="center">
            {/* Header */}
            <Stack 
              gap="md" 
              align="center" 
              ta="center"
              size="2xl"
              centered
            >
              <Badge 
                variant="secondary"
              >
                News & Updates
              </Badge>
              
              <Title
                order={2}
                size="3xl"
                fw="bold"
                c="foreground"
              >
                {content.title}
              </Title>
              
              <Text
                size="lg"
                c="muted-foreground"
                ta="center"
                leading="relaxed"
              >
                {content.subtitle}
              </Text>
            </Stack>

            {/* Articles Grid */}
            <Grid
              cols={1}
              colsMd={2}
              colsLg={3}
              gap="lg"
            >
              {content.articles.map((article, index) => (
                <Card
                  key={index}
                  padding="none"
                >
                  {/* Article Image */}
                  <Box>
                    <Image
                      src={article.image}
                      alt={article.title}
                      width="100%"
                      height="auto"
                      aspect="video"
                      fit="cover"
                    />
                  </Box>
                  
                  {/* Article Content */}
                  <Card.Content padding="lg">
                    <Stack gap="sm">
                      {/* Date */}
                      <Group gap="xs" align="center">
                        <Icon 
                          component="span" 
                          size="sm"
                          display="inline"
                          lucideIcon={Calendar}
                        />
                        <Text size="sm" c="muted-foreground">
                          {formatDate(article.date)}
                        </Text>
                      </Group>
                      
                      {/* Title */}
                      <Title
                        order={3}
                        size="lg"
                        fw="semibold"
                        c="foreground"
                      >
                        {article.title}
                      </Title>
                      
                      {/* Excerpt */}
                      <Text
                        c="muted-foreground"
                        leading="relaxed"
                      >
                        {article.excerpt}
                      </Text>
                      
                      {/* Read More */}
                      <Group 
                        gap="xs" 
                        align="center"
                      >
                        <Text c="primary" fw="medium">Read more</Text>
                        <Icon 
                          component="span" 
                          size="sm"
                          display="inline"
                          animated
                          hover="translate"
                          lucideIcon={ArrowRight}
                        />
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