import type { ApplicationDraft } from '../src/exercises/JobSearchPipeline/ApplicationDraft.contract.ts'
import { getApplicationDraft } from './applicationDraft.ts'
import express from 'express'
import { z } from 'zod'

const applicationDraftRequestSchema = z.object({
  jobDescription: z.string().trim().min(1).max(20_000),
})

export type ApplicationDraftGenerator = (
  jobDescription: string,
) => Promise<ApplicationDraft>

function getExplicitDraftHints(
  jobDescription: string,
): Partial<Pick<ApplicationDraft, 'companyName' | 'roleTitle'>> {
  const headerLines = jobDescription
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 2)

  return headerLines.reduce<
    Partial<Pick<ApplicationDraft, 'companyName' | 'roleTitle'>>
  >((hints, line) => {
    const companyMatch = line.match(/^(?:company|company name)\s*:\s*(.+)$/i)
    const roleMatch = line.match(/^(?:role|role title|title)\s*:\s*(.+)$/i)

    if (companyMatch) {
      hints.companyName = companyMatch[1].trim()
    }

    if (roleMatch) {
      hints.roleTitle = roleMatch[1].trim()
    }

    return hints
  }, {})
}

export function createApplicationDraftApp(
  generateDraft: ApplicationDraftGenerator = getApplicationDraft,
) {
  const app = express()

  app.use(express.json({ limit: '100kb' }))

  app.post('/api/application-draft', async (request, response) => {
    const requestData = applicationDraftRequestSchema.safeParse(request.body)

    if (!requestData.success) {
      response.status(400).json({
        error: 'Provide a job description with up to 20,000 characters.',
      })
      return
    }

    try {
      const jobDescription = requestData.data.jobDescription
      const draft = await generateDraft(jobDescription)

      response.json({
        draft: {
          ...draft,
          ...getExplicitDraftHints(jobDescription),
        },
      })
    } catch (error) {
      console.error('Unable to generate an application draft:', error)

      response.status(502).json({
        error: 'Unable to generate a draft right now. Try again.',
      })
    }
  })

  return app
}
