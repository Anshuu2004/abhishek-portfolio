export function CodeHealArch() {
  return (
    <svg
      viewBox="0 0 480 220"
      className="h-auto w-full"
      aria-label="CodeHeal — GitHub OAuth, repo selection, parallel Gemini analysis of 10 files concurrently, patches committed to a new branch via Octokit"
      role="img"
    >
      <defs>
        <marker
          id="arr-ch"
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
        {/* GitHub OAuth */}
        <rect x="10" y="90" width="100" height="32" rx="6" />
        <text x="60" y="110" textAnchor="middle" fill="currentColor" stroke="none">
          GitHub OAuth
        </text>

        {/* JWT + encrypted token */}
        <rect x="130" y="90" width="110" height="32" rx="6" />
        <text x="185" y="106" textAnchor="middle" fill="currentColor" stroke="none">
          JWT session
        </text>
        <text x="185" y="118" textAnchor="middle" fill="currentColor" stroke="none" opacity="0.6" fontSize="9">
          AES-256-GCM token
        </text>

        {/* Parallel Gemini analysis — highlighted */}
        <rect x="260" y="30" width="130" height="32" rx="6" stroke="hsl(var(--accent))" />
        <text x="325" y="46" textAnchor="middle" fill="hsl(var(--accent))" stroke="none">
          Gemini analysis
        </text>
        <text x="325" y="58" textAnchor="middle" fill="hsl(var(--accent))" stroke="none" opacity="0.7" fontSize="9">
          10 files in parallel
        </text>

        <rect x="260" y="90" width="130" height="32" rx="6" stroke="hsl(var(--accent))" />
        <text x="325" y="110" textAnchor="middle" fill="hsl(var(--accent))" stroke="none">
          Gemini analysis
        </text>

        <rect x="260" y="150" width="130" height="32" rx="6" stroke="hsl(var(--accent))" />
        <text x="325" y="166" textAnchor="middle" fill="hsl(var(--accent))" stroke="none">
          Gemini analysis
        </text>
        <text x="325" y="178" textAnchor="middle" fill="hsl(var(--accent))" stroke="none" opacity="0.7" fontSize="9">
          ...up to 10 concurrent
        </text>

        {/* Octokit → new branch */}
        <rect x="400" y="90" width="70" height="32" rx="6" />
        <text x="435" y="106" textAnchor="middle" fill="currentColor" stroke="none">
          Octokit
        </text>
        <text x="435" y="118" textAnchor="middle" fill="currentColor" stroke="none" opacity="0.6" fontSize="9">
          new branch
        </text>

        {/* Arrows */}
        <path d="M110 106 L130 106" markerEnd="url(#arr-ch)" />
        <path d="M240 100 L260 50" markerEnd="url(#arr-ch)" />
        <path d="M240 106 L260 106" markerEnd="url(#arr-ch)" />
        <path d="M240 112 L260 162" markerEnd="url(#arr-ch)" />
        <path d="M390 50 L400 100" markerEnd="url(#arr-ch)" />
        <path d="M390 106 L400 106" markerEnd="url(#arr-ch)" />
        <path d="M390 162 L400 112" markerEnd="url(#arr-ch)" />
      </g>
    </svg>
  );
}
