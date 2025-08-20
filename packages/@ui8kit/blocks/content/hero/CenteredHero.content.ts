import { Rocket, Play, Info, ArrowRight, Heart } from 'lucide-react';

export default [
{
				type: "hero.centered",
				variant: "simple",
				props: { content: { badge: "Welcome", title: "The future of work is here", description: "Transform the way your team collaborates with our innovative platform. Built for modern teams who demand flexibility, security, and performance.", primaryButtonText: "Get Started Free", secondaryButtonText: "Watch Demo", primaryButtonIcon: Rocket, secondaryButtonIcon: Play }, useContainer: true, className: "relative z-10" }
			},
{
				type: "hero.centered",
				variant: "withTopButton",
				props: { content: { topButton: { text: "✨ New: AI-powered automation is here", href: "#" }, badge: "AI Innovation", title: "Automate your workflow with intelligent AI", description: "Discover how artificial intelligence can streamline your processes, reduce manual work, and help your team focus on what matters most.", primaryButtonText: "Try AI Features", secondaryButtonText: "Learn More", primaryButtonIcon: Info, secondaryButtonIcon: Rocket }, useContainer: true }
			},
{
				type: "hero.centered",
				variant: "withImage",
				props: { content: { title: "Experience the power of visual storytelling", description: "Create compelling narratives that resonate with your audience. Our platform provides all the tools you need to craft beautiful, engaging content that drives results.", imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", imageAlt: "Visual storytelling dashboard", primaryButtonText: "Start Creating", secondaryButtonText: "Watch Tutorial" }, useContainer: true, "data-class": "centered-hero-content", className: "relative z-10" }
			},
{
				type: "hero.centered",
				variant: "withStats",
				props: { content: { badge: "Trusted Globally", title: "Join millions who trust our platform", description: "Our growing community of users worldwide relies on our platform to achieve their goals. See why businesses of all sizes choose us as their trusted partner.", stats: [{ id: "1", value: "2M+", label: "Active Users" }, { id: "2", value: "150+", label: "Countries" }, { id: "3", value: "99.9%", label: "Uptime" }, { id: "4", value: "24/7", label: "Support" }], primaryButtonText: "Join Community", secondaryButtonText: "View Testimonials", primaryButtonIcon: ArrowRight }, useContainer: true }
			},
{
				type: "hero.centered",
				variant: "withStats",
				props: { content: { badge: "Our Mission", title: "Building technology that brings people together", description: "We believe technology should connect us, not divide us. Our mission is to create tools that foster collaboration, understanding, and positive change in the world.", stats: [{ id: "1", value: "50M+", label: "Connections Made" }, { id: "2", value: "195", label: "Countries Reached" }, { id: "3", value: "1B+", label: "Messages Sent" }], primaryButtonText: "Join Our Mission", secondaryButtonText: "Read Our Story", primaryButtonIcon: Heart }, useContainer: true, className: "bg-gradient-to-t from-primary/10 to-secondary/15" }
			}
];
