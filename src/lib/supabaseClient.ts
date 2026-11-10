import type { Database } from './database.types'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY
let supabaseClient: SupabaseClient<Database> | undefined

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabasePublishableKey,
)

export function getSupabaseClient() {
  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      'Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY environment variables.',
    )
  }

  supabaseClient ??= createClient<Database>(supabaseUrl, supabasePublishableKey)

  return supabaseClient
}
