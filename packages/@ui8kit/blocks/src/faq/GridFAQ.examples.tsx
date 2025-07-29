import { 
  HelpCircle,
  MessageSquare,
  Shield,
  Zap,
  Users,
  Settings,
  FileText,
  CreditCard,
  Smartphone,
  Globe,
  Lock,
  LifeBuoy
} from "lucide-react";
import { GridFAQ, type GridFAQData } from "./GridFAQ";

// Sample FAQ data
const sampleFAQs = [
  {
    id: "1",
    question: "How do I create an account?",
    answer: "Creating an account is simple! Click the 'Sign Up' button in the top right corner, fill in your email address and choose a secure password. You'll receive a confirmation email to verify your account.",
    category: "Account",
    lucideIcon: Users,
    priority: "high" as const
  },
  {
    id: "2",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers. All payments are processed securely through our encrypted payment system.",
    category: "Billing",
    lucideIcon: CreditCard,
    priority: "high" as const
  },
  {
    id: "3",
    question: "How secure is my data?",
    answer: "Your data security is our top priority. We use industry-standard encryption, regular security audits, and comply with GDPR and SOC 2 standards. Your personal information is never shared with third parties without your consent.",
    category: "Security",
    lucideIcon: Shield,
    priority: "high" as const
  },
  {
    id: "4",
    question: "Can I use the service on mobile devices?",
    answer: "Yes! Our platform is fully responsive and works seamlessly on all devices including smartphones, tablets, and desktop computers. We also offer native mobile apps for iOS and Android.",
    category: "Technical",
    lucideIcon: Smartphone,
    priority: "medium" as const
  },
  {
    id: "5",
    question: "How do I reset my password?",
    answer: "To reset your password, click 'Forgot Password' on the login page, enter your email address, and we'll send you a secure reset link. Follow the instructions in the email to create a new password.",
    category: "Account",
    lucideIcon: Lock,
    priority: "high" as const
  },
  {
    id: "6",
    question: "What are your support hours?",
    answer: "Our support team is available 24/7 through live chat and email. Phone support is available Monday-Friday 9AM-6PM EST. We typically respond to all inquiries within 2 hours.",
    category: "Support",
    lucideIcon: LifeBuoy,
    priority: "medium" as const
  },
  {
    id: "7",
    question: "How do I upgrade my plan?",
    answer: "You can upgrade your plan anytime from your account settings. Go to 'Billing & Plans', select your desired plan, and confirm the upgrade. Changes take effect immediately.",
    category: "Billing",
    lucideIcon: Zap,
    priority: "medium" as const
  },
  {
    id: "8",
    question: "Can I integrate with other tools?",
    answer: "Yes! We offer integrations with over 100 popular tools including Slack, Zapier, Google Workspace, Microsoft 365, Salesforce, and many more. Check our integrations page for the full list.",
    category: "Technical",
    lucideIcon: Globe,
    priority: "medium" as const
  },
  {
    id: "9",
    question: "How do I export my data?",
    answer: "You can export your data anytime from the Settings page. Choose from various formats including CSV, JSON, or PDF. Premium users get additional export options and automated backups.",
    category: "Technical",
    lucideIcon: FileText,
    priority: "low" as const
  },
  {
    id: "10",
    question: "What happens if I cancel my subscription?",
    answer: "If you cancel, you'll retain access until the end of your current billing period. Your data is preserved for 30 days after cancellation, giving you time to export or reactivate your account.",
    category: "Billing",
    lucideIcon: Settings,
    priority: "medium" as const
  }
];

const sampleCategories = [
  { id: "account", name: "Account", lucideIcon: Users },
  { id: "billing", name: "Billing", lucideIcon: CreditCard },
  { id: "security", name: "Security", lucideIcon: Shield },
  { id: "technical", name: "Technical", lucideIcon: Settings },
  { id: "support", name: "Support", lucideIcon: LifeBuoy }
];

// ===== GRID FAQ EXAMPLES =====

// 1. FAQ Cards Grid
export const GridFAQCardsExample = () => {
  const content: GridFAQData = {
    badge: "Help Center",
    title: "Frequently Asked Questions",
    description: "Find answers to the most common questions about our platform, features, and services.",
    faqs: sampleFAQs
  };

  return (
    <GridFAQ
      content={content}
      variant="cards"
      cols="1-2-3"
      gap="lg"
      py="xl"
    />
  );
};

// 2. FAQ Accordion List
export const GridFAQAccordionExample = () => {
  const content: GridFAQData = {
    badge: "Support",
    title: "Common Questions & Answers",
    description: "Browse through our comprehensive FAQ to find quick solutions to your questions.",
    buttonText: "Contact Support",
    faqs: sampleFAQs
  };

  return (
    <GridFAQ
      content={content}
      variant="accordion"
      cols="1"
      gap="md"
      py="lg"
    />
  );
};

// 3. Categorized FAQ Grid
export const GridFAQCategoriesExample = () => {
  const content: GridFAQData = {
    badge: "Help Topics",
    title: "Browse by Category",
    description: "Find answers organized by topic. Each category contains the most relevant questions for that area.",
    categories: sampleCategories,
    faqs: sampleFAQs
  };

  return (
    <GridFAQ
      content={content}
      variant="categories"
      cols="1-2-4"
      gap="sm"
      py="xl"
    />
  );
};

// 4. Compact FAQ List
export const GridFAQCompactExample = () => {
  const content: GridFAQData = {
    badge: "Quick Help",
    title: "Essential Information",
    description: "Quick answers to the most important questions. Perfect for getting started or finding basic information.",
    faqs: sampleFAQs.slice(0, 6)
  };

  return (
    <GridFAQ
      content={content}
      variant="compact"
      cols="1"
      gap="sm"
      py="lg"
      useContainer={true}
    />
  );
};

// 5. Support Center FAQ
export const GridFAQSupportExample = () => {
  const content: GridFAQData = {
    badge: "Support Center",
    title: "We're Here to Help",
    description: "Comprehensive support resources to help you get the most out of our platform. Can't find what you're looking for? Contact our support team.",
    buttonText: "Contact Support Team",
    faqs: sampleFAQs,
    contactInfo: {
      title: "Need More Help?",
      description: "Our support team is ready to assist you",
      email: "support@example.com",
      phone: "+1 (555) 123-4567"
    }
  };

  return (
    <GridFAQ
      content={content}
      variant="support"
      cols="1-2-3"
      gap="xl"
      py="2xl"
      className="bg-gradient-to-b from-muted/30 to-background"
    />
  );
};

// Export all examples
export const gridFAQExamples = {
  cards: GridFAQCardsExample,
  accordion: GridFAQAccordionExample,
  categories: GridFAQCategoriesExample,
  compact: GridFAQCompactExample,
  support: GridFAQSupportExample
};