import type { ContractRegistry } from "@qubic.org/registry";
import registryData from "@qubic.org/registry/registry.json";

const registry = registryData as unknown as ContractRegistry;

export function ContractTable() {
  const active = registry.versions
    .filter((v) => v.effectiveToEpoch === null)
    .sort((a, b) => a.contractIndex - b.contractIndex);

  return (
    <div className="not-prose overflow-x-auto rounded-lg border border-fd-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-fd-border bg-fd-muted/50">
            <th className="px-4 py-2.5 text-left font-medium text-fd-muted-foreground">
              Index
            </th>
            <th className="px-4 py-2.5 text-left font-medium text-fd-muted-foreground">
              Name
            </th>
            <th className="px-4 py-2.5 text-left font-medium text-fd-muted-foreground hidden sm:table-cell">
              Address
            </th>
            <th className="px-4 py-2.5 text-right font-medium text-fd-muted-foreground">
              Procedures
            </th>
            <th className="px-4 py-2.5 text-right font-medium text-fd-muted-foreground">
              Functions
            </th>
          </tr>
        </thead>
        <tbody>
          {active.map((v, i) => (
            <tr
              key={v.contractIndex}
              className={i % 2 === 0 ? "bg-fd-background" : "bg-fd-muted/20"}
            >
              <td className="px-4 py-2.5 text-fd-muted-foreground font-mono text-xs">
                {v.contractIndex}
              </td>
              <td className="px-4 py-2.5 font-medium">{v.contractName}</td>
              <td className="px-4 py-2.5 font-mono text-xs text-fd-muted-foreground hidden sm:table-cell">
                {v.contractAddress
                  ? `${v.contractAddress.slice(0, 8)}…${v.contractAddress.slice(-4)}`
                  : "—"}
              </td>
              <td className="px-4 py-2.5 text-right tabular-nums">
                {v.procedures.length}
              </td>
              <td className="px-4 py-2.5 text-right tabular-nums">
                {v.functions.length}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-fd-border bg-fd-muted/50">
            <td
              colSpan={5}
              className="px-4 py-2 text-xs text-fd-muted-foreground"
            >
              {active.length} contracts active · registry last updated{" "}
              {new Date(registry.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
