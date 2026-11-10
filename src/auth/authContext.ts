import type { User } from '@supabase/supabase-js'
import { createContext, useContext } from 'react'

export type AuthContextValue = {
  isConfigured: boolean
  isLoading: boolean
  signOut: () => Promise<void>
  user: User | null
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
)

export function useAuth() {
  const auth = useContext(AuthContext)

  if (!auth) {
    throw new Error('useAuth must be used inside an AuthProvider.')
  }

  return auth
}

export function useOptionalAuth() {
  return useContext(AuthContext)
}
