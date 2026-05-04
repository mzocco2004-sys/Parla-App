import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const root = join(process.cwd(), "dist");
const host = "127.0.0.1";
const port = Number(process.env.PORT ?? 5180);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
};

function resolveRequestPath(url) {
  const requestedPath = decodeURIComponent(new URL(url, `http://${host}`).pathname);
  const safePath = normalize(requestedPath).replace(/^(\.\.[/\\])+/, "");
  const candidate = join(root, safePath);

  if (existsSync(candidate) && statSync(candidate).isFile()) {
    return candidate;
  }

  return join(root, "index.html");
}

const server = createServer((request, response) => {
  const filePath = resolveRequestPath(request.url ?? "/");
  const extension = extname(filePath);

  response.writeHead(200, {
    "Content-Type": mimeTypes[extension] ?? "application/octet-stream",
  });

  createReadStream(filePath).pipe(response);
});

server.listen(port, host, () => {
  console.log(`Parla pronta: http://${host}:${port}/`);
  console.log(`App: http://${host}:${port}/app`);
});
