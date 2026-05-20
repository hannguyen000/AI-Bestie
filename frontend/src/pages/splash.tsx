import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes/routes";
import { CharacterIllustration, Sparkles, Spinner } from "../components/illusttration";
import { useAuth } from "../hooks";

export default function Splash() {
  const navigate = useNavigate();
  const { user, initialized } = useAuth();

  // Auto-redirect to Home if already logged in, otherwise stay on Splash
  useEffect(() => {
    if (!initialized) return;
    if (user) {
      navigate(ROUTES.HOME, { replace: true });
    }
  }, [user, initialized, navigate]);

  // While auth is initializing, show loading screen with cute message to keep user waiting
  if (!initialized) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-linear-to-br from-pink-50 via-blue-50 to-purple-50">
        <div className="w-8 h-8 text-aura-pink-dark mb-2">
          <Spinner />
        </div>
        <p className="text-xs font-semibold text-aura-pink-dark animate-pulse">
          Connecting with your AI Bestie... ✨
        </p>
      </div>
    );
  }

  // If not logged in, show splash screen with cute intro and CTA to login/register
  return (
    <div className="relative flex flex-col items-center justify-between min-h-198 h-full w-full px-8 pt-16 pb-12 overflow-hidden">
      {/* Background blobs */}
      <div
        className="absolute -top-20 -left-20 w-64 h-64 rounded-full opacity-40 animate-spin-slow"
        style={{
          background: "radial-gradient(circle, #F7C5D8, transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full opacity-40"
        style={{
          background: "radial-gradient(circle, #DDD5F7, transparent 70%)",
          animation: "float 5s ease-in-out infinite",
        }}
      />
      <div
        className="absolute top-1/2 -left-10 w-32 h-32 rounded-full opacity-25"
        style={{
          background: "radial-gradient(circle, #C8EDD8, transparent 70%)",
          animation: "float 3.5s ease-in-out infinite 1s",
        }}
      />

      <Sparkles />

      {/* Top: logo / tagline */}
      <div className="relative z-10 text-center animate-fade-up animation-fill-both -mt-6">
        <div className="inline-flex items-center gap-2 backdrop-blur-sm border border-white/60 rounded-full px-4 py-1.5 mb-5 -mt-16">
          <span className="text-sm">✨</span>
          <span className="text-xs font-semibold text-aura-pink-dark tracking-wide">
            Your AI Bestie
          </span>
        </div>
        <h1 className="font-display font-black text-4xl leading-tight mb-3">
          <span className="text-gradient-pink">How are you</span>
          <br />
          <span className="font-display font-black text-4xl text-aura-lav-dark">
            feeling today?
          </span>
        </h1>
        <p className="font-body text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
          Meet your AI companions — always here to listen, support, and cheer
          you on. 🌸
        </p>
      </div>

      {/* Character illustration */}
      <div className="relative z-10 w-50 h-60 animate-fade-in animation-fill-both animation-delay-200 mt-8">
        <CharacterIllustration variant="default" animate />

        {/* Floating mood pills */}
        <div
          className="absolute -left-13 top-12 z-20 glass-card px-3 py-1.5 animate-float animation-delay-300"
          style={{ animationDuration: "3.5s" }}
        >
          <span className="text-xs font-semibold text-aura-pink-dark">
            😊 Feeling good!
          </span>
        </div>
        <div
          className="absolute -right-10 bottom-10 z-20 glass-card px-3 py-1.5 animate-float animation-delay-500"
          style={{ animationDuration: "4s" }}
        >
          <span className="text-xs font-semibold text-aura-lav-dark">
            💭 Heavy heart...
          </span>
        </div>
        <div
          className="absolute -right-15 top-0 z-20 glass-card px-3 py-1.5 animate-float animation-delay-500"
          style={{ animationDuration: "4s" }}
        >
          <span className="text-xs font-semibold text-aura-lav-dark">
            🌱 Cozily quiet
          </span>
        </div>
      </div>
      

      {/* CTA buttons */}
      <div className="relative z-10 w-full flex flex-col gap-3 animate-fade-up animation-fill-both animation-delay-400">
        <button
          onClick={() => navigate(ROUTES.REGISTER)}
          className="btn-primary w-full text-base py-4 mb-10"
        >
          Start my journey ✨
        </button>
        <button
          onClick={() => navigate(ROUTES.LOGIN)}
          className="btn-ghost w-full text-base py-4 -mt-10 mb-30"
        >
          I already have an account
        </button>
      </div>

      {/* Bottom dots indicator */}
      <div className="absolute bottom-5 flex gap-1.5 ">
        <span className="w-5 h-1.5 rounded-full bg-aura-pink-dark" />
        <span className="w-1.5 h-1.5 rounded-full bg-aura-pink/50" />
        <span className="w-1.5 h-1.5 rounded-full bg-aura-pink/50" />
        <span className="w-1.5 h-1.5 rounded-full bg-aura-pink/50" />
      </div>
    </div>
  );
}