/**
 * Minimal navbar prototype (no beauty). Use shadcn tokens only.
 */
export function Navbar({ logo, menuItems = [], className = "" }) {
  const menuHtml = menuItems.map(item => `
    <a href="${item.href}" data-class="navbar-item" class="text-sm ${'text-muted-foreground'} hover:${'text-foreground'}">
      ${item.label}
    </a>
  `).join('')

  return `
    <nav data-class="navbar" class="w-full border-b ${'border-border'} ${'bg-card'} ${className}">
      <div class="container mx-auto px-4 flex h-14 items-center justify-between">
        <a href="/" data-class="navbar-logo" class="font-bold text-xl ${'text-foreground'}">${logo || 'Logo'}</a>
        <div class="hidden md:flex items-center gap-6">
          ${menuHtml}
        </div>
      </div>
    </nav>
  `
}

export function NavbarItem({ href, label, active = false }) {
  const base = `text-sm ${'text-muted-foreground'}`
  const activeCls = active ? `${'text-foreground'}` : base
  return `
    <a href="${href}" data-class="navbar-item" class="${activeCls}">
      ${label}
    </a>
  `
}