/**
 * Architecture diagram for Simption ERP — multi-tenant SaaS.
 *
 * Visualises subdomain-based tenant resolution + per-tenant isolated MySQL.
 * Strokes use `currentColor` so the diagram inherits foreground colour;
 * the TenantResolver node is highlighted in accent as the critical path.
 */
export function SimptionERPArch() {
  return (
    <svg
      viewBox="0 0 480 240"
      className="h-auto w-full"
      aria-label="Simption ERP — multi-tenant architecture: browser subdomains route through TenantResolver to isolated per-tenant MySQL databases, with a module registry layered below"
      role="img"
    >
      <defs>
        <marker
          id="arr-erp"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path
            d="M0,0 L10,5 L0,10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </marker>
      </defs>

      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        fontFamily="var(--font-mono)"
        fontSize="10"
      >
        {/* Subdomain inputs */}
        {[
          { y: 16, label: "inst-1.simption.app" },
          { y: 56, label: "inst-2.simption.app" },
          { y: 96, label: "inst-N.simption.app" },
        ].map((row) => (
          <g key={row.label}>
            <rect x="10" y={row.y} width="130" height="28" rx="6" />
            <text
              x="75"
              y={row.y + 18}
              textAnchor="middle"
              fill="currentColor"
              stroke="none"
            >
              {row.label}
            </text>
          </g>
        ))}

        {/* TenantResolver — highlighted */}
        <rect
          x="180"
          y="56"
          width="140"
          height="28"
          rx="6"
          stroke="hsl(var(--accent))"
        />
        <text
          x="250"
          y="74"
          textAnchor="middle"
          fill="hsl(var(--accent))"
          stroke="none"
        >
          TenantResolver
        </text>

        {/* Arrows from subdomains to TenantResolver */}
        <path d="M140 30 L180 68" markerEnd="url(#arr-erp)" />
        <path d="M140 70 L180 70" markerEnd="url(#arr-erp)" />
        <path d="M140 110 L180 72" markerEnd="url(#arr-erp)" />

        {/* MySQL DBs */}
        {[
          { y: 16, label: "mysql · inst-1" },
          { y: 56, label: "mysql · inst-2" },
          { y: 96, label: "mysql · inst-N" },
        ].map((row) => (
          <g key={row.label}>
            <rect x="340" y={row.y} width="130" height="28" rx="6" />
            <text
              x="405"
              y={row.y + 18}
              textAnchor="middle"
              fill="currentColor"
              stroke="none"
            >
              {row.label}
            </text>
          </g>
        ))}

        {/* Arrows from TenantResolver to DBs */}
        <path d="M320 64 L340 30" markerEnd="url(#arr-erp)" />
        <path d="M320 70 L340 70" markerEnd="url(#arr-erp)" />
        <path d="M320 76 L340 110" markerEnd="url(#arr-erp)" />

        {/* Module registry below */}
        <rect x="180" y="150" width="140" height="74" rx="6" />
        <text
          x="250"
          y="170"
          textAnchor="middle"
          fill="currentColor"
          stroke="none"
        >
          Module Registry
        </text>
        <text
          x="250"
          y="188"
          textAnchor="middle"
          fill="currentColor"
          stroke="none"
          opacity="0.6"
          fontSize="9"
        >
          Students · Staff · Library
        </text>
        <text
          x="250"
          y="202"
          textAnchor="middle"
          fill="currentColor"
          stroke="none"
          opacity="0.6"
          fontSize="9"
        >
          Stock · Backup · Security
        </text>
        <text
          x="250"
          y="216"
          textAnchor="middle"
          fill="currentColor"
          stroke="none"
          opacity="0.6"
          fontSize="9"
        >
          ...20+ modules · JSON config
        </text>

        <path d="M250 84 L250 150" markerEnd="url(#arr-erp)" strokeDasharray="3 3" />
      </g>
    </svg>
  );
}
