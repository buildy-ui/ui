/**
 * A complete landing page template with hero, features, and footer sections
 */
export function LandingPageTemplate({ 
  heroTitle, 
  heroSubtitle, 
  features = [], 
  className = "" 
}) {
  const featuresHtml = features.map(feature => `
    <div class="p-6 border rounded-lg">
      <h3 class="text-xl font-semibold mb-2">${feature.title}</h3>
      <p class="text-muted-foreground">${feature.description}</p>
    </div>
  `).join('')

  return `
    <div class="min-h-screen ${className}">
      <!-- Hero Section -->
      <section class="relative py-20 px-4 text-center bg-gradient-to-b from-background to-muted">
        <div class="max-w-4xl mx-auto">
          <h1 class="text-4xl md:text-6xl font-bold mb-6">${heroTitle}</h1>
          <p class="text-xl text-muted-foreground mb-8">${heroSubtitle}</p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button class="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium">
              Get Started
            </button>
            <button class="px-6 py-3 border border-input rounded-md font-medium">
              Learn More
            </button>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="py-20 px-4">
        <div class="max-w-6xl mx-auto">
          <h2 class="text-3xl font-bold text-center mb-12">Features</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            ${featuresHtml}
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="py-12 px-4 border-t">
        <div class="max-w-6xl mx-auto text-center">
          <p class="text-muted-foreground">© 2024 Your Company. All rights reserved.</p>
        </div>
      </footer>
    </div>
  `
} 