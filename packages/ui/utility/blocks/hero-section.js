/**
 * A hero section component for landing pages
 */
export function HeroSection({ title, subtitle, children, className = "" }) {
  return `
    <section class="relative py-20 px-4 text-center ${className}">
      <div class="max-w-4xl mx-auto">
        ${title ? `<h1 class="text-4xl md:text-6xl font-bold mb-6">${title}</h1>` : ''}
        ${subtitle ? `<p class="text-xl text-muted-foreground mb-8">${subtitle}</p>` : ''}
        ${children || ''}
      </div>
    </section>
  `
}

export function HeroActions({ children, className = "" }) {
  return `
    <div class="flex flex-col sm:flex-row gap-4 justify-center ${className}">
      ${children || ''}
    </div>
  `
} 