import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { type User, type Session } from '@supabase/supabase-js'
import { supabase } from '../config/supabase'
import { logout as _logout } from '../services/authService'

// ─── Types ─────────────────────────────────────────────────
interface AuthState {
  user:        User | null
  session:     Session | null
  loading:     boolean
  initialized: boolean
}

interface AuthContextValue extends AuthState {
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
}

// ─── Context ───────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null)

// ─── Provider ──────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user:        null,
    session:     null,
    loading:     true,
    initialized: false,
  })

  // Initialize session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState({
        user:        session?.user ?? null,
        session:     session ?? null,
        loading:     false,
        initialized: true,
      })
    })

    // Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setState(prev => ({
          ...prev,
          user:    session?.user ?? null,
          session: session ?? null,
          loading: false,
        }))
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const logout = useCallback(async () => {
    await _logout()
  }, [])

  const refreshSession = useCallback(async () => {
    const { data: { session } } = await supabase.auth.refreshSession()
    setState(prev => ({
      ...prev,
      user:    session?.user ?? null,
      session: session ?? null,
    }))
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, logout, refreshSession }}>
      {children}
    </AuthContext.Provider>
  )
}

// ─── Hook ──────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}