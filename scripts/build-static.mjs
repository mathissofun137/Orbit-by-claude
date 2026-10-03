// Builds a folder of plain static files (no server needed) that you can host on
// GitHub Pages, Cloudflare Pages, Netlify, etc. The browser then talks to a Wisp
// server you run elsewhere. Usage:  WISP_URL=wss://your-app.onrender.com/wisp/ npm run build:static
import { cpSync, rmSync, mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { scramjetPath } from "@mercuryworkshop/scramjet/path";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";

const out = fileURLToPath(new URL("../static/", import.meta.url));
const pub = fileURLToPath(new URL("../public/", import.meta.url));
const wisp = process.env.WISP_URL || "";
if (!wisp) console.warn("WARNING: WISP_URL is not set. The browser will not work until you set it.");
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(pub, out, { recursive: true });
cpSync(scramjetPath, out + "scram", { recursive: true });
cpSync(libcurlPath, out + "libcurl", { recursive: true });
cpSync(baremuxPath, out + "baremux", { recursive: true });
writeFileSync(out + "config.js", "window.ORBIT_CONFIG = " + JSON.stringify({ wisp }) + ";\n");
writeFileSync(out + ".nojekyll", "");
console.log("Built static site in static/  (Wisp: " + (wisp || "none") + ")");
