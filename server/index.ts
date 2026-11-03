import { generateApplicationDraft } from './applicationDraft.ts'
import express from 'express'
import { z } from 'zod'

const port = 8787

const applicationDraftRequestSchema = z.object({
  jobDescription: z.string().trim().min(1).max(20_000),
})

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
    const draft = await generateApplicationDraft(
      requestData.data.jobDescription,
    )

    response.json({ draft })
  } catch (error) {
    console.error('Unable to generate an application draft:', error)

    response.status(502).json({
      error: 'Unable to generate a draft right now. Try again.',
    })
  }
})

app.listen(port, () => {
  console.log(`Application draft API listening at http://127.0.0.1:${port}`)
})
