import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../routes/routes'
import { saveAuraSelection } from '../services/authService'
import { CharacterIllustration, Sparkles, Spinner } from '../components/illusttration'

// ─── Aura data ─────────────────────────────────────────────
interface Aura {
  id:       string
  name:     string
  subtitle: string
  emoji:    string
  desc:     string
  bestFor: string
  tags:     string[]
  variant:  'default' | 'healer' | 'mentor' | 'sunshine'
  gradient: string
  accent:   string
  textColor:string
}

const AURAS: Aura[] = [
  {
    id: 'healer',
    name: 'HEALER',
    subtitle: 'The Peony 🌸',
    emoji: '🌸',
    desc: "Need a warm hug in digital form? I’m here to listen to your heart without any judgment. Whether you're having a rough day or just need someone to hold space for your feelings, I’ll be your soft place to land. Let’s take care of your soul (and your skin) together.",
    bestFor: "When you're stressed, feeling sensitive, or just need a gentle reminder that you're doing great.",
    tags: ['Soft', 'Empathic', 'Safe Space'],
    variant: 'healer',
    gradient: 'linear-gradient(160deg, #FDEAF4 0%, #EDE8FA 100%)', 
    accent: '#C45C86',
    textColor: '#8A3B5D',
  },
  {
    id: 'sunshine',
    name: 'SUNSHINE',
    subtitle: 'The Sunflower 🌻',
    emoji: '🌻',
    desc: "Your ultimate hype girl has arrived! No cap, I’m here to keep your energy 10/10. I’ll keep you slay with the best fit checks and quick glow-up tips. Life’s too short for mid vibes—let’s spill the tea and turn every day into a main character moment!",
    bestFor: "When you need a confidence boost, a distraction, or someone to hype up your outfit for the day.",
    tags: ['High-Energy', 'Gen Z', 'Hype Girl'],
    variant: 'sunshine',
    gradient: 'linear-gradient(160deg, #FFF0D8 0%, #FDDACB 100%)', 
    accent: '#D47A44',
    textColor: '#A04D1B',
  },
  {
    id: 'mentor',
    name: 'MENTOR',
    subtitle: 'The Hydrangea 🌿',
    emoji: '🌿',
    desc: "Think of me as your cool big sister. I’m here to help you untangle the chaos and find your focus. I offer practical advice, deep insights into your wellness, and timeless style tips. Let’s build a version of you that’s composed, chic, and completely in control.",
    bestFor: "When you’re overwhelmed, need a logical perspective, or want to understand the 'why' behind your health and habits.",
    tags: ['Wise', 'Mature', 'Grounded'],
    variant: 'mentor',
    gradient: 'linear-gradient(160deg, #DCF5E8 0%, #CDEEFF 100%)', 
    accent: '#3FA870',
    textColor: '#1B6B40',
  }
]

// ─── Component ─────────────────────────────────────────────
export default function AuraSelection() {
  const navigate       = useNavigate()
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [animDir, setAnimDir]   = useState<'left' | 'right'>('right')

  const aura = AURAS[current]

  const goTo = useCallback((idx: number, dir: 'left' | 'right') => {
    setAnimDir(dir)
    setCurrent(idx)
    setConfirming(false)
  }, [])

  function goPrev() {
    if (current > 0) goTo(current - 1, 'left')
  }

  function goNext() {
    if (current < AURAS.length - 1) goTo(current + 1, 'right')
  }

  async function handleStart() {
    setLoading(true)
    try {
      await saveAuraSelection(aura.id)
    } catch {
      // saveAuraSelection may fail if profile table not set up yet — still proceed
    } finally {
      navigate(ROUTES.HOME, { replace: true })
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
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: aura.accent }}>
          Choose your
        </p>
        <h1 className="font-display font-black text-2xl" style={{ color: aura.textColor }}>
          AURA {aura.emoji}
        </h1>
      </div>

      {/* Carousel */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 gap-4">

        {/* Navigation arrows */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-between px-3 z-20">
          <button
            onClick={goPrev}
            disabled={current === 0}
            className="w-9 h-9 rounded-full glass-card flex items-center justify-center text-base font-bold transition-all hover:scale-110 active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed"
            style={{ color: aura.accent }}
          >
            ‹
          </button>
          <button
            onClick={goNext}
            disabled={current === AURAS.length - 1}
            className="w-9 h-9 rounded-full glass-card flex items-center justify-center text-base font-bold transition-all hover:scale-110 active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed"
            style={{ color: aura.accent }}
          >
            ›
          </button>
        </div>

        {/* Character */}
        <div
          key={`char-${current}-${animDir}`}
          className={`w-44 h-52 ${animDir === 'right' ? 'animate-carousel-in' : 'animate-fade-in'} animation-fill-both`}
        >
          <CharacterIllustration variant={aura.variant} animate />
        </div>

        {/* Name badge */}
        <div
          key={`name-${current}`}
          className="text-center animate-bounce-soft animation-fill-both animation-delay-100"
        >
          <div
            className="inline-block px-6 py-1.5 rounded-full mb-1 font-display font-black text-xl tracking-widest"
            style={{ background: `${aura.accent}22`, color: aura.textColor }}
          >
            {aura.name}
          </div>
          <p className="text-sm font-medium" style={{ color: `${aura.textColor}99` }}>
            {aura.subtitle}
          </p>
        </div>

        {/* Dots */}
        <div className="flex gap-2">
          {AURAS.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > current ? 'right' : 'left')}
              className="transition-all duration-300 rounded-full"
              style={{
                width:  i === current ? '20px' : '8px',
                height: '8px',
                background: i === current ? aura.accent : `${aura.accent}44`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Info card + CTA */}
      <div className="relative z-10 mx-4 mb-8 animate-slide-in animation-fill-both animation-delay-200">
        <div className="glass-card p-5">

          {/* Description */}
          <p
            key={`desc-${current}`}
            className="text-sm font-body leading-relaxed text-center mb-4 animate-fade-in animation-fill-both"
            style={{ color: aura.textColor }}
          >
            {aura.desc}
          </p>

          {/* Tags */}
          <div
            key={`tags-${current}`}
            className="flex flex-wrap gap-2 justify-center mb-5 animate-fade-in animation-fill-both animation-delay-100"
          >
            {aura.tags.map(tag => (
              <span
                key={tag}
                className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{ background: `${aura.accent}18`, color: aura.accent }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Confirm / Start button */}
          {!confirming ? (
            <button
              onClick={() => setConfirming(true)}
              className="btn-primary w-full py-3.5"
              style={{
                background: `linear-gradient(135deg, ${aura.accent}, ${aura.accent}bb)`,
              }}
            >
              Choose {aura.name} {aura.emoji}
            </button>
          ) : (
            <div className="flex flex-col gap-2 animate-bounce-soft animation-fill-both">
              <p className="text-center text-xs font-semibold mb-1" style={{ color: aura.textColor }}>
                Are you sure? {aura.emoji} You can always change later!
              </p>
              <button
                onClick={handleStart}
                disabled={loading}
                className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-70"
                style={{
                  background: `linear-gradient(135deg, ${aura.accent}, ${aura.accent}cc)`,
                }}
              >
                {loading ? <><Spinner /> Starting...</> : `Yes! Start with ${aura.name} ✨`}
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="btn-ghost w-full py-3 text-sm"
                style={{ borderColor: `${aura.accent}44`, color: aura.accent }}
              >
                Let me choose again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}