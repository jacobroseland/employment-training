import { applicationDraftResponseSchema } from './ApplicationDraft.contract'
import type { ApplicationDraft } from './JobSearchPipeline.types'

export async function generateApplicationDraft(
  jobDescription: string,
): Promise<ApplicationDraft> {
  const response = await fetch('/api/application-draft', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ jobDescription }),
  })

  if (!response.ok) {
    throw new Error('Unable to generate a draft.')
  }

  const responseData = applicationDraftResponseSchema.parse(
    await response.json(),
  )

  return responseData.draft
}
