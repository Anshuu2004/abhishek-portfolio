export function AIQPGenArch() {
  return (
    <svg
      viewBox="0 0 480 240"
      className="h-auto w-full"
      aria-label="AI Question Paper Generator — user constraints + hierarchical question bank feed a Gemini fallback chain; output renders to PDF (WeasyPrint) and Word (python-docx)"
      role="img"
    >
      <defs>
        <marker
          id="arr-qp"
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
        {/* User constraints */}
        <rect x="10" y="20" width="120" height="40" rx="6" />
        <text x="70" y="36" textAnchor="middle" fill="currentColor" stroke="none">
          Constraints
        </text>
        <text x="70" y="50" textAnchor="middle" fill="currentColor" stroke="none" opacity="0.6" fontSize="9">
          board · class · marks
        </text>

        {/* Question bank */}
        <rect x="10" y="80" width="120" height="60" rx="6" />
        <text x="70" y="96" textAnchor="middle" fill="currentColor" stroke="none">
          Question bank
        </text>
        <text x="70" y="110" textAnchor="middle" fill="currentColor" stroke="none" opacity="0.6" fontSize="9">
          MySQL
        </text>
        <text x="70" y="124" textAnchor="middle" fill="currentColor" stroke="none" opacity="0.6" fontSize="9">
          Board → Class → Chapter
        </text>

        {/* Fallback chain (vertical stack) — highlighted */}
        {[
          { y: 20, label: "Gemini Flash" },
          { y: 60, label: "Gemini Pro" },
          { y: 100, label: "Gemini 2.0 Flash" },
          { y: 140, label: "Local DB" },
          { y: 180, label: "Placeholder" },
        ].map((row, i) => (
          <g key={row.label}>
            <rect
              x="180"
              y={row.y}
              width="130"
              height="28"
              rx="6"
              stroke={i === 0 ? "hsl(var(--accent))" : "currentColor"}
              opacity={1 - i * 0.12}
            />
            <text
              x="245"
              y={row.y + 18}
              textAnchor="middle"
              fill={i === 0 ? "hsl(var(--accent))" : "currentColor"}
              stroke="none"
              opacity={1 - i * 0.12}
            >
              {row.label}
            </text>
          </g>
        ))}

        {/* Fallback arrows (between models) */}
        <path d="M245 48 L245 60" strokeDasharray="3 3" markerEnd="url(#arr-qp)" opacity="0.5" />
        <path d="M245 88 L245 100" strokeDasharray="3 3" markerEnd="url(#arr-qp)" opacity="0.5" />
        <path d="M245 128 L245 140" strokeDasharray="3 3" markerEnd="url(#arr-qp)" opacity="0.5" />
        <path d="M245 168 L245 180" strokeDasharray="3 3" markerEnd="url(#arr-qp)" opacity="0.5" />

        <text x="320" y="118" fill="currentColor" stroke="none" opacity="0.5" fontSize="9">
          ↓ fallback
        </text>

        {/* Output: PDF + Word */}
        <rect x="360" y="60" width="110" height="32" rx="6" />
        <text x="415" y="76" textAnchor="middle" fill="currentColor" stroke="none">
          PDF
        </text>
        <text x="415" y="88" textAnchor="middle" fill="currentColor" stroke="none" opacity="0.6" fontSize="9">
          WeasyPrint
        </text>

        <rect x="360" y="120" width="110" height="32" rx="6" />
        <text x="415" y="136" textAnchor="middle" fill="currentColor" stroke="none">
          Word
        </text>
        <text x="415" y="148" textAnchor="middle" fill="currentColor" stroke="none" opacity="0.6" fontSize="9">
          python-docx · EN/HI
        </text>

        {/* Arrows */}
        <path d="M130 40 L180 30" markerEnd="url(#arr-qp)" />
        <path d="M130 110 L180 35" markerEnd="url(#arr-qp)" />
        <path d="M310 100 L360 76" markerEnd="url(#arr-qp)" />
        <path d="M310 105 L360 136" markerEnd="url(#arr-qp)" />
      </g>
    </svg>
  );
}
