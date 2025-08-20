import { ArrowRight, Rocket, Zap, Users, BarChart, Globe, Check, Shield } from 'lucide-react';

export const SplitFeaturesPreset = [
{
				type: "features.splitfeatures",
				variant: "media",
				props: { content: { badge: "Features", title: "Everything you need to build modern applications", description: "Our platform provides all the tools and features you need to create, deploy, and scale your applications with confidence.", image: { src: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Modern application development" }, features: [{ id: "1", title: "Lightning Fast Performance", description: "Optimized for speed with advanced caching and CDN integration" }, { id: "2", title: "Enterprise Security", description: "Bank-level security with end-to-end encryption and compliance" }, { id: "3", title: "Scalable Infrastructure", description: "Auto-scaling infrastructure that grows with your business needs" }, { id: "4", title: "24/7 Expert Support", description: "Round-the-clock support from our team of technical experts" }], primaryButtonText: "Get Started", secondaryButtonText: "View Demo", primaryButtonIcon: Rocket, secondaryButtonIcon: ArrowRight }, useContainer: true }
			},
{
				type: "features.splitfeatures",
				variant: "features",
				props: { content: { badge: "Innovation", title: "Powerful features for modern teams", description: "Streamline your workflow with our comprehensive suite of tools designed for collaboration and productivity.", image: { src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Team collaboration" }, features: [{ id: "1", title: "Real-time Collaboration", description: "Work together seamlessly with live editing and instant updates", lucideIcon: Users }, { id: "2", title: "Advanced Analytics", description: "Get deep insights into your team's performance and productivity", lucideIcon: BarChart }, { id: "3", title: "Global Deployment", description: "Deploy your applications worldwide with our global infrastructure", lucideIcon: Globe }, { id: "4", title: "Automated Workflows", description: "Streamline repetitive tasks with intelligent automation", lucideIcon: Zap }] }, leftMedia: true, useContainer: true }
			},
{
				type: "features.splitfeatures",
				variant: "analytics",
				props: { content: { badge: "Analytics", title: "Data-driven insights for better decisions", description: "Transform your business with powerful analytics and real-time reporting that help you understand your customers and optimize performance.", features: [{ id: "1", title: "Predictive Analytics", description: "Forecast trends and make proactive business decisions" }, { id: "2", title: "Custom Dashboards", description: "Create personalized views of your most important metrics" }, { id: "3", title: "Automated Reports", description: "Schedule and deliver reports automatically to stakeholders" }] }, leftMedia: true, useContainer: false, py: "none", gap: "none", className: "min-h-[calc(100vh-64px)] overflow-hidden" }
			},
{
				type: "features.splitfeatures",
				variant: "features",
				props: { content: { badge: "Security", title: "Enterprise-grade security you can trust", description: "Protect your business with our comprehensive security suite featuring advanced threat detection, encryption, and compliance tools.", features: [{ id: "1", title: "Multi-factor Authentication", description: "Secure access with multiple verification methods", lucideIcon: Shield }, { id: "2", title: "End-to-end Encryption", description: "Your data is encrypted both in transit and at rest", lucideIcon: Shield }, { id: "3", title: "Compliance Ready", description: "Meet GDPR, HIPAA, and SOC 2 requirements out of the box", lucideIcon: Check }, { id: "4", title: "Threat Monitoring", description: "24/7 monitoring and automated threat response", lucideIcon: Shield }], primaryButtonText: "Learn More", primaryButtonIcon: ArrowRight }, leftMedia: false, useContainer: false, gap: "none", className: "bg-gradient-to-br from-primary/50 to-primary/10" }
			},
{
				type: "features.splitfeatures",
				variant: "media",
				props: { content: { badge: "Performance", title: "Blazing fast performance at scale", description: "Experience unmatched speed and reliability with our optimized infrastructure designed to handle millions of requests.", image: { src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Performance analytics dashboard" }, features: [{ id: "1", title: "99.99% Uptime SLA", description: "Guaranteed availability with industry-leading uptime" }, { id: "2", title: "Sub-100ms Response Time", description: "Lightning-fast API responses for optimal user experience" }, { id: "3", title: "Auto-scaling Infrastructure", description: "Automatically scale to handle traffic spikes" }, { id: "4", title: "Global Edge Network", description: "Serve content from the closest location to your users" }], primaryButtonText: "View Benchmarks", secondaryButtonText: "Start Free Trial", primaryButtonIcon: BarChart, secondaryButtonIcon: Rocket }, leftMedia: true, useContainer: true }
			}
];
