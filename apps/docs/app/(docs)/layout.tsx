import { DocsLayout } from "fumadocs-ui/layouts/docs";
import {
  CustomSidebarFolder,
  CustomSidebarItem,
} from "@/components/sidebar-folder";
import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      tabs={{}}
      sidebar={{
        components: {
          Folder: CustomSidebarFolder,
          Item: CustomSidebarItem,
        },
      }}
      {...baseOptions()}
    >
      {children}
    </DocsLayout>
  );
}
