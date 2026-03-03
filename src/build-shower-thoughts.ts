import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, resolve, dirname } from "path";
import { fileURLToPath } from "url";
import dayjs from "dayjs";
import { htmlEscape } from "escape-goat";
import { marked } from "marked";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..", "shower-thoughts");
const SOURCE_ROOT = resolve(__dirname, "..", "shower-thoughts", "src");
const TEMPLATE_PATH = join(SOURCE_ROOT, "_template.html");

const FILENAME_PATTERN = /^(\d{4}-\d{2}-\d{2})-(.+)\.md$/;
const DATE_FORMAT = "D MMMM YYYY";
const YEAR_FORMAT = "YYYY";

type ParsedFile = {
  slug: string;
  formattedDate: string;
  date: dayjs.Dayjs;
};

function getTemplate(): string {
  if (!existsSync(TEMPLATE_PATH)) {
    throw new Error(`Template not found: ${TEMPLATE_PATH}`);
  }
  return readFileSync(TEMPLATE_PATH, "utf-8");
}

function fillTemplate(
  template: string,
  title: string,
  date: string,
  content: string
): string {
  return template
    .replace(/\{\{TITLE\}\}/g, htmlEscape(title))
    .replace(/\{\{DATE\}\}/g, date ? htmlEscape(date) : "")
    .replace(/\{\{CONTENT\}\}/g, content);
}

function parseFilename(filename: string): (ParsedFile & { filename: string }) | null {
  const match = filename.match(FILENAME_PATTERN);
  if (!match) return null;

  const [, dateStr, slug] = match;
  const d = dayjs(dateStr);
  if (!d.isValid()) return null;

  return {
    slug,
    filename,
    formattedDate: d.format(DATE_FORMAT),
    date: d,
  };
}

function slugToTitle(slug: string): string {
  return slug.replace(/-/g, " ");
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

async function build(): Promise<void> {
  if (!existsSync(ROOT)) {
    mkdirSync(ROOT, { recursive: true });
    console.log("Created shower-thoughts/ — add .md files and run again.");
    return;
  }

  const template = getTemplate();
  const files = readdirSync(SOURCE_ROOT).filter(
    (f: string) => f.endsWith(".md") && !f.startsWith("_")
  );

  const entries: (ParsedFile & { filename: string })[] = [];
  for (const file of files) {
    const parsed = parseFilename(file);
    if (!parsed) {
      console.warn(`Skipping ${file} (expected YYYY-mm-dd-slug.md)`);
      continue;
    }

    if (parsed.date.isBefore(dayjs())) {
      entries.push(parsed);
    }
  }

  for (const { slug, filename, formattedDate } of entries) {
    const mdPath = join(SOURCE_ROOT, filename);
    const md = readFileSync(mdPath, "utf-8");
    const bodyHtml = await marked.parse(md);
    const content = `<article class="essay">${bodyHtml}</article>`;
    const html = fillTemplate(
      template,
      slugToTitle(slug),
      formattedDate,
      content
    );
    const outPath = join(ROOT, `${slug}.html`);
    writeFileSync(outPath, html, "utf-8");
    console.log(`Built: ${filename} → ${slug}.html`);
  }

  // Group by year, newest first; entries within year sorted by date (newest first)
  const byYear = new Map<string, (ParsedFile & { filename: string })[]>();
  for (const e of entries) {
    const key = e.date.format(YEAR_FORMAT);
    if (!byYear.has(key)) byYear.set(key, []);
    byYear.get(key)!.push(e);
  }
  for (const arr of byYear.values()) {
    arr.sort((a, b) => b.date.valueOf() - a.date.valueOf());
  }
  const sortedYears = [...byYear.entries()].sort(
    (a, b) => parseInt(b[0], 10) - parseInt(a[0], 10)
  );

  const indexSections = sortedYears
    .map(([year, items]) => {
      const listItems = items
        .map(
          (e) =>
            `<li><span class="list-date">${htmlEscape(e.formattedDate)}</span> · <a href="${htmlEscape(e.slug)}.html">${htmlEscape(capitalize(slugToTitle(e.slug)))}</a></li>`
        )
        .join("");
      return `<section><h2 class="index-year">${htmlEscape(year)}</h2><ul class="list">${listItems}</ul></section>`;
    })
    .join("\n");

  const indexContent = `<h1 class="index-title">Shower thoughts</h1>\n${indexSections}`;
  let indexHtml = fillTemplate(template, "Shower thoughts", "", indexContent);
  indexHtml = indexHtml.replace(/<p class="subtitle"><\/p>\n?/, "");
  writeFileSync(join(ROOT, "index.html"), indexHtml, "utf-8");
  console.log("Built: index.html");
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
