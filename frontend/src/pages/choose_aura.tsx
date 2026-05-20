import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes/routes";
import { saveAuraSelection } from "../services/authService";
import {
  CharacterIllustration,
  Sparkles,
  Spinner,
} from "../components/illusttration";

// ─── Aura data ─────────────────────────────────────────────
interface Aura {
  id: string;
  name: string;
  subtitle: string;
  emoji: string;
  desc: string;
  bestFor: string;
  tags: string[];
  variant: "default" | "healer" | "mentor" | "sunshine";
  gradient: string;
  accent: string;
  textColor: string;
}

const AURAS: Aura[] = [
  {
    id: "healer",
    name: "HEALER",
    subtitle: "The Peony 🌸",
    emoji: "🌸",
    desc: "Need a warm hug in digital form? I’m here to listen to your heart without any judgment. Whether you're having a rough day or just need someone to hold space for your feelings, I’ll be your soft place to land.",
    bestFor:
      "When you're stressed, feeling sensitive, or just need a gentle reminder that you're doing great.",
    tags: ["Soft", "Empathic", "Safe Space"],
    variant: "healer",
    gradient: "linear-gradient(160deg, #FFF7FA 0%, #FFE5EC 30%)",
    accent: "#C45C86",
    textColor: "#8A3B5D",
  },
  {
    id: "sunshine",
    name: "SUNSHINE",
    subtitle: "The Sunflower 🌻",
    emoji: "🌻",
    desc: "Your ultimate hype girl has arrived! I’m here to keep your energy 10/10. Let’s spill the tea and turn every day into a good moment!",
    bestFor:
      "When you need a confidence boost, a distraction, or simple someone to hype up your outfit for the day.",
    tags: ["High-Energy", "Hype Girl"],
    variant: "sunshine",
    gradient: "linear-gradient(160deg, #FFF8EE 0%, #FDDACB 100%)",
    accent: "#D47A44",
    textColor: "#A04D1B",
  },
  {
    id: "mentor",
    name: "MENTOR",
    subtitle: "The Lavender 🪻",
    emoji: "🪻",
    desc: "Think of me as your cool big sister. I’m here to help you untangle the chaos and find your focus. I offer practical advice, deep insights into your wellness, and timeless style tips. Let’s build a version of you that’s composed, chic, and completely in control.",
    bestFor:
      "When you’re overwhelmed, need a logical perspective, or want to understand the 'why' behind your health and habits.",
    tags: ["Wise", "Mature", "Grounded"],
    variant: "mentor",
    gradient: "linear-gradient(160deg, #F9F6FF 0%, #E7DDFF 100%)",
    accent: "#7A5EA7",
    textColor: "#4A375F",
  },
];

