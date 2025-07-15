import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  minify: false,
  target: "es2022",
  platform: "browser",
  tsconfig: "./tsconfig.json",
  splitting: false,
  sourcemap: true,
  external: ["react", "react-dom"],
  esbuildOptions(options) {
    options.jsx = "automatic"
  }
}) 