import { join, resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const PORT = 9010;

const server = Bun.serve({
  port: PORT,
  fetch: async (req) => {
    const pathname = decodeURIComponent(new URL(req.url).pathname);
    const pathWithoutLeadingSlash = pathname.slice(1) || "";
    const candidates = pathname.endsWith("/")
      ? [join(ROOT, pathWithoutLeadingSlash, "index.html")]
      : [join(ROOT, pathWithoutLeadingSlash), join(ROOT, pathWithoutLeadingSlash, "index.html")];

    for (const p of candidates) {
      if (!p.startsWith(ROOT)) continue;
      const file = Bun.file(p);
      if (await file.exists()) {
        return new Response(file, {
          headers: { "Content-Type": contentType(p) },
        });
      }
    }
    return new Response("Not Found", { status: 404 });
  },
});

function contentType(path: string): string {
  if (path.endsWith(".html")) return "text/html; charset=utf-8";
  if (path.endsWith(".css")) return "text/css; charset=utf-8";
  if (path.endsWith(".js")) return "application/javascript; charset=utf-8";
  if (path.endsWith(".ico")) return "image/x-icon";
  if (path.endsWith(".svg")) return "image/svg+xml";
  return "application/octet-stream";
}

console.log(`http://localhost:${server.port}`);
