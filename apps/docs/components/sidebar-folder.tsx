"use client";

import { usePathname } from "fumadocs-core/framework";
import type { Folder, Item, Node } from "fumadocs-core/page-tree";
import {
  SidebarFolder as SidebarFolderBase,
  SidebarFolderContent as SidebarFolderContentBase,
  SidebarFolderLink as SidebarFolderLinkBase,
  SidebarFolderTrigger as SidebarFolderTriggerBase,
  SidebarItem as SidebarItemBase,
  useFolder,
  useFolderDepth,
} from "fumadocs-ui/components/sidebar/base";
import type { ReactNode } from "react";

// Replicate fumadocs-ui slot/sidebar itemVariants + depth helpers
const ITEM_BASE =
  "relative flex flex-row items-center gap-2 rounded-lg p-2 text-start text-fd-muted-foreground wrap-anywhere [&_svg]:size-4 [&_svg]:shrink-0";
const LINK_VARIANT =
  "transition-colors hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80 hover:transition-none data-[active=true]:bg-fd-primary/10 data-[active=true]:text-fd-primary data-[active=true]:hover:transition-colors";
const BTN_VARIANT =
  "transition-colors hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80 hover:transition-none";
const HIGHLIGHT =
  "data-[active=true]:before:content-[''] data-[active=true]:before:bg-fd-primary data-[active=true]:before:absolute data-[active=true]:before:w-px data-[active=true]:before:inset-y-2.5 data-[active=true]:before:inset-s-2.5";
const BORDER_INDENT =
  "before:content-[''] before:absolute before:w-px before:inset-y-1 before:bg-fd-border before:inset-s-2.5";

function offset(depth: number) {
  // 0.5rem base + 0.75rem per nesting level (4px / 12px / 20px / 28px ...)
  return `${0.5 + 0.75 * depth}rem`;
}

// Styled sub-components that match fumadocs-ui's slot layer
function SlotItem({
  href,
  active,
  icon,
  depth,
  children,
}: {
  href: string;
  active: boolean;
  icon?: ReactNode;
  depth: number;
  children: ReactNode;
}) {
  return (
    <SidebarItemBase
      href={href}
      active={active}
      icon={icon}
      className={`${ITEM_BASE} ${LINK_VARIANT} ${depth >= 1 ? HIGHLIGHT : ""}`}
      style={{ paddingInlineStart: offset(depth) }}
    >
      {children}
    </SidebarItemBase>
  );
}

function SlotFolderTrigger({ children }: { children: ReactNode }) {
  const folder = useFolder();
  const depth = folder?.depth ?? 1;
  const collapsible = folder?.collapsible ?? true;
  return (
    <SidebarFolderTriggerBase
      className={`${ITEM_BASE} ${collapsible ? BTN_VARIANT : ""} w-full`}
      style={{ paddingInlineStart: offset(depth - 1) }}
    >
      {children}
    </SidebarFolderTriggerBase>
  );
}

function SlotFolderLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  const depth = useFolderDepth();
  return (
    <SidebarFolderLinkBase
      href={href}
      active={active}
      className={`${ITEM_BASE} ${LINK_VARIANT} ${depth > 1 ? HIGHLIGHT : ""} w-full`}
      style={{ paddingInlineStart: offset(depth - 1) }}
    >
      {children}
    </SidebarFolderLinkBase>
  );
}

function SlotFolderContent({ children }: { children: ReactNode }) {
  const depth = useFolderDepth();
  return (
    <SidebarFolderContentBase
      className={`relative ${depth === 1 ? BORDER_INDENT : ""}`}
    >
      <div className="flex flex-col gap-0.5 pt-0.5">{children}</div>
    </SidebarFolderContentBase>
  );
}

// Custom leaf-item renderer — applies URL-based depth for visual hierarchy.
// Can't rely on useFolderDepth() because root:true folders in meta.json (e.g.
// the package roots) flatten their children to siblings — all such items end
// up at depth 0 in the React FolderContext. URL segment count is a robust
// proxy for "visual nesting level."
export function CustomSidebarItem({ item }: { item: Item }) {
  const pathname = usePathname();
  const folderDepth = useFolderDepth();
  const urlSegments = item.url.split("/").filter(Boolean).length;
  // Use the deeper of folder-context depth or URL-derived depth.
  // URL minus 1 because the first segment ("packages") is a top-level section.
  const depth = Math.max(folderDepth, Math.max(0, urlSegments - 1));
  // Normalize trailing slash so an item.url like "/foo/" doesn't break the
  // active-state startsWith check (it would become "/foo//" otherwise).
  const url = item.url.replace(/\/$/, "");
  const active = pathname === url || pathname.startsWith(`${url}/`);
  return (
    <SidebarItemBase
      href={item.url}
      active={active}
      icon={item.icon}
      external={item.external}
      className={`${ITEM_BASE} ${LINK_VARIANT} ${depth >= 1 ? "text-sm" : ""} ${depth >= 2 ? "text-[0.8125rem]" : ""}`}
      style={{ paddingInlineStart: offset(depth) }}
    >
      {item.name}
    </SidebarItemBase>
  );
}

export function CustomSidebarFolder({
  item,
  children,
}: {
  item: Folder;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const depth = useFolderDepth();

  if (item.root) {
    // For root:true folders fumadocs does NOT set item.index — the index page
    // lands as the first Item child instead. Find it to get the URL.
    const indexPage = item.children.find((c: Node) => c.type === "page") as
      | Item
      | undefined;
    const url = indexPage?.url;

    if (url) {
      const active = pathname === url || pathname.startsWith(`${url}/`);
      return (
        <SlotItem href={url} active={active} icon={item.icon} depth={depth}>
          {item.name}
        </SlotItem>
      );
    }
  }

  // Default folder rendering with slot-level styling
  const indexActive = item.index
    ? pathname === item.index.url || pathname.startsWith(`${item.index.url}/`)
    : false;

  return (
    <SidebarFolderBase
      collapsible={item.collapsible}
      active={indexActive}
      defaultOpen={item.defaultOpen}
    >
      {item.index ? (
        <SlotFolderLink
          href={item.index.url}
          active={pathname === item.index.url}
        >
          {item.icon}
          {item.name}
        </SlotFolderLink>
      ) : (
        <SlotFolderTrigger>
          {item.icon}
          {item.name}
        </SlotFolderTrigger>
      )}
      <SlotFolderContent>{children}</SlotFolderContent>
    </SidebarFolderBase>
  );
}
