import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile, rm } from "node:fs/promises";
import path from "node:path";

const PORT = 8081; // 8081 so that i can still run it while having eleventy serve running
const SITE_DIR = path.resolve("_site");

const mimeTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const server = createServer(async (req, res) => {
  let requestPath = decodeURIComponent(req.url.split("?")[0]);

  const filePath = path.join(SITE_DIR, requestPath);

  try {
    const data = await readFile(filePath);
    const ext = path.extname(filePath);

    res.writeHead(200, {
      "Content-Type": mimeTypes[ext] || "application/octet-stream",
    });

    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
});

await new Promise((resolve) => {
  server.listen(PORT, "127.0.0.1", resolve);
});

console.log(`Preview server running at http://127.0.0.1:${PORT}`);

const browser = await chromium.launch();

const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
  colorScheme: 'dark'
});

await page.goto(`http://127.0.0.1:${PORT}/og-preview.html`, {
  waitUntil: "networkidle",
});

await page.screenshot({
  path: path.join(SITE_DIR, "images", "og-preview.png"),
  type: "png",
});

await browser.close();
server.close();

console.log("Generated _site/images/og-preview.png");

await rm("_site/og-preview.html", { force: true })