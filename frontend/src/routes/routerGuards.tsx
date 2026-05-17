import { Navigate, useLocation } from "react-router-dom";
import { type ReactNode } from "react";
import { useAuth } from "../hooks";

// ─── Protected Route: requires auth ───────────────────────
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, initialized } = useAuth();
  const location = useLocation();

  if (!initialized) return <LoadingScreen />;
  if (!user) return <Navigate to="/" state={{ from: location }} replace />;
  return <>{children}</>;
}

// ─── Public Route: redirect to home if already authed ─────
export function PublicRoute({ children }: { children: ReactNode }) {
  const { initialized } = useAuth();

  if (!initialized) return <LoadingScreen />;
  // Don't redirect splash; let other public pages redirect if authed
  return <>{children}</>;
}

// ─── Loading screen while auth initialize, keep user waiting ────────────────
function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-3">
        <span className="text-4xl animate-float">🌸</span>
        <p className="text-sm font-semibold text-aura-pink-dark animate-pulse-soft">
          Loading...
        </p>
      </div>
    </div>
  );
}
