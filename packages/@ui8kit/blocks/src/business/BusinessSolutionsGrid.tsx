import { forwardRef } from "react";
import { Bookmark } from "lucide-react";
import {
  Block,
  Container,
  Stack,
  Grid,
  Title,
  Text,
  Badge,
  Card,
  Icon,
  Box
} from "@ui8kit/core";
import type { 
  BlockProps, 
  ContainerProps, 
  StackProps, 
  GridProps, 
  TitleProps, 
  TextProps, 
  BadgeProps, 
  CardProps, 
  IconProps, 
  BoxProps 
} from "@ui8kit/core";

interface BusinessSolutionsGridProps {
  content: {
    badge: string;
    title: string;
    description: string;
    cards: Array<{
      id: string;
      title: string;
      description: string;
      lucideIcon: any;
      colSpan?: number;
    }>;
  };
  // Core component overrides
  blockProps?: Partial<BlockProps>;
  containerProps?: Partial<ContainerProps>;
  headerStackProps?: Partial<StackProps>;
  badgeProps?: Partial<BadgeProps>;
  titleStackProps?: Partial<StackProps>;
  titleProps?: Partial<TitleProps>;
  descriptionProps?: Partial<TextProps>;
  gridProps?: Partial<GridProps>;
  cardProps?: Partial<CardProps>;
  cardStackProps?: Partial<StackProps>;
  iconBoxProps?: Partial<BoxProps>;
  iconProps?: Partial<IconProps>;
  cardTitleStackProps?: Partial<StackProps>;
  cardTitleProps?: Partial<TitleProps>;
  cardDescriptionProps?: Partial<TextProps>;
  // Custom className for each element
  blockClassName?: string;
  containerClassName?: string;
  headerStackClassName?: string;
  badgeClassName?: string;
  titleStackClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  gridClassName?: string;
  cardClassName?: string;
  cardStackClassName?: string;
  iconBoxClassName?: string;
  iconClassName?: string;
  cardTitleStackClassName?: string;
  cardTitleClassName?: string;
  cardDescriptionClassName?: string;
}

export const BusinessSolutionsGrid = forwardRef<HTMLElement, BusinessSolutionsGridProps>(
  ({ 
    content,
    blockProps = {},
    containerProps = {},
    headerStackProps = {},
    badgeProps = {},
    titleStackProps = {},
    titleProps = {},
    descriptionProps = {},
    gridProps = {},
    cardProps = {},
    cardStackProps = {},
    iconBoxProps = {},
    iconProps = {},
    cardTitleStackProps = {},
    cardTitleProps = {},
    cardDescriptionProps = {},
    blockClassName,
    containerClassName,
    headerStackClassName,
    badgeClassName,
    titleStackClassName,
    titleClassName,
    descriptionClassName,
    gridClassName,
    cardClassName,
    cardStackClassName,
    iconBoxClassName,
    iconClassName,
    cardTitleStackClassName,
    cardTitleClassName,
    cardDescriptionClassName,
  }, ref) => {
    return (
      <Block
        component="section"
        ref={ref}
        w="full"
        py="lg"
        {...blockProps}
        className={blockClassName}
      >
        <Container 
          size="lg" 
          padding="responsive" 
          centered
          {...containerProps}
          className={containerClassName}
        >
          <Stack 
            gap="2xl" 
            align="start"
            {...headerStackProps}
            className={headerStackClassName}
          >
            {/* Header */}
            <Stack 
              gap="md" 
              align="start"
              {...titleStackProps}
              className={titleStackClassName}
            >
              <Badge 
                radius="full" 
                size="sm"
                {...badgeProps}
                className={badgeClassName}
              >
                {content.badge}
              </Badge>
              
              <Stack 
                gap="sm"
                {...titleStackProps}
                className={titleStackClassName}
              >
                <Title
                  order={2}
                  size="3xl"
                  fw="bold"
                  w="2xl"
                  {...titleProps}
                  className={titleClassName}
                >
                  {content.title}
                </Title>
                
                <Text
                  size="lg"
                  c="muted-foreground"
                  w="3xl"
                  {...descriptionProps}
                  className={descriptionClassName}
                >
                  {content.description}
                </Text>
              </Stack>
            </Stack>
            
            {/* Cards Grid */}
            <Grid 
              cols="cols3" 
              gap="lg"
              {...gridProps}
              className={gridClassName}
            >
              {content.cards.map((card) => (
                <Grid.Col
                  key={card.id}
                  span={card.colSpan || 1}
                >
                  <Card 
                    variant="filled" 
                    padding="lg"
                    radius="md"
                    {...cardProps}
                    className={cardClassName}
                  >
                    <Stack 
                      gap="lg" 
                      justify="between" 
                      h="full"
                      {...cardStackProps}
                      className={cardStackClassName}
                    >
                      <Box
                        {...iconBoxProps}
                        className={iconBoxClassName}
                      >
                        <Icon
                          lucideIcon={card.lucideIcon}
                          size="lg"
                          {...iconProps}
                          className={iconClassName}
                        />
                      </Box>
                      
                      <Stack 
                        gap="xs"
                        {...cardTitleStackProps}
                        className={cardTitleStackClassName}
                      >
                        <Title
                          order={3}
                          size="xl"
                          fw="semibold"
                          {...cardTitleProps}
                          className={cardTitleClassName}
                        >
                          {card.title}
                        </Title>
                        
                        <Text
                          size="md"
                          c="muted-foreground"
                          {...cardDescriptionProps}
                          className={cardDescriptionClassName}
                        >
                          {card.description}
                        </Text>
                      </Stack>
                    </Stack>
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

BusinessSolutionsGrid.displayName = "BusinessSolutionsGrid";

export const businessSolutionsGridTemplate = {
  id: "businessSolutionsGrid",
  name: "Business Solutions Grid",
  description: "Business solutions grid with card layout",
  component: BusinessSolutionsGrid,
  defaultContent: {
    badge: "buildy/ui",
    title: "Streamline Your Business Operations",
    description: "Managing a business shouldn't be complicated. With Buildy/UI, create seamless workflows and improve efficiency effortlessly.",
    cards: [
      {
        id: "card1",
        title: "Shadcn Library Integration",
        description: "Seamlessly blend components for a cohesive and modern design aesthetic.",
        lucideIcon: Bookmark,
        colSpan: 2
      },
      {
        id: "card2",
        title: "Bookmark-Centric Design",
        description: "Deliver intuitive and engaging interfaces that resonate with your target audience.",
        lucideIcon: Bookmark
      },
      {
        id: "card3",
        title: "Strategic Branding",
        description: "Ensure consistency and elevate your brand identity across platforms.",
        lucideIcon: Bookmark
      },
      {
        id: "card4",
        title: "Open Source Excellence",
        description: "Access open source components for personal or commercial projects.",
        lucideIcon: Bookmark,
        colSpan: 2
      }
    ]
  }
}; 