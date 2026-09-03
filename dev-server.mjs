import http from "node:http";
import path from "node:path";
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const port = 4173;
const refreshScript = `
<script>
  (() => {
    let previousVersion = null;
    const checkForChanges = async () => {
      try {
        const response = await fetch('/__file-version', { cache: 'no-store' });
        const version = await response.text();
        if (previousVersion !== null && version !== previousVersion) window.location.reload();
        previousVersion = version;
      } catch (_) {}
    };
    checkForChanges();
    window.setInterval(checkForChanges, 700);
  })();
</script>`;

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
};

async function fileVersion() {
  const files = ["index.html", "styles.css", "header-theme.js", "assets/metrics-logo.png"];
  const versions = await Promise.all(files.map(async (file) => {
    const info = await stat(path.join(root, file));
    return `${file}:${info.mtimeMs}:${info.size}`;
  }));
  return versions.join("|");
}

const server = http.createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url, `http://${request.headers.host}`);

    if (requestUrl.pathname === "/__file-version") {
      response.writeHead(200, { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" });
      response.end(await fileVersion());
      return;
    }

    const relativePath = decodeURIComponent(requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname);
    const filePath = path.resolve(root, `.${relativePath}`);
    if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    let content = await readFile(filePath);
    const extension = path.extname(filePath).toLowerCase();
    if (extension === ".html") content = Buffer.from(content.toString().replace("</body>", `${refreshScript}</body>`));

    response.writeHead(200, { "content-type": mimeTypes[extension] || "application/octet-stream", "cache-control": "no-store" });
    response.end(content);
  } catch (error) {
    response.writeHead(error.code === "ENOENT" ? 404 : 500, { "content-type": "text/plain; charset=utf-8" });
    response.end(error.code === "ENOENT" ? "Not found" : "Preview server error");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Metrics preview disponibile su http://127.0.0.1:${port}`);
  console.log("Salva index.html, styles.css o header-theme.js per ricaricare automaticamente la pagina.");
});
