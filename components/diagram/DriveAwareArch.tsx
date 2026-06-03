export function DriveAwareArch() {
  return (
    <svg
      viewBox="0 0 480 220"
      className="h-auto w-full"
      aria-label="DriveAware — webcam frame goes through face detection, then parallel head-pose and eye-state classification, then PERCLOS scoring and alert"
      role="img"
    >
      <defs>
        <marker
          id="arr-da"
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
        {/* Webcam frame */}
        <rect x="10" y="90" width="80" height="40" rx="6" />
        <text x="50" y="106" textAnchor="middle" fill="currentColor" stroke="none">
          Webcam
        </text>
        <text x="50" y="120" textAnchor="middle" fill="currentColor" stroke="none" opacity="0.6" fontSize="9">
          ~30 FPS
        </text>

        {/* Face detection */}
        <rect x="110" y="90" width="100" height="40" rx="6" />
        <text x="160" y="106" textAnchor="middle" fill="currentColor" stroke="none">
          Face detect
        </text>
        <text x="160" y="120" textAnchor="middle" fill="currentColor" stroke="none" opacity="0.6" fontSize="9">
          OpenVINO IR · FP16
        </text>

        {/* Parallel head-pose + eye-state — highlighted */}
        <rect x="230" y="30" width="110" height="40" rx="6" stroke="hsl(var(--accent))" />
        <text x="285" y="46" textAnchor="middle" fill="hsl(var(--accent))" stroke="none">
          Head pose
        </text>
        <text x="285" y="60" textAnchor="middle" fill="hsl(var(--accent))" stroke="none" opacity="0.7" fontSize="9">
          yaw / pitch / roll
        </text>

        <rect x="230" y="150" width="110" height="40" rx="6" stroke="hsl(var(--accent))" />
        <text x="285" y="166" textAnchor="middle" fill="hsl(var(--accent))" stroke="none">
          Eye classifier
        </text>
        <text x="285" y="180" textAnchor="middle" fill="hsl(var(--accent))" stroke="none" opacity="0.7" fontSize="9">
          open / closed
        </text>

        {/* Async API badge between */}
        <text
          x="285"
          y="115"
          textAnchor="middle"
          fill="currentColor"
          stroke="none"
          opacity="0.6"
          fontSize="9"
        >
          Async Inference API
        </text>
        <text
          x="285"
          y="128"
          textAnchor="middle"
          fill="currentColor"
          stroke="none"
          opacity="0.5"
          fontSize="9"
        >
          (parallel)
        </text>

        {/* PERCLOS + distraction scoring */}
        <rect x="360" y="60" width="110" height="40" rx="6" />
        <text x="415" y="76" textAnchor="middle" fill="currentColor" stroke="none">
          Distraction
        </text>
        <text x="415" y="90" textAnchor="middle" fill="currentColor" stroke="none" opacity="0.6" fontSize="9">
          head-pose flags
        </text>

        <rect x="360" y="120" width="110" height="40" rx="6" />
        <text x="415" y="136" textAnchor="middle" fill="currentColor" stroke="none">
          Drowsiness
        </text>
        <text x="415" y="150" textAnchor="middle" fill="currentColor" stroke="none" opacity="0.6" fontSize="9">
          PERCLOS + alert
        </text>

        {/* Arrows */}
        <path d="M90 110 L110 110" markerEnd="url(#arr-da)" />
        <path d="M210 105 L230 55" markerEnd="url(#arr-da)" />
        <path d="M210 115 L230 170" markerEnd="url(#arr-da)" />
        <path d="M340 50 L360 75" markerEnd="url(#arr-da)" />
        <path d="M340 170 L360 145" markerEnd="url(#arr-da)" />
      </g>
    </svg>
  );
}
