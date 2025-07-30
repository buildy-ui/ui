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
import { SplitFAQ, type SplitFAQData } from "./SplitFAQ";

// Sample FAQ data (reuse from GridFAQ)
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
  }
];

const sampleCategories = [
  { id: "account", name: "Account", lucideIcon: Users },
  { id: "billing", name: "Billing", lucideIcon: CreditCard },
  { id: "security", name: "Security", lucideIcon: Shield },
  { id: "technical", name: "Technical", lucideIcon: Settings },
  { id: "support", name: "Support", lucideIcon: LifeBuoy }
];

// ===== SPLIT FAQ EXAMPLES =====

// 1. FAQ with Contact Information
export const SplitFAQContactExample = () => {
  const content: SplitFAQData = {
    badge: "Support",
    title: "Need Help? We're Here for You",
    description: "Can't find the answer you're looking for? Our support team is ready to help you with any questions or issues you might have.",
    buttonText: "Contact Support",
    faqs: sampleFAQs,
    contactInfo: {
      title: "Get in Touch",
      description: "Multiple ways to reach our support team",
      email: "support@example.com",
      phone: "+1 (555) 123-4567",
      hours: "24/7 Support Available"
    }
  };

  return (
    <SplitFAQ
      content={content}
      variant="contact"
      leftMedia={false}
      py="xl"
    />
  );
};

// 2. FAQ with Search Functionality
export const SplitFAQSearchExample = () => {
  const content: SplitFAQData = {
    badge: "Help Center",
    title: "Find Answers Instantly",
    description: "Search through our comprehensive knowledge base or browse by category to find the information you need quickly and efficiently.",
    searchPlaceholder: "Search for help topics...",
    categories: sampleCategories,
    faqs: sampleFAQs,
    stats: {
      totalQuestions: "500+",
      avgResponseTime: "< 2 hours",
      satisfactionRate: "98%"
    }
  };

  return (
    <SplitFAQ
      content={content}
      variant="search"
      leftMedia={true}
      py="xl"
    />
  );
};

// 3. FAQ with Category Navigation
export const SplitFAQCategoriesExample = () => {
  const content: SplitFAQData = {
    badge: "Help Topics",
    title: "Browse Help by Category",
    description: "Explore our organized help sections to find exactly what you're looking for. Each category contains detailed guides and answers.",
    buttonText: "View All Categories",
    categories: sampleCategories,
    faqs: sampleFAQs
  };

  return (
    <SplitFAQ
      content={content}
      variant="categories"
      leftMedia={false}
      py="xl"
    />
  );
};

// 4. Support Center FAQ
export const SplitFAQSupportExample = () => {
  const content: SplitFAQData = {
    badge: "Support Center",
    title: "Comprehensive Support Hub",
    description: "Access our full range of support services including live chat, email support, and phone assistance. We're committed to helping you succeed.",
    buttonText: "Start Live Chat",
    faqs: sampleFAQs,
    stats: {
      totalQuestions: "1000+",
      avgResponseTime: "30 mins",
      satisfactionRate: "99.2%"
    }
  };

  return (
    <SplitFAQ
      content={content}
      variant="support"
      leftMedia={true}
      py="xl"
    />
  );
};

// 5. FAQ with Accordion
export const SplitFAQAccordionExample = () => {
  const content: SplitFAQData = {
    badge: "Quick Answers",
    title: "Most Common Questions",
    description: "Here are the answers to the questions we get asked most frequently. Click on any question to expand the full answer.",
    buttonText: "View All FAQ",
    faqs: sampleFAQs
  };

  return (
    <SplitFAQ
      content={content}
      variant="accordion"
      leftMedia={false}
      py="xl"
    />
  );
};

// Export all examples
export const splitFAQExamples = {
  contact: SplitFAQContactExample,
  search: SplitFAQSearchExample,
  categories: SplitFAQCategoriesExample,
  support: SplitFAQSupportExample,
  accordion: SplitFAQAccordionExample
};