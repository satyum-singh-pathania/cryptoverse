// Builds a styled PDF from REPORT.md + DOCUMENTATION.md using headless Edge/Chrome.
// Usage:  node docs/build-pdf.mjs
import { readFileSync, writeFileSync, existsSync, statSync, mkdtempSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = dirname(fileURLToPath(import.meta.url));
const HTML_PATH = join(DIR, "cryptoverse-documentation.html");
const PDF_PATH = join(DIR, "CryptoVerse-Documentation.pdf");
const GENERATED = "Version 1.0 · June 2026";

/* ----------------------------- markdown -> html ----------------------------- */
const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

function inline(text) {
  let out = "";
  const parts = text.split("`");
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 1) {
      out += "<code>" + esc(parts[i]) + "</code>";
    } else {
      let t = esc(parts[i]);
      t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
      t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
      t = t.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
      out += t;
    }
  }
  return out;
}

const splitRow = (line) =>
  line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());

function mdToHtml(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const headings = [];
  let html = "";
  let i = 0;
  const N = lines.length;
  while (i < N) {
    const line = lines[i];

    if (/^```/.test(line)) {
      i++;
      let code = "";
      while (i < N && !/^```/.test(lines[i])) code += lines[i++] + "\n";
      i++;
      html += "<pre><code>" + esc(code.replace(/\n$/, "")) + "</code></pre>\n";
      continue;
    }
    if (/^\s*$/.test(line)) {
      i++;
      continue;
    }
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      const lvl = h[1].length;
      const id = slug(h[2]);
      if (lvl <= 2) headings.push({ lvl, text: h[2], id });
      html += `<h${lvl} id="${id}">` + inline(h[2]) + `</h${lvl}>\n`;
      i++;
      continue;
    }
    if (/^---+\s*$/.test(line)) {
      html += "<hr>\n";
      i++;
      continue;
    }
    if (/^\|.*\|\s*$/.test(line) && i + 1 < N && /^\|?\s*:?-{2,}/.test(lines[i + 1])) {
      const header = splitRow(line);
      i += 2;
      const rows = [];
      while (i < N && /^\|.*\|\s*$/.test(lines[i])) rows.push(splitRow(lines[i++]));
      html +=
        "<table><thead><tr>" +
        header.map((c) => "<th>" + inline(c) + "</th>").join("") +
        "</tr></thead><tbody>" +
        rows
          .map((r) => "<tr>" + r.map((c) => "<td>" + inline(c) + "</td>").join("") + "</tr>")
          .join("") +
        "</tbody></table>\n";
      continue;
    }
    if (/^>\s?/.test(line)) {
      let bq = "";
      while (i < N && /^>\s?/.test(lines[i])) bq += lines[i++].replace(/^>\s?/, "") + " ";
      html += "<blockquote>" + inline(bq.trim()) + "</blockquote>\n";
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      const items = [];
      while (i < N && /^[-*]\s+/.test(lines[i])) items.push(lines[i++].replace(/^[-*]\s+/, ""));
      html += "<ul>" + items.map((it) => "<li>" + inline(it) + "</li>").join("") + "</ul>\n";
      continue;
    }
    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (i < N && /^\d+\.\s+/.test(lines[i])) items.push(lines[i++].replace(/^\d+\.\s+/, ""));
      html += "<ol>" + items.map((it) => "<li>" + inline(it) + "</li>").join("") + "</ol>\n";
      continue;
    }
    let para = "";
    while (
      i < N &&
      !/^\s*$/.test(lines[i]) &&
      !/^(#{1,6}\s|```|>\s?|[-*]\s+|\d+\.\s+|\|)/.test(lines[i]) &&
      !/^---+\s*$/.test(lines[i])
    ) {
      para += (para ? " " : "") + lines[i++];
    }
    html += "<p>" + inline(para) + "</p>\n";
  }
  return { html, headings };
}

/* -------------------------------- template ---------------------------------- */
const report = mdToHtml(readFileSync(join(DIR, "REPORT.md"), "utf8"));
const docs = mdToHtml(readFileSync(join(DIR, "DOCUMENTATION.md"), "utf8"));

const tocItems = (headings) =>
  headings
    .filter((x) => x.lvl === 2)
    .map((x) => `<li><a href="#${x.id}">${x.text}</a></li>`)
    .join("");

