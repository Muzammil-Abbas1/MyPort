import path from "path"
import type { ServerResponse } from "http"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"
import type { Plugin } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// Serves /api/* from the ./api folder during `npm run dev`, mirroring how
// Vercel serverless functions behave in production. Secrets come from
// app/.env.local and stay server-side (they are never sent to the browser).
const devApi = (mode: string): Plugin => ({
  name: "dev-api",
  configureServer(server) {
    // Values that came from .env files are refreshed on every (re)load, but
    // variables already set in the real environment are never overridden.
    const g = globalThis as typeof globalThis & { __envFromFile?: Set<string> }
    const fromFile = (g.__envFromFile ??= new Set<string>())
    for (const [key, value] of Object.entries(loadEnv(mode, process.cwd(), ""))) {
      if (!(key in process.env) || fromFile.has(key)) {
        process.env[key] = value
        fromFile.add(key)
      }
    }

    server.middlewares.use("/api", async (req, res, next) => {
      const name = (req.url ?? "").split("?")[0].replace(/^\//, "")
      if (!/^[a-z0-9-]+$/i.test(name)) return next()

      let mod: { default?: (req: unknown, res: unknown) => unknown }
      try {
        mod = await server.ssrLoadModule(`/api/${name}.ts`)
      } catch {
        return next()
      }
      if (typeof mod.default !== "function") return next()

      const chunks: Buffer[] = []
      for await (const chunk of req) chunks.push(chunk as Buffer)
      const raw = Buffer.concat(chunks).toString("utf8")
      let body: unknown = raw
      if (raw && String(req.headers["content-type"]).includes("application/json")) {
        try {
          body = JSON.parse(raw)
        } catch {
          body = raw
        }
      }

      type ApiRes = ServerResponse & {
        status: (code: number) => ApiRes
        json: (data: unknown) => void
      }
      const vRes = res as ApiRes
      vRes.status = (code) => {
        res.statusCode = code
        return vRes
      }
      vRes.json = (data) => {
        res.setHeader("Content-Type", "application/json")
        res.end(JSON.stringify(data))
      }
      ;(req as typeof req & { body?: unknown }).body = body

      try {
        await mod.default(req, vRes)
      } catch (err) {
        console.error(err)
        if (!res.headersSent) vRes.status(500).json({ error: "Server error" })
      }
    })
  },
})

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [inspectAttr(), react(), devApi(mode)],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
