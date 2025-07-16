import { useState } from 'react'
import { HeroBlock } from '@ui8kit/blocks/hero'
import { BlogNewsBlock } from '@ui8kit/blocks/blog'
import { FeaturesSplitMedia } from '@ui8kit/blocks/features'

function App() {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      {/* Header with theme toggle */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <span className="hidden font-bold sm:inline-block">
              @ui8kit/blocks Demo
            </span>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <nav className="flex items-center">
              <button
                onClick={toggleDarkMode}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4"
              >
                {darkMode ? '☀️' : '🌙'}
                <span className="sr-only">Toggle theme</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main>
        {/* Hero Block */}
        <HeroBlock 
          content={{
            title: "Welcome to @ui8kit",
            subtitle: "Build beautiful interfaces with our component library",
            buttonText: "Get Started",
            backgroundImage: "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"
          }}
        />

        {/* Blog News Block */}
        <section className="py-16">
          <BlogNewsBlock 
            content={{
              title: "Latest Updates",
              subtitle: "Stay up to date with the latest news and updates from our component library.",
              articles: [
                {
                  title: 'Component Library v2.0 Released',
                  excerpt: 'We are excited to announce the release of version 2.0 with new components and improvements.',
                  image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop',
                  date: '2024-01-15',
                  readTime: '5 min read'
                },
                {
                  title: 'New Dark Mode Support',
                  excerpt: 'Enhanced dark mode support with better color schemes and improved accessibility.',
                  image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
                  date: '2024-01-10',
                  readTime: '3 min read'
                },
                {
                  title: 'Performance Improvements',
                  excerpt: 'Significant performance improvements and bundle size reduction in the latest update.',
                  image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop',
                  date: '2024-01-05',
                  readTime: '4 min read'
                }
              ]
            }}
          />
        </section>

        {/* Features Split Media */}
        <FeaturesSplitMedia 
          content={{
            badge: "Features",
            title: "Why Choose @ui8kit?",
            description: "Our component library provides everything you need to build modern web applications.",
            features: [
              {
                title: "Modern Design",
                description: "Built with the latest design trends and best practices for modern web applications."
              },
              {
                title: "Easy to Use",
                description: "Simple API and comprehensive documentation make it easy to get started quickly."
              },
              {
                title: "Type Safe",
                description: "Built with TypeScript for better developer experience and fewer runtime errors."
              },
              {
                title: "Customizable",
                description: "Highly customizable components that adapt to your design system and brand."
              }
            ]
          }}
        />
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container py-8 md:py-12">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
              <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                Built by the @ui8kit team. The source code is available on{" "}
                <a
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium underline underline-offset-4"
                >
                  GitHub
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App 