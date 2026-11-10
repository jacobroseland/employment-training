import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabaseClient'
import { AuthContext } from './authContext'
import type { User } from '@supabase/supabase-js'
import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return
    }

    const supabase = getSupabaseClient()
    let isCurrent = true

    void supabase.auth.getSession().then(({ data }) => {
      if (!isCurrent) {
        return
      }

      setUser(data.session?.user ?? null)
      setIsLoading(false)
    })

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        setIsLoading(false)
      },
    )

    return () => {
      isCurrent = false
      authListener.subscription.unsubscribe()
    }
  }, [])

  async function signOut() {
    if (!isSupabaseConfigured) {
      return
    }

    const { error } = await getSupabaseClient().auth.signOut()

    if (error) {
      throw error
    }
  }

  const value = useMemo(
    () => ({
      isConfigured: isSupabaseConfigured,
      isLoading,
      signOut,
      user,
    }),
    [isLoading, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
