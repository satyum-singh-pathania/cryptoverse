// Generates the CryptoVerse favicon set (gold ₿ badge) into public/.
// Renders an SVG via headless Edge/Chrome screenshots; builds favicon.ico too.
// Usage:  node scripts/build-favicon.mjs
import {
  writeFileSync,
  readFileSync,
  existsSync,
  statSync,
  mkdtempSync,
} from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = join(ROOT, "public");

const BROWSER = [
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
].find(existsSync);
if (!BROWSER) {
  console.error("No Edge/Chrome found.");
  process.exit(1);
}

const GRAD = `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="#f7a600"/><stop offset="1" stop-color="#ffce54"/>
</linearGradient></defs>`;
const GLYPH = `<text x="256" y="262" text-anchor="middle" dominant-baseline="central"
  font-family="'Segoe UI Symbol','Segoe UI',Arial,sans-serif" font-weight="700"
  font-size="300" fill="#0b0e14">₿</text>`;

// Full-bleed gold square (raster icons / PWA / maskable) — no transparency needed.
const rasterSvg = (s) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 512 512">${GRAD}<rect width="512" height="512" fill="url(#g)"/>${GLYPH}</svg>`;
// Rounded badge (crisp vector favicon shown by modern browsers).
const roundedSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">${GRAD}<rect x="36" y="36" width="440" height="440" rx="116" fill="url(#g)"/>${GLYPH}</svg>`;

const profile = mkdtempSync(join(tmpdir(), "cv-fav-"));
const tmp = mkdtempSync(join(tmpdir(), "cv-svg-"));

function shoot(svg, size, outPath) {
  const htmlPath = join(tmp, `i${size}.html`);
  writeFileSync(
    htmlPath,
    `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0}svg{display:block}</style></head><body>${svg}</body></html>`
  );
  const url = "file:///" + htmlPath.replace(/\\/g, "/");
  const args = (flag) => [
    flag,
    "--disable-gpu",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    `--user-data-dir=${profile}`,
    `--window-size=${size},${size}`,
    `--screenshot=${outPath}`,
    url,
  ];
  try {
    execFileSync(BROWSER, args("--headless=new"), { stdio: "ignore", timeout: 60000 });
    if (!existsSync(outPath)) execFileSync(BROWSER, args("--headless"), { stdio: "ignore", timeout: 60000 });
  } catch {
    execFileSync(BROWSER, args("--headless"), { stdio: "ignore", timeout: 60000 });
  }
}

const targets = [
  ["favicon-16x16.png", 16],
  ["favicon-32x32.png", 32],
  ["apple-touch-icon.png", 180],
  ["logo192.png", 192],
  ["logo512.png", 512],
  ["maskable.png", 512],
];
for (const [name, size] of targets) {
  shoot(rasterSvg(size), size, join(PUBLIC, name));
  console.log(`  ${name} (${size}px)`);
}

// Scalable vector favicon
writeFileSync(join(PUBLIC, "favicon.svg"), roundedSvg, "utf8");
console.log("  favicon.svg");

// favicon.ico = 16 + 32 PNGs wrapped in an ICO container
function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + images.length * 16;
  const entries = [];
  for (const img of images) {
    const e = Buffer.alloc(16);
    e.writeUInt8(img.size >= 256 ? 0 : img.size, 0);
    e.writeUInt8(img.size >= 256 ? 0 : img.size, 1);
    e.writeUInt16LE(1, 4); // color planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(img.buf.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += img.buf.length;
    entries.push(e);
  }
  return Buffer.concat([header, ...entries, ...images.map((i) => i.buf)]);
}
const ico = buildIco([
  { size: 16, buf: readFileSync(join(PUBLIC, "favicon-16x16.png")) },
  { size: 32, buf: readFileSync(join(PUBLIC, "favicon-32x32.png")) },
]);
writeFileSync(join(PUBLIC, "favicon.ico"), ico);
console.log(`  favicon.ico (${ico.length} bytes)`);

console.log("Favicon set generated in public/.");
