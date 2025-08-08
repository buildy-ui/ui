/**
 * Minimal, JS-free Sheet component using Tailwind utilities and a checkbox toggle.
 * - Uses only shadcn tokens (bg-card, text-muted-foreground, border-border)
 * - No animations/gradients/shadows beyond defaults
 * - Provides open button and close button
 * - Content area is empty; pass any HTML via `contentHtml`
 */

/**
 * @param {Object} options
 * @param {string} [options.id="sheet"] - Unique id to bind trigger/overlay/close.
 * @param {"left"|"right"} [options.side="right"] - Sheet side.
 * @param {string} [options.openLabel="Open"] - Label for open trigger button.
 * @param {string} [options.closeLabel="Close"] - Accessible label for close button.
 * @param {string} [options.widthClass="w-80"] - Tailwind width for the sheet panel.
 * @param {string} [options.contentHtml=""] - Inner HTML for sheet content area.
 * @param {string} [options.className=""] - Extra classes for the root container.
 * @returns {string}
 */
export function Sheet({
  id = "sheet",
  side = "right",
  openLabel = "Open",
  closeLabel = "Close",
  widthClass = "w-80",
  contentHtml = "",
  className = ""
} = {}) {
  const sidePosition = side === "left" ? "left-0" : "right-0";
  const sideBorder = side === "left" ? "border-r" : "border-l";

  return `
    <div class="relative ${className}" data-class="sheet">
      <input id="${id}" type="checkbox" class="peer hidden" />

      <label
        for="${id}"
        data-class="sheet-open-button"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-md border ${"border-border"} ${"bg-card"} ${"text-muted-foreground"} cursor-pointer"
      >
        ${openLabel}
      </label>

      <div class="fixed inset-0 z-50 hidden peer-checked:block" data-class="sheet-portal">
        <label
          for="${id}"
          aria-label="Close overlay"
          data-class="sheet-overlay"
          class="absolute inset-0 ${"bg-card/50"} cursor-pointer"
        ></label>

        <div
          role="dialog"
          aria-modal="true"
          data-class="sheet-panel"
          class="absolute top-0 ${sidePosition} h-full max-w-full ${widthClass} ${"bg-card"} ${sideBorder} ${"border-border"} p-4"
        >
          <div class="flex items-center justify-between" data-class="sheet-header">
            <span class="text-sm ${"text-muted-foreground"}" data-class="sheet-title"></span>
            <label
              for="${id}"
              aria-label="${closeLabel}"
              data-class="sheet-close-button"
              class="inline-flex items-center justify-center h-8 w-8 rounded-md border ${"border-border"} ${"text-muted-foreground"} cursor-pointer"
            >
              ✕
            </label>
          </div>
          <div class="mt-4" data-class="sheet-content">
            ${contentHtml}
          </div>
        </div>
      </div>
    </div>
  `;
}


