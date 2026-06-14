export function WaterBottle({ pct, className = "w-24 h-40 mx-auto" }: { pct: number; className?: string }) {
  const p = Math.max(0, Math.min(100, Math.round(pct)));
  const bodyTop = 30, bodyBottom = 200, bodyH = bodyBottom - bodyTop;
  const waterH = (p / 100) * bodyH;
  const waterY = bodyBottom - waterH;

  return (
    <svg viewBox="0 0 120 210" className={className}>
      <defs>
        <clipPath id="bottleClip">
          <rect x="28" y="30" width="64" height="170" rx="24" />
        </clipPath>
        <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
      </defs>

      {/* Water */}
      <g clipPath="url(#bottleClip)">
        <rect
          x="20" y={waterY} width="80" height={waterH} fill="url(#waterGrad)"
          style={{ transition: "y 0.6s ease, height 0.6s ease" }}
        />
        <ellipse
          cx="60" cy={waterY} rx="32" ry="4" fill="#bae6fd"
          opacity={p > 0 && p < 100 ? 0.8 : 0}
          style={{ transition: "cy 0.6s ease" }}
        />
      </g>

      {/* Bottle outline + cap */}
      <rect x="28" y="30" width="64" height="170" rx="24" fill="none" stroke="#cbd5e1" strokeWidth="3" />
      <rect x="48" y="18" width="24" height="16" rx="3" fill="#e2e8f0" />
      <rect x="44" y="8" width="32" height="12" rx="4" fill="#cbd5e1" />

      {/* % in the middle */}
      <text x="60" y="122" textAnchor="middle" fontSize="22" fontWeight="700"
            fill={p > 45 ? "#ffffff" : "#0ea5e9"}>{p}%</text>
    </svg>
  );
}