export default function AuraSelection() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [animDir, setAnimDir] = useState<"left" | "right">("right");
  
  const [isFlipped, setIsFlipped] = useState(false);

  const aura = AURAS[current];

  const goTo = useCallback((idx: number, dir: "left" | "right") => {
    setAnimDir(dir);
    setCurrent(idx);
    setConfirming(false);
    setIsFlipped(false); // Reset flip state when changing aura
  }, []);

  function goPrev() {
    if (current > 0) goTo(current - 1, "left");
  }

  function goNext() {
    if (current < AURAS.length - 1) goTo(current + 1, "right");
  }

  async function handleStart() {
    setLoading(true);
    try {
      await saveAuraSelection(aura.id);
    } catch {
    } finally {
      navigate(ROUTES.HOME, { replace: true });
    }
  }

  return (
    <div
      className="relative flex flex-col h-full overflow-hidden transition-all duration-700"
      style={{ background: aura.gradient }}
    >
      <Sparkles />

      {/* Header */}
      <div className="relative z-10 text-center pt-12 pb-2 animate-fade-up animation-fill-both">
        <p
          className="text-xs font-semibold tracking-widest uppercase mb-1"
          style={{ color: aura.accent }}
        >
          Choose your
        </p>
        <h1
          className="font-display font-black text-2xl"
          style={{ color: aura.textColor }}
        >
          AURA {aura.emoji}
        </h1>
      </div>

      {/* Center Area: 3D Flip Card */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 perspective-1000">
        
        {/* Navigation Buttons */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-between px-2 z-20 pointer-events-none">
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            disabled={current === 0}
            className="w-9 h-9 rounded-full glass-card flex items-center justify-center text-base font-bold transition-all hover:scale-110 active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed pointer-events-auto"
            style={{ color: aura.accent }}
          >
            ‹
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            disabled={current === AURAS.length - 1}
            className="w-9 h-9 rounded-full glass-card flex items-center justify-center text-base font-bold transition-all hover:scale-110 active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed pointer-events-auto"
            style={{ color: aura.accent }}
          >
            ›
          </button>
        </div>

        {/* FLIP CARD */}
        <div 
          onClick={() => setIsFlipped(!isFlipped)}
          className={`relative w-full max-w-[320px] h-95 cursor-pointer transform-style-3d transition-transform duration-700 ${isFlipped ? "rotate-y-180" : ""}`}
        >
          
          {/* FRONT SIDE: Character illustration and name */}
          <div className="absolute inset-0 glass-card p-6 flex flex-col items-center justify-center backface-hidden border border-white/40 shadow-xl rounded-3xl mt-10 ">
            {/* Character Illustration */}
            <div
              key={`char-${current}-${animDir}`}
              className={`w-70 h-48 ${animDir === "right" ? "animate-carousel-in" : "animate-fade-in"} animation-fill-both mb-70 rounded-2xl ` }
            >
              <CharacterIllustration variant={aura.variant} animate rounded-6xl />
            </div>

            <span className="text-[11px] font-medium tracking-wide uppercase opacity-60 animate-bounce -mt-15" style={{ color: aura.accent }}>
              Tap to see details
            </span>
          </div>

          {/* BACK SIDE: Information panel */}
          <div className="absolute inset-0 glass-card p-6 flex flex-col items-center justify-center backface-hidden rotate-y-180 border border-white/50 shadow-xl rounded-6xl bg-white/40 backdrop-blur-md">
            <span className="text-2xl mb-2">{aura.emoji}</span>
            <h3 className="font-display font-black text-lg mb-3 tracking-wide" style={{ color: aura.textColor }}>
              ABOUT {aura.name}
            </h3>
            
            {/* Description */}
            <p className="text-xs font-body leading-relaxed text-center overflow-y-auto max-h-[140px] mb-4 px-2" style={{ color: aura.textColor }}>
              {aura.desc}
            </p>

            {/* Best for */}
            <div className="text-center bg-white/30 rounded-xl p-2.5 mb-4 border border-white/20">
              <span className="text-[10px] font-bold uppercase tracking-wider block mb-0.5" style={{ color: aura.accent }}>Best For:</span>
              <p className="text-[11px] font-medium leading-normal" style={{ color: aura.textColor }}>{aura.bestFor}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 justify-center mt-auto">
              {aura.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full"
                  style={{ background: `${aura.accent}22`, color: aura.accent }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Name & Subtitle */}
        <div key={`name-${current}`} className="text-center">
          <div
            className="inline-block px-5 py-1 rounded-full font-display font-black text-lg tracking-widest mt-20"
            style={{ background: `${aura.accent}22`, color: aura.textColor }}
          >
            {aura.name}
          </div>
          <p className="text-xs font-medium mb-4" style={{ color: `${aura.textColor}99` }}>
            {aura.subtitle}
          </p>
        </div>

        {/* Dot Indicators */}
        <div className="flex gap-2 -mb-5">
          {AURAS.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); goTo(i, i > current ? "right" : "left"); }}
              className="transition-all duration-300 rounded-full h-2"
              style={{
                width: i === current ? "20px" : "8px",
                background: i === current ? aura.accent : `${aura.accent}44`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Button to confirm selection */}
      <div className="relative z-10 mx-4 mb-8 pb-10">
        <button
          onClick={() => setConfirming(true)}
          className="btn-primary w-full py-3.5 shadow-lg font-bold"
          style={{
            background: `linear-gradient(135deg, ${aura.accent}, ${aura.accent}bb)`,
          }}
        >
          Choose {aura.name}
        </button>
      </div>

      {confirming && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6 animate-fade-in">
          <div 
            className="absolute inset-0 bg-black/10 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setConfirming(false)} 
          />
    
          {/* Confirmation Modal */}
          <div 
            className="relative z-10 flex flex-col gap-4 bg-white/90 p-6 rounded-[28px] shadow-2xl border border-gray-100 w-full max-w-sm text-center animate-scale-up "          
          >
            <div className="text-4xl mb-1">{aura.emoji}</div>
            
            <p className="text-xs font-bold leading-relaxed" style={{ color: aura.textColor }}>
              Are you sure?<br />
              <span className="font-medium opacity-70 block mt-1">You can always change this later!</span>
            </p>

            <button
              onClick={handleStart}
              disabled={loading}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 font-bold shadow-md text-sm rounded-xl"
              style={{
                background: `linear-gradient(135deg, ${aura.accent}, ${aura.accent}cc)`,
              }}
            >
              {loading ? (
                <>
                  <Spinner /> Starting...
                </>
              ) : (
                `Yes! Start`
              )}
            </button>

            <button
              onClick={() => setConfirming(false)}
              className="btn-ghost w-full py-2.5 text-xs font-semibold border rounded-xl transition-all active:scale-95"
              style={{ borderColor: `${aura.accent}33`, color: aura.textColor }}
            >
              Let me choose again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}