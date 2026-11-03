import { z } from 'zod'

export const applicationDraftSchema = z.object({
  companyName: z.string(),
  roleTitle: z.string(),
  workArrangement: z.enum(['remote', 'hybrid', 'on-site']),
  location: z.string(),
  salaryRange: z.string(),
  jobUrl: z.string(),
  notes: z.string(),
})

export const applicationDraftResponseSchema = z.object({
  draft: applicationDraftSchema,
})

export type ApplicationDraft = z.infer<typeof applicationDraftSchema>
