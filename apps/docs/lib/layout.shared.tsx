import Image from "next/image";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { gitConfig } from "./shared";

function NavTitle() {
  return (
    <span className="flex items-center gap-2">
      <Image
        src="/qubic-logo.svg"
        alt="Qubic"
        width={72}
        height={21}
        className="dark:invert"
      />
      <span className="text-sm font-medium text-fd-muted-foreground">
        TypeScript
      </span>
    </span>
  );
}

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <NavTitle />,
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
