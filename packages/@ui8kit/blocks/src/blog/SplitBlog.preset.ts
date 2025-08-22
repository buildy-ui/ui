// Sample blog posts data (reuse from GridBlog examples)
const samplePosts = [
  {
    id: "1",
    title: "The Future of Web Development: AI-Powered Tools",
    description: "Explore how artificial intelligence is revolutionizing the way we build web applications, from code generation to automated testing and optimization.",
    author: {
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612c5f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    date: "Mar 15, 2024",
    readTime: "8 min read",
    image: {
      src: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "AI development tools"
    },
    category: "AI & Development",
    categoryId: "ai"
  },
  {
    id: "2",
    title: "Building Accessible Web Applications in 2024",
    description: "A comprehensive guide to creating inclusive web experiences that work for everyone, covering WCAG guidelines and modern accessibility practices.",
    author: {
      name: "Michael Rodriguez",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    date: "Mar 12, 2024",
    readTime: "12 min read",
    image: {
      src: "https://images.unsplash.com/photo-1559028006-448665bd7c7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Accessibility in web design"
    },
    category: "Accessibility",
    categoryId: "accessibility"
  },
  {
    id: "3",
    title: "Performance Optimization Techniques for Modern React Apps",
    description: "Learn advanced techniques to optimize React applications for better performance, including code splitting, lazy loading, and memory management.",
    author: {
      name: "Emma Thompson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    date: "Mar 10, 2024",
    readTime: "6 min read",
    image: {
      src: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "React performance optimization"
    },
    category: "React",
    categoryId: "react"
  },
  {
    id: "4",
    title: "Microservices Architecture: Best Practices and Pitfalls",
    description: "Understand when and how to implement microservices architecture, including common challenges and proven solutions for scalable systems.",
    author: {
      name: "David Park",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    date: "Mar 8, 2024",
    readTime: "10 min read",
    image: {
      src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Microservices architecture"
    },
    category: "Architecture",
    categoryId: "architecture"
  },
  {
    id: "5",
    title: "Cybersecurity Best Practices for Web Developers",
    description: "Essential security practices every web developer should know to protect applications from common vulnerabilities and attacks.",
    author: {
      name: "Lisa Johnson",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    date: "Mar 5, 2024",
    readTime: "7 min read",
    image: {
      src: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Cybersecurity"
    },
    category: "Security",
    categoryId: "security"
  }
];

const featuredPost = {
	id: "featured",
	title: "The Complete Guide to Modern JavaScript Frameworks",
	description: "An in-depth comparison of React, Vue, Angular, and Svelte, helping you choose the right framework for your next project based on performance, learning curve, and ecosystem.",
	author: {
		name: "Alex Kim",
		avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
	},
	date: "Mar 18, 2024",
	readTime: "15 min read",
	image: {
		src: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
		alt: "JavaScript frameworks comparison"
	},
	category: "JavaScript",
	categoryId: "javascript"
};

export const SplitBlogPreset = [
{
				type: "blog.split",
				variant: "news",
				props: { content: { badge: "Tech News", title: "Latest in Technology", subtitle: "Stay informed with the latest developments", description: "Get the most recent updates, insights, and analysis from the world of technology and software development.", posts: samplePosts }, leftMedia: false, useContainer: true }
			},
{
				type: "blog.split",
				variant: "slider",
				props: { content: { tagline: "Featured Articles", title: "Trending posts this week", description: "Discover the most popular and engaging articles from our community of expert developers and designers.", viewAllText: "View All Articles", posts: samplePosts }, leftMedia: true, useContainer: true }
			},
{
				type: "blog.split",
				variant: "featured",
				props: { content: { badge: "Editor's Choice", title: "Must-read article of the month", description: "Our editorial team has selected this comprehensive guide as essential reading for all web developers.", posts: samplePosts, featuredPost: featuredPost }, leftMedia: true, useContainer: true, className: "bg-gradient-to-r from-primary/10 to-secondary/10" }
			},
{
				type: "blog.split",
				variant: "newsletter",
				props: { content: { badge: "Weekly Digest", title: "Subscribe to our developer newsletter", description: "Get the best articles, tutorials, and industry insights delivered directly to your inbox every week. Join thousands of developers who trust our curated content.", posts: samplePosts }, leftMedia: false, useContainer: true, className: "bg-gradient-to-br from-primary/5 to-secondary/5" }
			},
{
				type: "blog.split",
				variant: "timeline",
				props: { content: { badge: "Development Journey", title: "Our latest project milestones", description: "Follow our development journey as we build and iterate on new features, sharing insights and lessons learned along the way.", viewAllText: "View Full Timeline", posts: [ ...samplePosts, { date: "Week 4 - Mar 15", title: "Launch: AI-Powered Code Completion", description: "Successfully launched our new AI-powered code completion feature, reducing development time by 40%." }, { date: "Week 3 - Mar 8", title: "Beta Testing: Advanced Analytics Dashboard", description: "Started beta testing with 100+ developers. Initial feedback shows 95% satisfaction rate." }, { date: "Week 2 - Mar 1", title: "Research: Developer Workflow Optimization", description: "Completed comprehensive research on developer workflows, identifying key pain points and opportunities." }, { date: "Week 1 - Feb 22", title: "Planning: Q2 Feature Roadmap", description: "Finalized our Q2 roadmap based on user feedback and market research, prioritizing performance improvements." }] }, leftMedia: true, useContainer: true }
			}
];
