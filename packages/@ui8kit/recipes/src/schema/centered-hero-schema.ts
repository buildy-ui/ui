import type { Recipe } from '../schema/recipe';

export const centeredHeroRecipe: Recipe = {
  "id": "centered-hero",
  "name": "CenteredHero",
  "description": "CenteredHero extracted from artifact",
  "componentName": "CenteredHero",
  "imports": [
    "Block",
    "Stack",
    "Group",
    "Title",
    "Text",
    "Button",
    "Icon"
  ],
  "extraImports": [
    "Info",
    "Rocket"
  ],
  "themeImport": "@ui8kit/theme",
  "defaults": {},
  "root": {
    "slot": "block",
    "uiComponent": "Block",
    "dataClass": "block",
    "variants": {
      "w": "full",
      "py": "py"
    },
    "children": [
      {
        "slot": "stack",
        "uiComponent": "Stack",
        "dataClass": "stack",
        "className": "max-w-4xl mx-auto",
        "variants": {
          "gap": "xl",
          "align": "center",
          "ta": "center"
        },
        "children": [
          {
            "slot": "title",
            "uiComponent": "Title",
            "dataClass": "title",
            "className": "tracking-tight leading-tight",
            "variants": {
              "order": 1,
              "size": "5xl",
              "fw": "bold",
              "ta": "center"
            },
            "content": {
              "prop": "title"
            }
          },
          {
            "slot": "text",
            "uiComponent": "Text",
            "dataClass": "text",
            "className": "max-w-[42rem]",
            "variants": {
              "c": "secondary-foreground",
              "ta": "center"
            },
            "content": {
              "prop": "description"
            }
          }
        ]
      }
    ]
  }
};
