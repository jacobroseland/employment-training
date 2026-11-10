import { getSupabaseClient } from './supabaseClient'

export async function loadInstalledAppIds() {
  const { data, error } = await getSupabaseClient()
    .from('user_app_installations')
    .select('app_id')

  if (error) {
    throw error
  }

  return data.map((installation) => installation.app_id)
}

export async function installApp(userId: string, appId: string) {
  const { error } = await getSupabaseClient()
    .from('user_app_installations')
    .insert({ app_id: appId, user_id: userId })

  if (error) {
    throw error
  }
}

export async function uninstallApp(appId: string) {
  const { error } = await getSupabaseClient()
    .from('user_app_installations')
    .delete()
    .eq('app_id', appId)

  if (error) {
    throw error
  }
}
