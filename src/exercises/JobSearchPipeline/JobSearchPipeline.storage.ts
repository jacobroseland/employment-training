import type {
  JobApplication,
  JobStatus,
  WorkArrangement,
} from './JobSearchPipeline.types'

const applicationsStorageKey = 'job-search-pipeline-applications'

const jobStatuses: JobStatus[] = [
  'saved',
  'applied',
  'interviewing',
  'offer',
  'closed',
]

const workArrangements: WorkArrangement[] = ['remote', 'hybrid', 'on-site']

function isNullableString(value: unknown): value is string | null {
  return typeof value === 'string' || value === null
}

function isJobApplication(value: unknown): value is JobApplication {
  if (!value || typeof value !== 'object') {
    return false
  }

  const application = value as Record<string, unknown>

  return (
    typeof application.id === 'string' &&
    typeof application.companyName === 'string' &&
    typeof application.roleTitle === 'string' &&
    typeof application.createdAt === 'string' &&
    jobStatuses.includes(application.status as JobStatus) &&
    workArrangements.includes(application.workArrangement as WorkArrangement) &&
    isNullableString(application.location) &&
    isNullableString(application.jobUrl) &&
    isNullableString(application.dateApplied) &&
    isNullableString(application.nextFollowUpDate) &&
    isNullableString(application.notes)
  )
}

export function loadApplications(
  fallbackApplications: JobApplication[],
): JobApplication[] {
  const savedApplications = localStorage.getItem(applicationsStorageKey)

  if (!savedApplications) {
    return fallbackApplications
  }

  try {
    const parsedApplications: unknown = JSON.parse(savedApplications)

    if (
      Array.isArray(parsedApplications) &&
      parsedApplications.every(isJobApplication)
    ) {
      return parsedApplications
    }
  } catch {
    // Ignore invalid or outdated browser data and use the sample applications.
  }

  return fallbackApplications
}

export function saveApplications(applications: JobApplication[]) {
  localStorage.setItem(applicationsStorageKey, JSON.stringify(applications))
}
