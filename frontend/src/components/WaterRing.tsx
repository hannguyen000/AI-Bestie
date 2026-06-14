import { Droplet } from "lucide-react";

export function WaterRing({ pct, className = "w-32 h-32 mx-auto" }: { pct: number; className?: string }) {
  const p = Math.max(0, Math.min(100, Math.round(pct)));
  const size = 150, stroke = 12, r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (p / 100) * c;

  return (
    <div className={`relative ${className}`}>
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full -rotate-90">
        {/* inner circle */}
        <circle cx={size / 2} cy={size / 2} r={r - stroke / 2} fill="#dbeafe" />
        {/* track */}
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e0f2fe" strokeWidth={stroke} />
        {/* progress */}
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke="#38bdf8" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      {/* content in the middle */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Droplet className="text-sky-400 fill-sky-200" size={26} />
        <span className="text-lg font-bold text-white mt-0.5">{p}%</span>
      </div>
    </div>
  );
}