import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { type User, type Session } from "@supabase/supabase-js";
import { supabase } from "../config/supabase";
import { logout as _logout } from "../services/authService";

// ─── Types ─────────────────────────────────────────────────
/**
 * Represents the core authentication state stored in the React Context.
 */
interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
}

interface AuthContextValue extends AuthState {
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

// ─── Context ───────────────────────────────────────────────
/**
 * Create a data store which name AuthContext for saving authentication state, include parameters from AuthState anf logout, refreshSession
 * Initialized with `null` as the default value before the Provider mounts.
 */
const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ──────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  /**
 * Initializes the unified authentication state with safe default values.
 * `loading` starts as true because the app must immediately check for existing sessions.
 */
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    initialized: false,
  });

 /**
   * Handles side effects on component mount.
   * 1. Fetches any existing local session (e.g., from LocalStorage).
   * 2. Establishes a persistent real-time listener for authentication state changes.
   */
  useEffect(() => {
    // 1. Fetch current active session asynchronously from storage on application startup (if it exist)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState({
        user: session?.user ?? null,
        session: session ?? null,
        loading: false,
        initialized: true,
      });
    });

    // 2. Persistent real-time listener for authentication state changes. Wenn user login/register, the state would be changed
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState((prev) => ({
        ...prev,
        user: session?.user ?? null,
        session: session ?? null,
        loading: false,
      }));
    });

    return () => subscription.unsubscribe(); // When AuthProvider not render anymore (when user close/stop/reload the app, redirect), the subscribtion real-time listener for authentication state changes will be stopped
  }, []);

  const logout = useCallback(async () => {
    await _logout();
  }, []);

  const refreshSession = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.refreshSession();
    setState((prev) => ({
      ...prev,
      user: session?.user ?? null,
      session: session ?? null,
    }));
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, logout, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
