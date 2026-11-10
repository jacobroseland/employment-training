import type { Database } from '../../lib/database.types'
import { getSupabaseClient } from '../../lib/supabaseClient'
import type {
  ApplicationFormValues,
  JobApplication,
  JobStatus,
  WorkArrangement,
} from './JobSearchPipeline.types'

type JobApplicationRow = Database['public']['Tables']['job_applications']['Row']

function toJobApplication(row: JobApplicationRow): JobApplication {
  return {
    id: row.id,
    companyName: row.company_name,
    roleTitle: row.role_title,
    status: row.status as JobStatus,
    workArrangement: row.work_arrangement as WorkArrangement,
    location: row.location,
    salaryRange: row.salary_range,
    jobUrl: row.job_url,
    dateApplied: row.date_applied,
    nextFollowUpDate: row.next_follow_up_date,
    notes: row.notes,
    createdAt: row.created_at,
  }
}

function toDatabaseDetails(values: ApplicationFormValues) {
  return {
    company_name: values.companyName,
    role_title: values.roleTitle,
    status: values.status,
    work_arrangement: values.workArrangement,
    location: values.location || null,
    salary_range: values.salaryRange || null,
    job_url: values.jobUrl || null,
    date_applied: values.dateApplied || null,
    next_follow_up_date: values.nextFollowUpDate || null,
    notes: values.notes || null,
  }
}

export async function loadJobApplications() {
  const { data, error } = await getSupabaseClient()
    .from('job_applications')
    .select()
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data.map(toJobApplication)
}

export async function createJobApplication(
  userId: string,
  values: ApplicationFormValues,
) {
  const { data, error } = await getSupabaseClient()
    .from('job_applications')
    .insert({ ...toDatabaseDetails(values), user_id: userId })
    .select()
    .single()

  if (error) {
    throw error
  }

  return toJobApplication(data)
}

export async function updateJobApplication(
  applicationId: string,
  values: ApplicationFormValues,
) {
  const { data, error } = await getSupabaseClient()
    .from('job_applications')
    .update(toDatabaseDetails(values))
    .eq('id', applicationId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return toJobApplication(data)
}

export async function deleteJobApplication(applicationId: string) {
  const { error } = await getSupabaseClient()
    .from('job_applications')
    .delete()
    .eq('id', applicationId)

  if (error) {
    throw error
  }
}
