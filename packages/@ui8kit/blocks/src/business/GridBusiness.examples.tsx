import { GridBusiness, type GridBusinessData } from "./GridBusiness";
import { 
  Shield, 
  Users, 
  BarChart, 
  Building,
  TrendingUp,
  Code,
  Database,
  Cloud,
  Smartphone
} from "lucide-react";

// Sample business data
const sampleBusinessCards = [
  {
    id: "1",
    title: "Advanced Analytics",
    description: "Get deep insights into your business performance with our comprehensive analytics dashboard and reporting tools.",
    lucideIcon: BarChart,
    colSpan: 2
  },
  {
    id: "2",
    title: "Cloud Infrastructure",
    description: "Scalable and secure cloud solutions that grow with your business needs.",
    lucideIcon: Cloud
  },
  {
    id: "3",
    title: "Mobile Solutions",
    description: "Native and cross-platform mobile applications for iOS and Android.",
    lucideIcon: Smartphone
  },
  {
    id: "4",
    title: "Security First",
    description: "Enterprise-grade security with end-to-end encryption and compliance standards.",
    lucideIcon: Shield,
    rowSpan: 2
  },
  {
    id: "5",
    title: "API Integration",
    description: "Seamless integration with third-party services and existing systems.",
    lucideIcon: Code
  },
  {
    id: "6",
    title: "Database Management",
    description: "Optimized database solutions for high-performance applications.",
    lucideIcon: Database
  }
];

const sampleSolutions = [
  {
    id: "1",
    title: "Enterprise Resource Planning",
    description: "Streamline your business operations with our comprehensive ERP solution that integrates all your business processes into one unified system.",
    lucideIcon: Building,
    stats: {
      value: "40%",
      label: "Efficiency Increase"
    }
  },
  {
    id: "2",
    title: "Customer Relationship Management",
    description: "Build stronger customer relationships and drive sales growth with our advanced CRM platform featuring automation and analytics.",
    lucideIcon: Users,
    image: {
      src: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "CRM Dashboard"
    }
  },
  {
    id: "3",
    title: "Business Intelligence",
    description: "Make data-driven decisions with our powerful BI tools that transform raw data into actionable business insights.",
    lucideIcon: TrendingUp,
    stats: {
      value: "60%",
      label: "Faster Decisions"
    }
  }
];

const samplePricingPlans = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for small businesses getting started",
    price: "$29",
    monthlyPrice: "$29",
    yearlyPrice: "$24",
    features: [
      "Up to 5 team members",
      "10GB storage",
      "Basic analytics",
      "Email support",
      "Mobile app access"
    ],
    buttonText: "Get Started",
    buttonVariant: "outline" as const
  },
  {
    id: "professional",
    name: "Professional",
    description: "For growing teams that need more power",
    price: "$79",
    monthlyPrice: "$79",
    yearlyPrice: "$64",
    features: [
      "Up to 25 team members",
      "100GB storage",
      "Advanced analytics",
      "Priority support",
      "API access",
      "Custom integrations"
    ],
    buttonText: "Choose Professional",
    buttonVariant: "default" as const,
    isPopular: true
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large organizations with custom needs",
    price: "$199",
    monthlyPrice: "$199",
    yearlyPrice: "$159",
    features: [
      "Unlimited team members",
      "1TB storage",
      "Custom analytics",
      "24/7 phone support",
      "Advanced API access",
      "Custom integrations",
      "Dedicated account manager"
    ],
    buttonText: "Contact Sales",
    buttonVariant: "outline" as const
  }
];

const sampleCareerOpenings = [
  {
    id: "1",
    title: "Senior Software Engineer",
    location: "San Francisco, CA",
    department: "Engineering",
    type: "Full-time",
    salary: "$120k - $180k"
  },
  {
    id: "2",
    title: "Product Manager",
    location: "New York, NY",
    department: "Product",
    type: "Full-time",
    salary: "$110k - $160k"
  },
  {
    id: "3",
    title: "UX Designer",
    location: "Remote",
    department: "Design",
    type: "Full-time",
    salary: "$90k - $130k"
  },
  {
    id: "4",
    title: "DevOps Engineer",
    location: "Austin, TX",
    department: "Engineering",
    type: "Full-time",
    salary: "$100k - $150k"
  },
  {
    id: "5",
    title: "Sales Director",
    location: "Boston, MA",
    department: "Sales",
    type: "Full-time",
    salary: "$130k - $200k"
  },
  {
    id: "6",
    title: "Marketing Manager",
    location: "Los Angeles, CA",
    department: "Marketing",
    type: "Full-time",
    salary: "$80k - $120k"
  }
];

// ===== GRID BUSINESS EXAMPLES =====

// 1. Business cards gallery
export const GridBusinessCardsGalleryExample = () => {
  const content: GridBusinessData = {
    promo: "Our Services",
    title: "Comprehensive business solutions for modern enterprises",
    description: "We provide cutting-edge technology solutions that help businesses scale, optimize operations, and achieve their strategic goals.",
    cards: sampleBusinessCards
  };

  return (
    <GridBusiness
      content={content}
      variant="cardsGallery"
      cols="1-2-3"
    />
  );
};

// 2. Solutions grid
export const GridBusinessSolutionsGridExample = () => {
  const content: GridBusinessData = {
    badge: "Solutions",
    title: "Transform your business with our proven solutions",
    description: "Our enterprise-grade solutions are designed to help you streamline operations, improve efficiency, and drive growth.",
    solutions: sampleSolutions
  };

  return (
    <GridBusiness
      content={content}
      variant="solutionsGrid"
      cols="1-2-3"
      className="bg-gradient-to-b from-primary/50 to-primary/10"
    />
  );
};

// 3. Pricing grid
export const GridBusinessPricingExample = () => {
  const content: GridBusinessData = {
    title: "Choose the perfect plan for your business",
    description: "Flexible pricing options designed to scale with your business needs. Start free and upgrade as you grow.",
    plans: samplePricingPlans
  };

  return (
    <GridBusiness
      content={content}
      variant="pricing"
      cols="1-2-3"
    />
  );
};

// 4. Pricing with yearly toggle
export const GridBusinessPricingYearExample = () => {
  const content: GridBusinessData = {
    title: "Save more with annual billing",
    description: "Get the same great features at a discounted rate when you choose annual billing. Save up to 20% on all plans.",
    plans: samplePricingPlans
  };

  return (
    <GridBusiness
      content={content}
      variant="pricingYear"
      cols="1-2-3"
      _showYearlyToggle={true}
      className="bg-gradient-to-br from-primary/5 to-secondary/5"
    />
  );
};

// 5. Career openings grid
export const GridBusinessCareerExample = () => {
  const content: GridBusinessData = {
    title: "Join our growing team",
    description: "We're always looking for talented individuals to join our mission of building innovative solutions that make a difference.",
    buttonText: "View All Openings",
    openings: sampleCareerOpenings
  };

  return (
    <GridBusiness
      content={content}
      variant="career"
      cols="1-2"
      useContainer={true}
    />
  );
};

// Export all examples
export const gridBusinessExamples = {
  cardsGallery: GridBusinessCardsGalleryExample,
  solutionsGrid: GridBusinessSolutionsGridExample,
  pricing: GridBusinessPricingExample,
  pricingYear: GridBusinessPricingYearExample,
  career: GridBusinessCareerExample
};