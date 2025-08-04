// JSON schemas for blog content validation
export const blogSchema = {
  type: "object",
  required: ["title", "description", "posts"],
  properties: {
    badge: {
      type: "string",
      description: "Optional badge text displayed above the title"
    },
    title: {
      type: "string", 
      description: "Main blog section title (required)"
    },
    subtitle: {
      type: "string",
      description: "Optional subtitle for the blog section"
    },
    description: {
      type: "string",
      description: "Blog section description text (required)"
    },
    tagline: {
      type: "string",
      description: "Optional tagline text"
    },
    viewAllText: {
      type: "string",
      description: "Text for the view all button"
    },
    buttonText: {
      type: "string",
      description: "Text for action buttons"
    },
    categories: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" }
        },
        required: ["id", "name"]
      }
    },
    posts: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          author: {
            type: "object",
            properties: {
              name: { type: "string" },
              avatar: { type: "string" }
            },
            required: ["name"]
          },
          date: { type: "string" },
          readTime: { type: "string" },
          image: {
            type: "object",
            properties: {
              src: { type: "string" },
              alt: { type: "string" }
            },
            required: ["src", "alt"]
          },
          category: { type: "string" },
          categoryId: { type: "string" }
        },
        required: ["id", "title", "description", "author", "date", "readTime", "category"]
      }
    },
    featuredPost: {
      type: "object",
      properties: {
        id: { type: "string" },
        title: { type: "string" },
        description: { type: "string" },
        author: {
          type: "object",
          properties: {
            name: { type: "string" },
            avatar: { type: "string" }
          },
          required: ["name"]
        },
        date: { type: "string" },
        readTime: { type: "string" },
        image: {
          type: "object",
          properties: {
            src: { type: "string" },
            alt: { type: "string" }
          },
          required: ["src", "alt"]
        },
        category: { type: "string" },
        categoryId: { type: "string" }
      }
    }
  }
} as const;