const http = require("node:http");
const path = require("node:path");
const fs = require("node:fs/promises");
const { createHash } = require("node:crypto");
const embeddedAssets = new Set(require("./embedded-asset-index.json"));
const upstreamOrigin = "https://meteostation.top";
const runtimePath = "/tools/kpl-mvp/";
const liveSources = new Map();

async function readEmbeddedArt(key) {
  const [script, filename] = key.split("/");
  let pending = liveSources.get(script);
  if (!pending) {
    pending = (async () => {
      const response = await fetch(new URL(runtimePath + script, upstreamOrigin),
        { redirect: "error", signal: AbortSignal.timeout(45000) });
      if (!response.ok) throw new Error("Could not read the public asset catalog");
      const content = await response.text();
      const assets = new Map();
      for (const [, format, encoded] of content.matchAll(/data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/=]+)/g)) {
        const bytes = Buffer.from(encoded, "base64");
        const digest = createHash("sha256").update(bytes).digest("hex");
        const name = digest + "." + format;
        if (embeddedAssets.has(script + "/" + name)) assets.set(name, { bytes, format });
      }
      return assets;
    })().catch(error => {
      liveSources.delete(script);
      throw error;
    });
    liveSources.set(script, pending);
  }
  return (await pending).get(filename);
}

const files = new Map([
  ["index.html", "text/html; charset=utf-8"],
  ["style.css", "text/css; charset=utf-8"],
  ["shell-adapter.js", "text/javascript; charset=utf-8"],
  ["render.js", "text/javascript; charset=utf-8"],
  ["editor.js", "text/javascript; charset=utf-8"],
  ["template-families.js", "text/javascript; charset=utf-8"],
  ["hero-catalog.js", "text/javascript; charset=utf-8"],
  ["honor-catalog.js", "text/javascript; charset=utf-8"],
  ["reference-slices.js", "text/javascript; charset=utf-8"],
  ["reference-slices.png", "image/png"],
  ["challenge-2025-slices.js", "text/javascript; charset=utf-8"],
  ["challenge-2025-slices.png", "image/png"],
  ["render-challenge-2025.js", "text/javascript; charset=utf-8"],
  ["classic-assets.js", "text/javascript; charset=utf-8"],
  ["classic-glyphs.png", "image/png"],
  ["render-classic.js", "text/javascript; charset=utf-8"],
  ["event-assets.js", "text/javascript; charset=utf-8"],
  ["render-event.js", "text/javascript; charset=utf-8"],
  ["render-shared.js", "text/javascript; charset=utf-8"],
  ["hero-face-data.js", "text/javascript; charset=utf-8"],
  ["hero-cutout-catalog.js", "text/javascript; charset=utf-8"],
  ["team-catalog.js", "text/javascript; charset=utf-8"],
  ["role-catalog.js", "text/javascript; charset=utf-8"],
  ["event-type.js", "text/javascript; charset=utf-8"],
  ["event-type.png", "image/png"],
  ["type-fonts.css", "text/css; charset=utf-8"],
  ["classic-spring18-background.jpg", "image/jpeg"],
  ["classic-spring18-atlas.png", "image/png"],
  ["classic-spring18-person.png", "image/png"],
  ["classic-fall18-background.jpg", "image/jpeg"],
  ["classic-fall18-atlas.png", "image/png"],
  ["classic-fall18-person.png", "image/png"],
  ["classic-spring19-background.jpg", "image/jpeg"],
  ["classic-spring19-atlas.png", "image/png"],
  ["classic-spring19-person.png", "image/png"],
  ["classic-fall19-background.jpg", "image/jpeg"],
  ["classic-fall19-atlas.png", "image/png"],
  ["classic-fall19-person.png", "image/png"],
  ["demo.jpg", "image/jpeg"],
  ["demo-person.png", "image/png"],
  ["demo-person-alternate.png", "image/png"],
  ["challenge2025-person.png", "image/png"],
  ["grand2026-person.png", "image/png"],
  ["demo-hero-577.png", "image/png"],
  ["demo-hero-523.png", "image/png"],
  ["demo-hero.jpg", "image/jpeg"],
]);

