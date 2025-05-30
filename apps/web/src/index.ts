import { Elysia } from "elysia"
import { staticPlugin } from "@elysiajs/static"

const app = new Elysia()
  .use(staticPlugin({
    assets: "public",
    prefix: ""
  }))
  .get("/", () => Bun.file("public/index.html"))
  .get("/r/*", ({ params }: { params: { "*"?: string } }) => {
    // Serve registry files with CORS
    const path = `public/r/${params['*']}`
    return Bun.file(path)
  })
  .listen(process.env.PORT || 3000)

console.log(`🚀 Server running at http://localhost:${app.server?.port}`)
