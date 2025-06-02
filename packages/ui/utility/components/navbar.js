/**
 * A responsive navigation bar component with logo and menu items
 */
export function Navbar({ logo, menuItems = [], className = "" }) {
  const menuHtml = menuItems.map(item => `
    <a href="${item.href}" class="text-foreground hover:text-primary transition-colors">
      ${item.label}
    </a>
  `).join('')

  return `
    <nav class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${className}">
      <div class="container flex h-14 items-center">
        <div class="mr-4 flex">
          <a class="mr-6 flex items-center space-x-2" href="/">
            <span class="font-bold text-xl">${logo || 'Logo'}</span>
          </a>
          <nav class="hidden md:flex items-center space-x-6 text-sm font-medium">
            ${menuHtml}
          </nav>
        </div>
        <div class="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div class="w-full flex-1 md:w-auto md:flex-none">
            <!-- Search or other content -->
          </div>
          <nav class="flex items-center">
            <button class="md:hidden p-2">
              <span class="sr-only">Toggle menu</span>
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </nav>
  `
}

export function NavbarItem({ href, label, active = false }) {
  return `
    <a href="${href}" class="text-sm font-medium transition-colors hover:text-primary ${active ? 'text-primary' : 'text-muted-foreground'}">
      ${label}
    </a>
  `
} 