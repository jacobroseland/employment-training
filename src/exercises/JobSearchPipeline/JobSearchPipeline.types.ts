export type JobStatus =
  'saved' | 'applied' | 'interviewing' | 'offer' | 'closed'

export type WorkArrangement = 'remote' | 'hybrid' | 'on-site'

export const jobStatusOptions: { label: string; value: JobStatus }[] = [
  { label: 'Saved', value: 'saved' },
  { label: 'Applied', value: 'applied' },
  { label: 'Interviewing', value: 'interviewing' },
  { label: 'Offer', value: 'offer' },
  { label: 'Closed', value: 'closed' },
]

export const workArrangementOptions: {
  label: string
  value: WorkArrangement
}[] = [
  { label: 'Remote', value: 'remote' },
  { label: 'Hybrid', value: 'hybrid' },
  { label: 'On-site', value: 'on-site' },
]

export const workArrangementLabels: Record<WorkArrangement, string> = {
  remote: 'Remote',
  hybrid: 'Hybrid',
  'on-site': 'On-site',
}

export type JobApplication = {
  id: string
  companyName: string
  roleTitle: string
  status: JobStatus
  workArrangement: WorkArrangement
  location: string | null
  jobUrl: string | null
  dateApplied: string | null
  nextFollowUpDate: string | null
  notes: string | null
  createdAt: string
}

export type ApplicationFormValues = {
  companyName: string
  roleTitle: string
  status: JobStatus
  workArrangement: WorkArrangement
  location: string
  jobUrl: string
  dateApplied: string
  nextFollowUpDate: string
  notes: string
}

export type ApplicationDraft = Pick<
  ApplicationFormValues,
  | 'companyName'
  | 'roleTitle'
  | 'workArrangement'
  | 'location'
  | 'jobUrl'
  | 'notes'
>

export const emptyApplicationFormValues: ApplicationFormValues = {
  companyName: '',
  roleTitle: '',
  status: 'saved',
  workArrangement: 'remote',
  location: '',
  jobUrl: '',
  dateApplied: '',
  nextFollowUpDate: '',
  notes: '',
}
