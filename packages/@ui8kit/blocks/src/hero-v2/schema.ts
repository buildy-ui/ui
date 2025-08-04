// JSON schemas for hero content validation
export const heroSchema = {
  type: "object",
  required: ["title", "description"],
  properties: {
    badge: {
      type: "string",
      description: "Optional badge text displayed above the title"
    },
    title: {
      type: "string", 
      description: "Main hero title (required)"
    },
    description: {
      type: "string",
      description: "Hero description text (required)"
    },
    primaryButtonText: {
      type: "string",
      description: "Text for the primary action button"
    },
    secondaryButtonText: {
      type: "string", 
      description: "Text for the secondary action button"
    },
    topButton: {
      type: "object",
      properties: {
        text: { type: "string" },
        href: { type: "string" }
      }
    },
    image: {
      type: "object",
      properties: {
        src: { type: "string" },
        alt: { type: "string" }
      }
    },
    images: {
      type: "array",
      items: {
        type: "object", 
        properties: {
          id: { type: "string" },
          src: { type: "string" },
          alt: { type: "string" }
        }
      }
    },
    stats: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          value: { type: "string" },
          label: { type: "string" }
        }
      }
    }
  }
} as const;