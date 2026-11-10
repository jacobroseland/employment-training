import type { Database } from '../../src/lib/database.types.ts'
import { createClient } from '@supabase/supabase-js'

type JobApplicationRow = Database['public']['Tables']['job_applications']['Row']

export type GraphQLViewer = {
  email: string | null
  id: string
}

export type GraphQLJobApplication = {
  companyName: string
  createdAt: string
  dateApplied: string | null
  id: string
  jobUrl: string | null
  location: string | null
  nextFollowUpDate: string | null
  notes: string | null
  roleTitle: string
  salaryRange: string | null
  status: string
  workArrangement: string
}

export type CreateGraphQLJobApplicationInput = {
  companyName: string
  dateApplied?: string | null
  jobUrl?: string | null
  location?: string | null
  nextFollowUpDate?: string | null
  notes?: string | null
  roleTitle: string
  salaryRange?: string | null
  status: string
  workArrangement: string
}

export type GraphQLDataSource = {
  createJobApplication: (
    accessToken: string,
    input: CreateGraphQLJobApplicationInput,
  ) => Promise<GraphQLJobApplication>
  getViewer: (accessToken: string) => Promise<GraphQLViewer | null>
  listJobApplications: (accessToken: string) => Promise<GraphQLJobApplication[]>
}

type SupabaseGraphQLDataSourceOptions = {
  publishableKey?: string
  supabaseUrl?: string
}

function toGraphQLJobApplication(
  application: JobApplicationRow,
): GraphQLJobApplication {
  return {
    companyName: application.company_name,
    createdAt: application.created_at,
    dateApplied: application.date_applied,
    id: application.id,
    jobUrl: application.job_url,
    location: application.location,
    nextFollowUpDate: application.next_follow_up_date,
    notes: application.notes,
    roleTitle: application.role_title,
    salaryRange: application.salary_range,
    status: application.status,
    workArrangement: application.work_arrangement,
  }
}

export function createSupabaseGraphQLDataSource(
  options: SupabaseGraphQLDataSourceOptions = {},
): GraphQLDataSource {
  const supabaseUrl = options.supabaseUrl ?? process.env.VITE_SUPABASE_URL
  const publishableKey =
    options.publishableKey ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY

  if (!supabaseUrl || !publishableKey) {
    throw new Error(
      'Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY for the GraphQL server.',
    )
  }

  const configuredSupabaseUrl = supabaseUrl
  const configuredPublishableKey = publishableKey

  function getAuthenticatedClient(accessToken: string) {
    return createClient<Database>(
      configuredSupabaseUrl,
      configuredPublishableKey,
      {
        global: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      },
    )
  }

  return {
    async createJobApplication(accessToken, input) {
      const supabase = getAuthenticatedClient(accessToken)
      const { data: userData, error: userError } = await supabase.auth.getUser()

      if (userError || !userData.user) {
        throw new Error('Sign in before creating a job application.')
      }

      const { data, error } = await supabase
        .from('job_applications')
        .insert({
          company_name: input.companyName,
          date_applied: input.dateApplied ?? null,
          job_url: input.jobUrl ?? null,
          location: input.location ?? null,
          next_follow_up_date: input.nextFollowUpDate ?? null,
          notes: input.notes ?? null,
          role_title: input.roleTitle,
          salary_range: input.salaryRange ?? null,
          status: input.status,
          user_id: userData.user.id,
          work_arrangement: input.workArrangement,
        })
        .select()
        .single()
        .returns<JobApplicationRow>()

      if (error) {
        throw error
      }

      return toGraphQLJobApplication(data)
    },
    async getViewer(accessToken) {
      const { data, error } =
        await getAuthenticatedClient(accessToken).auth.getUser()

      if (error || !data.user) {
        return null
      }

      return {
        email: data.user.email ?? null,
        id: data.user.id,
      }
    },
    async listJobApplications(accessToken) {
      const { data, error } = await getAuthenticatedClient(accessToken)
        .from('job_applications')
        .select()
        .order('created_at', { ascending: false })
        .returns<JobApplicationRow[]>()

      if (error) {
        throw error
      }

      return data.map(toGraphQLJobApplication)
    },
  }
}
