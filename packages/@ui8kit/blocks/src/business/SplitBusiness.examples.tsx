import { SplitBusiness, type SplitBusinessData } from "./SplitBusiness";
import { 
  Users, 
  Target, 
  Award, 
  Building, 
  BarChart, 
  Globe,
  Zap,
  Shield,
  Rocket,
  Clock,
  DollarSign
} from "lucide-react";

// Sample business data
const sampleMetrics = [
  {
    id: "1",
    value: "500+",
    label: "Enterprise Clients",
    change: "+25%",
    lucideIcon: Building
  },
  {
    id: "2",
    value: "99.9%",
    label: "Uptime Guarantee",
    change: "Improved",
    lucideIcon: Shield
  },
  {
    id: "3",
    value: "24/7",
    label: "Support Available",
    lucideIcon: Clock
  },
  {
    id: "4",
    value: "$2.5M",
    label: "Cost Savings Generated",
    change: "+40%",
    lucideIcon: DollarSign
  }
];

const sampleFeatures = [
  {
    id: "1",
    title: "Advanced Analytics",
    description: "Get deep insights into your business performance with real-time analytics and comprehensive reporting dashboards.",
    lucideIcon: BarChart
  },
  {
    id: "2",
    title: "Scalable Infrastructure",
    description: "Our cloud-native architecture scales automatically with your business needs, ensuring optimal performance at all times.",
    lucideIcon: Rocket
  },
  {
    id: "3",
    title: "Enterprise Security",
    description: "Bank-level security with end-to-end encryption, compliance certifications, and advanced threat protection.",
    lucideIcon: Shield
  },
  {
    id: "4",
    title: "Global Reach",
    description: "Serve customers worldwide with our global infrastructure and multi-region deployment capabilities.",
    lucideIcon: Globe
  }
];

const sampleTestimonials = [
  {
    id: "1",
    quote: "This platform has transformed how we manage our business operations. The efficiency gains have been remarkable, and our team productivity has increased by 40%.",
    author: {
      name: "Sarah Johnson",
      role: "CEO",
      company: "TechCorp Solutions",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612c5f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    rating: 5
  }
];

const sampleCompanyValues = [
  {
    id: "1",
    title: "Innovation First",
    description: "We constantly push the boundaries of what's possible",
    lucideIcon: Zap
  },
  {
    id: "2",
    title: "Customer Success",
    description: "Your success is our primary measure of achievement",
    lucideIcon: Target
  },
  {
    id: "3",
    title: "Quality Excellence",
    description: "We deliver nothing but the highest quality solutions",
    lucideIcon: Award
  },
  {
    id: "4",
    title: "Team Collaboration",
    description: "Together we achieve more than we ever could alone",
    lucideIcon: Users
  }
];

// ===== SPLIT BUSINESS EXAMPLES =====

// 1. Business solutions split
export const SplitBusinessSolutionsExample = () => {
  const content: SplitBusinessData = {
    badge: "Enterprise Solutions",
    title: "Accelerate your business growth with our proven solutions",
    description: "We help enterprises streamline operations, reduce costs, and drive innovation through cutting-edge technology solutions tailored to your specific needs.",
    buttonText: "Schedule Demo",
    secondaryButtonText: "View Case Studies",
    metrics: sampleMetrics,
    image: {
      src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Business analytics dashboard"
    }
  };

  return (
    <SplitBusiness
      content={content}
      variant="solutions"
      leftMedia={false}
      useContainer={true}
      py="xl"
      gap="xl"
    />
  );
};

// 2. Business metrics split
export const SplitBusinessMetricsExample = () => {
  const content: SplitBusinessData = {
    badge: "Proven Results",
    title: "Delivering measurable business impact",
    subtitle: "Trusted by industry leaders worldwide",
    description: "Our track record speaks for itself. We've helped hundreds of companies achieve their goals through innovative solutions and dedicated support.",
    buttonText: "View Our Results",
    stats: {
      clients: "500+",
      projects: "1,200+",
      satisfaction: "99.5%",
      years: "15+"
    }
  };

  return (
    <SplitBusiness
      content={content}
      variant="metrics"
      leftMedia={true}
      useContainer={true}
      py="xl"
      gap="lg"
      className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-950"
    />
  );
};

// 3. Business testimonial split
export const SplitBusinessTestimonialExample = () => {
  const content: SplitBusinessData = {
    badge: "Customer Success",
    title: "What our clients say about us",
    description: "Don't just take our word for it. Hear from the business leaders who have transformed their operations with our solutions.",
    buttonText: "Read More Reviews",
    testimonials: sampleTestimonials,
    image: {
      src: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Happy business team"
    }
  };

  return (
    <SplitBusiness
      content={content}
      variant="testimonial"
      leftMedia={false}
      useContainer={false}
      py="xl"
      gap="none"
      className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950"
    />
  );
};

// 4. Business features split
export const SplitBusinessFeaturesExample = () => {
  const content: SplitBusinessData = {
    badge: "Platform Features",
    title: "Everything you need to succeed in one platform",
    description: "Our comprehensive business platform provides all the tools and features you need to manage, grow, and scale your operations effectively.",
    buttonText: "Start Free Trial",
    secondaryButtonText: "View All Features",
    features: sampleFeatures
  };

  return (
    <SplitBusiness
      content={content}
      variant="features"
      leftMedia={true}
      useContainer={true}
      py="xl"
      gap="xl"
    />
  );
};

// 5. About business split
export const SplitBusinessAboutExample = () => {
  const content: SplitBusinessData = {
    badge: "Our Story",
    title: "Building the future of business technology",
    subtitle: "Since 2008, we've been at the forefront of innovation",
    description: "We started with a simple mission: to help businesses leverage technology to achieve their full potential. Today, we're proud to serve over 500 companies worldwide with our cutting-edge solutions and unwavering commitment to excellence.",
    buttonText: "Join Our Team",
    secondaryButtonText: "Learn More",
    cards: sampleCompanyValues,
    image: {
      src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Our team at work"
    }
  };

  return (
    <SplitBusiness
      content={content}
      variant="about"
      leftMedia={false}
      useContainer={true}
      py="xl"
      gap="lg"
    />
  );
};

// Export all examples
export const splitBusinessExamples = {
  solutions: SplitBusinessSolutionsExample,
  metrics: SplitBusinessMetricsExample,
  testimonial: SplitBusinessTestimonialExample,
  features: SplitBusinessFeaturesExample,
  about: SplitBusinessAboutExample
};