function createServer() {
  return http.createServer(async (request, response) => {
    if (request.method !== "GET" && request.method !== "HEAD") {
      response.writeHead(405, { Allow: "GET, HEAD" }).end();
      return;
    }
    const address = new URL(request.url, "http://localhost");
    const pathname = address.pathname;
    const embeddedKey = pathname.replace(/^\/(?:tools\/kpl-mvp\/)?_art\//, "");
    if (embeddedKey !== pathname) {
      if (!embeddedAssets.has(embeddedKey)) { response.writeHead(404).end(); return; }
      try {
        const art = await readEmbeddedArt(embeddedKey);
        if (!art) { response.writeHead(404).end(); return; }
        response.writeHead(200, { "Content-Type": "image/" + art.format })
          .end(request.method === "HEAD" ? undefined : art.bytes);
      } catch { response.writeHead(502).end(); }
      return;
    }

    const portalResource = pathname.startsWith("/static/") || pathname.startsWith("/brand/") || pathname === "/favicon.ico"
      || ["/api/v1/site/config", "/api/v1/site/stats", "/api/v1/site/header-background"].includes(pathname);
    if (portalResource) {
      if (!["GET", "HEAD"].includes(request.method)) { response.writeHead(405).end(); return; }
      try {
        const upstream = await fetch(new URL(pathname + address.search, "https://meteostation.top"),
          { method: request.method, signal: AbortSignal.timeout(30000) });
        const body = request.method === "HEAD" ? undefined : Buffer.from(await upstream.arrayBuffer());
        response.writeHead(upstream.status, { "Content-Type": upstream.headers.get("content-type") || "application/octet-stream",
          "Cache-Control": "no-cache" });
        response.end(body);
      } catch { response.writeHead(502).end(); }
      return;
    }
    const components = pathname.split("/");
    const fontFile = components.slice(-2).join("/");
    const filename = /^fonts\/[A-Za-z0-9._-]+\.(?:woff2|txt)$/.test(fontFile)
      ? fontFile : pathname.endsWith("/") ? "index.html" : components.pop();
    const eventAsset = /^event-[a-z0-9]+-(background\.jpg|parts\.png)$/.exec(filename);
    const type = files.get(filename) || (/^hero-cutout-\d+-\d+\.png$/.test(filename) ? "image/png" : null)
      || (filename.startsWith("fonts/") ? "font/woff2" : null)
      || (eventAsset && (eventAsset[1] === "parts.png" ? "image/png" : "image/jpeg"));
    if (!type) {
      response.writeHead(404).end();
      return;
    }
    try {
      const body = await fs.readFile(path.join(__dirname, "dist", filename));
      response.writeHead(200, { "Content-Type": type }).end(request.method === "HEAD" ? undefined : body);
    } catch (error) {
      if (error.code !== "ENOENT") { response.writeHead(500).end(); return; }
      if (!/\.(?:jpg|png|woff2|txt)$/.test(filename)) { response.writeHead(404).end(); return; }
      // Assets served by the public workbench are not copied into this repository.
      try {
        const asset = new URL("/tools/kpl-mvp/" + filename, "https://meteostation.top");
        const upstream = await fetch(asset, {
          method: request.method, redirect: "error", signal: AbortSignal.timeout(45000)
        });
        const body = request.method === "HEAD" ? undefined : Buffer.from(await upstream.arrayBuffer());
        response.writeHead(upstream.status, {
          "Content-Type": upstream.headers.get("content-type") || type,
          "Cache-Control": "no-cache"
        }).end(body);
      } catch { response.writeHead(502).end(); }
    }
  });
}

if (require.main === module) {
  createServer().listen(8174, "127.0.0.1", () => console.log("http://127.0.0.1:8174/"));
}
module.exports = { createServer };