const STYLE = `
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  @page { size: A4; margin: 18mm 16mm; }
  body { font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1f2530; line-height: 1.55; font-size: 11pt; margin: 0; }
  h1, h2, h3, h4 { line-height: 1.25; break-after: avoid; }
  h1 { font-size: 20pt; color: #b8770a; border-bottom: 3px solid #f7a600; padding-bottom: 6px; margin: 0 0 14px; }
  h2 { font-size: 15pt; color: #1a2030; margin: 26px 0 10px; padding-left: 12px; border-left: 4px solid #f7a600; }
  h3 { font-size: 12.5pt; color: #2b3242; margin: 18px 0 8px; }
  p { margin: 8px 0; }
  a { color: #b8770a; text-decoration: none; }
  ul, ol { margin: 8px 0; padding-left: 22px; }
  li { margin: 4px 0; }
  code { font-family: "Cascadia Code", Consolas, monospace; background: #f1f3f7; border: 1px solid #e3e7ef; border-radius: 4px; padding: 1px 5px; font-size: 9.5pt; color: #b8770a; }
  pre { background: #0f131b; color: #e7e9ee; border-radius: 8px; padding: 14px 16px; overflow-x: auto; break-inside: avoid; font-size: 9pt; }
  pre code { background: none; border: none; color: #e7e9ee; padding: 0; }
  blockquote { margin: 12px 0; padding: 10px 16px; background: #fff8ea; border-left: 4px solid #f7a600; color: #4a4233; font-style: italic; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 10pt; break-inside: avoid; }
  th, td { border: 1px solid #e3e7ef; padding: 8px 10px; text-align: left; vertical-align: top; }
  th { background: #fdf2da; color: #1a2030; font-weight: 700; }
  tr:nth-child(even) td { background: #fafbfd; }
  hr { border: none; border-top: 1px solid #e3e7ef; margin: 20px 0; }
  .page-break { break-after: page; }
  .cover { height: 250mm; display: flex; flex-direction: column; justify-content: center; }
  .cover-badge { width: 84px; height: 84px; border-radius: 22px; background: linear-gradient(135deg, #f7a600, #ffce54); display: flex; align-items: center; justify-content: center; font-size: 46px; font-weight: 800; color: #0b0e14; box-shadow: 0 10px 30px rgba(247,166,0,0.35); }
  .cover h1 { font-size: 44pt; border: none; margin: 28px 0 6px; color: #1a2030; letter-spacing: -1px; }
  .cover .accent { background: linear-gradient(135deg, #f7a600, #ffb929); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
  .cover .subtitle { font-size: 17pt; color: #5b6473; margin: 0; }
  .cover .rule { width: 120px; height: 5px; background: linear-gradient(90deg, #f7a600, #ffce54); border-radius: 3px; margin: 26px 0; }
  .cover .meta { color: #8a93a3; font-size: 11pt; }
  .cover .desc { margin-top: 18px; max-width: 460px; color: #4a5160; }
  .toc { background: #fafbfd; border: 1px solid #e3e7ef; border-radius: 10px; padding: 8px 26px; }
  .toc h2 { border: none; padding: 0; margin: 16px 0 8px; }
  .doc-tag { display: inline-block; background: #fdf2da; color: #b8770a; font-size: 9pt; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 4px 12px; border-radius: 999px; margin-bottom: 8px; }
`;

const HTML = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><title>CryptoVerse — Documentation & Report</title>
<style>${STYLE}</style></head>
<body>

  <section class="cover page-break">
    <div class="cover-badge">₿</div>
    <h1>Crypto<span class="accent">Verse</span></h1>
    <p class="subtitle">Project Documentation &amp; Report</p>
    <div class="rule"></div>
    <p class="desc">A real-time cryptocurrency dashboard built with React, Vite, and Ant Design — live prices, charts, portfolio tracking, and market insights.</p>
    <p class="meta">${GENERATED}</p>
  </section>

  <section class="toc page-break">
    <h1>Contents</h1>
    <h2>Part I — Project Report</h2>
    <ol>${tocItems(report.headings)}</ol>
    <h2>Part II — Technical Documentation</h2>
    <ol>${tocItems(docs.headings)}</ol>
  </section>

  <section class="page-break">
    <span class="doc-tag">Part I · Report</span>
    ${report.html}
  </section>

  <section>
    <span class="doc-tag">Part II · Documentation</span>
    ${docs.html}
  </section>

</body></html>`;

writeFileSync(HTML_PATH, HTML, "utf8");
console.log("Wrote HTML ->", HTML_PATH);

/* ------------------------------- render PDF --------------------------------- */
const EDGE_CANDIDATES = [
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
];
const browser = EDGE_CANDIDATES.find((p) => existsSync(p));
if (!browser) {
  console.log("No Edge/Chrome found. Open the HTML and 'Print to PDF' manually.");
  process.exit(0);
}

const fileUrl = "file:///" + HTML_PATH.replace(/\\/g, "/");
const profile = mkdtempSync(join(tmpdir(), "cv-pdf-"));

const run = (headlessFlag) =>
  execFileSync(
    browser,
    [
      headlessFlag,
      "--disable-gpu",
      "--no-pdf-header-footer",
      `--user-data-dir=${profile}`,
      `--print-to-pdf=${PDF_PATH}`,
      fileUrl,
    ],
    { stdio: "ignore", timeout: 90000 }
  );

const ok = () => existsSync(PDF_PATH) && statSync(PDF_PATH).size > 1000;

try {
  run("--headless=new");
  if (!ok()) run("--headless");
} catch {
  try {
    run("--headless");
  } catch (e) {
    console.error("PDF render failed:", e.message);
    process.exit(1);
  }
}

if (ok()) {
  const kb = Math.round(statSync(PDF_PATH).size / 1024);
  console.log(`PDF created -> ${PDF_PATH} (${kb} KB)`);
} else {
  console.error("PDF was not produced.");
  process.exit(1);
}
