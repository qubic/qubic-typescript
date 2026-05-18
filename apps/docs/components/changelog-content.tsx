import fs from "node:fs";
import path from "node:path";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";

const processor = remark().use(remarkGfm).use(remarkRehype);

async function renderMarkdown(content: string) {
  const nodes = processor.parse({ value: content });
  // biome-ignore lint/suspicious/noExplicitAny: hast types
  const hast = (await processor.run(nodes)) as any;
  return toJsxRuntime(hast, {
    development: false,
    jsx,
    jsxs,
    Fragment,
    // biome-ignore lint/suspicious/noExplicitAny: fumadocs components
    components: defaultMdxComponents as any,
  });
}

export async function ChangelogContent({ pkg }: { pkg: string }) {
  const filePath = path.resolve(
    process.cwd(),
    "../../packages",
    pkg,
    "CHANGELOG.md",
  );

  let content: string;
  try {
    content = fs.readFileSync(filePath, "utf-8");
  } catch {
    return <p className="text-fd-muted-foreground">Changelog not available.</p>;
  }

  // Strip the top H1 (package name) — the page title already shows it
  content = content.replace(/^# [^\n]*\n+/, "");

  const rendered = await renderMarkdown(content);
  return <>{rendered}</>;
}
