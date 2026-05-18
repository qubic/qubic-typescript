import Link from "next/link";

const packages = [
  { name: "@qubic.org/types",     href: "/docs/packages/types",     desc: "Branded primitives, protocol constants, shared error types",    color: "94a3b8" },
  { name: "@qubic.org/crypto",    href: "/docs/packages/crypto",    desc: "K12 hash, SchnorrQ signatures, FourQ key derivation",           color: "a855f7" },
  { name: "@qubic.org/tx",        href: "/docs/packages/tx",        desc: "Binary transaction builder, signer, and verifier",              color: "3b82f6" },
  { name: "@qubic.org/wallet",    href: "/docs/packages/wallet",    desc: "Wallet, encrypted vault, and seed utilities",                   color: "10b981" },
  { name: "@qubic.org/rpc",       href: "/docs/packages/rpc",       desc: "Type-safe REST client for the Qubic RPC gateway",               color: "f97316" },
  { name: "@qubic.org/bob",       href: "/docs/packages/bob",       desc: "Live node client — JSON-RPC 2.0, REST, WebSocket subscriptions", color: "06b6d4" },
  { name: "@qubic.org/events",    href: "/docs/packages/events",    desc: "Binary event decoder, filter builder, typed subscription helpers", color: "f59e0b" },
  { name: "@qubic.org/registry",  href: "/docs/packages/registry",  desc: "Versioned ABI registry for all Qubic smart contracts",          color: "ef4444" },
  { name: "@qubic.org/contracts", href: "/docs/packages/contracts", desc: "Generated typed wrappers for every deployed contract",           color: "6366f1" },
  { name: "@qubic.org/tcp",       href: "/docs/packages/tcp",       desc: "Direct TCP transport — framing, connection pool, typed requests", color: "14b8a6" },
  { name: "@qubic.org/react",     href: "/docs/packages/react",     desc: "React hooks and providers — TanStack Query, VaultProvider",      color: "38bdf8" },
];

export function PackageList() {
  return (
    <div className="not-prose divide-y divide-fd-border rounded-lg border border-fd-border overflow-hidden my-4">
      {packages.map((pkg) => (
        <Link
          key={pkg.name}
          href={pkg.href}
          className="flex items-center gap-3 px-3 py-2 hover:bg-fd-accent/50 transition-colors group"
        >
          <code className="shrink-0 w-44 text-[13px] font-mono font-semibold text-fd-foreground group-hover:text-fd-primary">
            {pkg.name}
          </code>
          <span className="flex-1 text-xs text-fd-muted-foreground leading-tight">
            {pkg.desc}
          </span>
          <img
            src={`https://img.shields.io/npm/v/${encodeURIComponent(pkg.name)}?style=flat-square&label=npm&color=${pkg.color}`}
            alt="npm"
            className="shrink-0"
          />
        </Link>
      ))}
    </div>
  );
}
