import type {
  ApplicationDraft,
  WorkArrangement,
} from './JobSearchPipeline.types'

function getWorkArrangement(jobDescription: string): WorkArrangement {
  const normalizedDescription = jobDescription.toLowerCase()

  if (normalizedDescription.includes('hybrid')) {
    return 'hybrid'
  }

  if (
    normalizedDescription.includes('on-site') ||
    normalizedDescription.includes('onsite')
  ) {
    return 'on-site'
  }

  return 'remote'
}

function getJobUrl(jobDescription: string) {
  return jobDescription.match(/https?:\/\/[^\s)]+/)?.[0] ?? ''
}

export async function generateApplicationDraft(
  jobDescription: string,
): Promise<ApplicationDraft> {
  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, 400)
  })

  return {
    companyName: 'Example Company',
    roleTitle: 'Senior Software Engineer',
    workArrangement: getWorkArrangement(jobDescription),
    location: 'Remote - United States',
    jobUrl: getJobUrl(jobDescription),
    notes:
      'Practice-mode draft: review and replace these suggested details before saving.',
  }
}
