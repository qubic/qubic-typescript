import { docs } from "collections/server";
import { loader } from "fumadocs-core/source";
import type { LoaderPlugin } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import { createElement } from "react";
import { PackageSigil } from "@/components/package-sigil";
import { docsContentRoute, docsImageRoute, docsRoute } from "./shared";

function sigilPlugin(): LoaderPlugin {
  // biome-ignore lint/suspicious/noExplicitAny: fumadocs node types are internal
  function replaceIcon(node: any) {
    if (
      typeof node.name === "string" &&
      node.name.startsWith("@qubic.org/") &&
      (node.icon === undefined || typeof node.icon === "string")
    ) {
      node.icon = createElement(PackageSigil, { name: node.name, size: 20 });
    }
    return node;
  }
  return {
    name: "sigil-icons",
    transformPageTree: {
      folder: replaceIcon,
      file: replaceIcon,
      separator: replaceIcon,
    },
  };
}

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  plugins: [sigilPlugin(), lucideIconsPlugin()],
});

export function getPageImage(page: (typeof source)["$inferPage"]) {
  const segments = [...page.slugs, "image.webp"];

  return {
    segments,
    url: `${docsImageRoute}/${segments.join("/")}`,
  };
}

export function getPageMarkdownUrl(page: (typeof source)["$inferPage"]) {
  const segments = [...page.slugs, "content.md"];

  return {
    segments,
    url: `${docsContentRoute}/${segments.join("/")}`,
  };
}

export async function getLLMText(page: (typeof source)["$inferPage"]) {
  const processed = await page.data.getText("processed");

  return `# ${page.data.title} (${page.url})

${processed}`;
}
