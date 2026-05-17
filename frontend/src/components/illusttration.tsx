import type { InputHTMLAttributes, ReactNode } from "react";

interface CharacterProps {
  variant?: "default" | "healer" | "mystic" | "solar" | "mentor" | "sunshine";
  className?: string;
  animate?: boolean;
}

// ─── Define glow colors for each character variant ───
const CHARACTER_GLOWS: Record<string, string> = {
  default: "#F7C5D8",
  healer: "#FFEAEC",
  mentor: "#DDD5F7",
  sunshine: "#FFF0A0",
};

// ─── Map character variants to their respective image URLs from Supabase Storage ───
const CHARACTER_IMAGES: Record<string, string> = {
  default:
    "https://ymivxyrrshkpyyrkndgu.supabase.co/storage/v1/object/public/user-avatars/default_avatar.png",
  healer:
    "https://ymivxyrrshkpyyrkndgu.supabase.co/storage/v1/object/public/system-assets/aura_healer.png",
  mentor:
    "https://ymivxyrrshkpyyrkndgu.supabase.co/storage/v1/object/public/system-assets/aura_mentor.png",
  mystic:
    "https://ymivxyrrshkpyyrkndgu.supabase.co/storage/v1/object/public/system-assets/aura_mentor.png", // Dùng tạm ảnh mentor hoặc linh vật riêng của bạn
  solar:
    "https://ymivxyrrshkpyyrkndgu.supabase.co/storage/v1/object/public/system-assets/aura_sunshine.png",
  sunshine:
    "https://ymivxyrrshkpyyrkndgu.supabase.co/storage/v1/object/public/system-assets/aura_sunshine.png",
};

export function CharacterIllustration({
  variant = "default",
  className = "",
  animate = true,
}: CharacterProps) {
  const glowColor = CHARACTER_GLOWS[variant] || CHARACTER_GLOWS.default;
  const imageUrl = CHARACTER_IMAGES[variant] || CHARACTER_IMAGES.default;

  return (
    <div
      className={`relative flex items-center justify-center ${animate ? "animate-float" : ""} ${className}`}
    >
      {/* 1. Glow effect */}
      <div
        className="absolute inset-0 rounded-full opacity-40 animate-pulse-soft"
        style={{
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
        }}
      />

      {/* 2. Image card fetched from Supabase Storage */}
      <img
        src={imageUrl}
        alt={`Aura character ${variant}`}
        className="relative z-10 w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.12)] transition-all duration-300"
      />
    </div>
  );
}

// ─── Decorative sparkle dots ───────────────────────────────
export function Sparkles() {
  return (
    <>
      <span
        className="sparkle text-xl"
        style={{ top: "8%", left: "10%", animationDelay: "0s" }}
      >
        ✦
      </span>
      <span
        className="sparkle text-sm"
        style={{ top: "15%", right: "12%", animationDelay: "0.6s" }}
      >
        ✦
      </span>
      <span
        className="sparkle text-lg"
        style={{ top: "70%", left: "8%", animationDelay: "1.1s" }}
      >
        ✦
      </span>
      <span
        className="sparkle text-xs"
        style={{ top: "80%", right: "15%", animationDelay: "0.3s" }}
      >
        ✦
      </span>
      <span
        className="sparkle text-base"
        style={{ top: "45%", right: "6%", animationDelay: "1.5s" }}
      >
        ✦
      </span>
    </>
  );
}

// ─── Input field with icon ──────────────────────────────────
interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  icon: ReactNode;
  label?: string;
}

export function InputField({
  icon,
  label,
  className = "",
  ...props
}: InputFieldProps) {
  return (
    <div className="relative group">
      {label && (
        <label className="block text-xs font-semibold text-aura-pink-dark/80 mb-1.5 ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-aura-pink-mid/70 group-focus-within:text-aura-lav-dark transition-colors duration-200 pointer-events-none">
          {icon}
        </span>
        <input className={`input-aura pl-11 ${className}`} {...props} />
      </div>
    </div>
  );
}

// ─── Error message ─────────────────────────────────────────
export function ErrorMessage({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5 animate-fade-in">
      <span className="text-red-400 text-sm">⚠</span>
      <p className="text-red-500 text-xs font-medium">{message}</p>
    </div>
  );
}

// ─── Loading spinner ───────────────────────────────────────
export function Spinner({
  size = 20,
  color = "#fff",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      className="animate-spin"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}
