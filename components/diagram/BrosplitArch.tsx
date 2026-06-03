export function BrosplitArch() {
  return (
    <svg
      viewBox="0 0 480 240"
      className="h-auto w-full"
      aria-label="Brosplit — expenses flow into per-currency buckets, the greedy debt-simplification engine reduces transactions per currency, repayments go through creditor-approved settlement"
      role="img"
    >
      <defs>
        <marker
          id="arr-bs"
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
        {/* Expense input */}
        <rect x="10" y="90" width="100" height="40" rx="6" />
        <text x="60" y="106" textAnchor="middle" fill="currentColor" stroke="none">
          Expense
        </text>
        <text x="60" y="120" textAnchor="middle" fill="currentColor" stroke="none" opacity="0.6" fontSize="9">
          amount · currency
        </text>

        {/* Per-currency buckets */}
        {[
          { y: 30, label: "USD ledger" },
          { y: 90, label: "INR ledger" },
          { y: 150, label: "EUR ledger" },
        ].map((row) => (
          <g key={row.label}>
            <rect x="140" y={row.y} width="100" height="40" rx="6" />
            <text x="190" y={row.y + 22} textAnchor="middle" fill="currentColor" stroke="none">
              {row.label}
            </text>
          </g>
        ))}

        {/* Greedy simplification — highlighted */}
        <rect x="270" y="60" width="130" height="100" rx="6" stroke="hsl(var(--accent))" />
        <text x="335" y="80" textAnchor="middle" fill="hsl(var(--accent))" stroke="none">
          Greedy
        </text>
        <text x="335" y="94" textAnchor="middle" fill="hsl(var(--accent))" stroke="none">
          simplification
        </text>
        <text x="335" y="115" textAnchor="middle" fill="hsl(var(--accent))" stroke="none" opacity="0.7" fontSize="9">
          max-creditor
        </text>
        <text x="335" y="128" textAnchor="middle" fill="hsl(var(--accent))" stroke="none" opacity="0.7" fontSize="9">
          vs max-debtor
        </text>
        <text x="335" y="148" textAnchor="middle" fill="hsl(var(--accent))" stroke="none" opacity="0.7" fontSize="9">
          per currency only
        </text>

        {/* Settlement */}
        <rect x="420" y="60" width="50" height="40" rx="6" />
        <text x="445" y="76" textAnchor="middle" fill="currentColor" stroke="none">
          Propose
        </text>
        <text x="445" y="90" textAnchor="middle" fill="currentColor" stroke="none" opacity="0.6" fontSize="9">
          debtor
        </text>

        <rect x="420" y="120" width="50" height="40" rx="6" />
        <text x="445" y="136" textAnchor="middle" fill="currentColor" stroke="none">
          Accept
        </text>
        <text x="445" y="150" textAnchor="middle" fill="currentColor" stroke="none" opacity="0.6" fontSize="9">
          creditor
        </text>

        {/* Arrows */}
        <path d="M110 100 L140 50" markerEnd="url(#arr-bs)" />
        <path d="M110 110 L140 110" markerEnd="url(#arr-bs)" />
        <path d="M110 120 L140 170" markerEnd="url(#arr-bs)" />

        <path d="M240 50 L270 90" markerEnd="url(#arr-bs)" />
        <path d="M240 110 L270 110" markerEnd="url(#arr-bs)" />
        <path d="M240 170 L270 130" markerEnd="url(#arr-bs)" />

        <path d="M400 95 L420 80" markerEnd="url(#arr-bs)" />
        <path d="M400 125 L420 140" markerEnd="url(#arr-bs)" />

        {/* Approval loop arrow */}
        <path d="M420 145 L405 145 L405 75 L420 75" strokeDasharray="3 3" markerEnd="url(#arr-bs)" opacity="0.5" />
        <text x="395" y="115" textAnchor="end" fill="currentColor" stroke="none" opacity="0.5" fontSize="9">
          approval
        </text>
      </g>
    </svg>
  );
}
