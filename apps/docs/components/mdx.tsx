import { Step, Steps } from "fumadocs-ui/components/steps";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { TypeTable } from "fumadocs-ui/components/type-table";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { ChangelogContent } from "./changelog-content";
import { ContractTable } from "./contract-table";
import { PackageList } from "./package-list";
import { PackageHeader, PackageSigil } from "./package-sigil";

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Tab,
    Tabs,
    Step,
    Steps,
    TypeTable,
    PackageSigil,
    PackageHeader,
    PackageList,
    ContractTable,
    ChangelogContent,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
