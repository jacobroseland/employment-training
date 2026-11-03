/** @jest-environment node */

import type { ApplicationDraft } from '../src/exercises/JobSearchPipeline/ApplicationDraft.contract.ts'
import { createApplicationDraftApp } from './applicationDraftApp.ts'
import { afterEach, describe, expect, jest, test } from '@jest/globals'
import request from 'supertest'

const modelDraft = {
  companyName: 'Model Company',
  roleTitle: 'Model Role',
  workArrangement: 'remote' as const,
  location: 'Remote - United States',
  salaryRange: '',
  jobUrl: '',
  notes: '',
}

const consoleErrorSpy = jest
  .spyOn(console, 'error')
  .mockImplementation(() => undefined)

afterEach(() => {
  consoleErrorSpy.mockClear()
})

describe('application draft API', () => {
  test('returns a draft generated from a valid job description', async () => {
    const generateDraft =
      jest.fn<(jobDescription: string) => Promise<ApplicationDraft>>()
    generateDraft.mockResolvedValue(modelDraft)
    const app = createApplicationDraftApp(generateDraft)

    const response = await request(app)
      .post('/api/application-draft')
      .send({ jobDescription: 'Remote frontend role at Example Labs.' })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ draft: modelDraft })
    expect(generateDraft).toHaveBeenCalledWith(
      'Remote frontend role at Example Labs.',
    )
  })

  test('uses explicit Company and Role headers instead of model guesses', async () => {
    const generateDraft =
      jest.fn<(jobDescription: string) => Promise<ApplicationDraft>>()
    generateDraft.mockResolvedValue(modelDraft)
    const app = createApplicationDraftApp(generateDraft)

    const response = await request(app).post('/api/application-draft').send({
      jobDescription:
        'Company: Angel Studios\nRole: Sr Front End Engineer\n\nRemote React role.',
    })

    expect(response.status).toBe(200)
    expect(response.body.draft).toMatchObject({
      companyName: 'Angel Studios',
      roleTitle: 'Sr Front End Engineer',
    })
  })

  test('rejects an empty job description before calling the model', async () => {
    const generateDraft =
      jest.fn<(jobDescription: string) => Promise<ApplicationDraft>>()
    const app = createApplicationDraftApp(generateDraft)

    const response = await request(app)
      .post('/api/application-draft')
      .send({ jobDescription: '   ' })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      error: 'Provide a job description with up to 20,000 characters.',
    })
    expect(generateDraft).not.toHaveBeenCalled()
  })

  test('returns a safe API error when the model request fails', async () => {
    const generateDraft =
      jest.fn<(jobDescription: string) => Promise<ApplicationDraft>>()
    generateDraft.mockRejectedValue(new Error('Ollama is unavailable.'))
    const app = createApplicationDraftApp(generateDraft)

    const response = await request(app)
      .post('/api/application-draft')
      .send({ jobDescription: 'Remote frontend role at Example Labs.' })

    expect(response.status).toBe(502)
    expect(response.body).toEqual({
      error: 'Unable to generate a draft right now. Try again.',
    })
    expect(consoleErrorSpy).toHaveBeenCalled()
  })
})
