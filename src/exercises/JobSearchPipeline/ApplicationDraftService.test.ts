import { generateApplicationDraft } from './ApplicationDraftService'
import {
  afterAll,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals'

const originalFetch = globalThis.fetch
const fetchMock = jest.fn<typeof fetch>()

beforeEach(() => {
  fetchMock.mockReset()
  globalThis.fetch = fetchMock as typeof fetch
})

afterAll(() => {
  globalThis.fetch = originalFetch
})

describe('generateApplicationDraft', () => {
  test('posts the description and returns a validated draft', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        draft: {
          companyName: 'Example Labs',
          roleTitle: 'Senior Frontend Engineer',
          workArrangement: 'hybrid',
          location: 'Austin, Texas',
          salaryRange: '$160,000–$190,000 annually',
          jobUrl: 'https://example.com/jobs/frontend-engineer',
          notes: '',
        },
      }),
    } as Response)

    await expect(
      generateApplicationDraft('Hybrid role at Example Labs'),
    ).resolves.toEqual({
      companyName: 'Example Labs',
      roleTitle: 'Senior Frontend Engineer',
      workArrangement: 'hybrid',
      location: 'Austin, Texas',
      salaryRange: '$160,000–$190,000 annually',
      jobUrl: 'https://example.com/jobs/frontend-engineer',
      notes: '',
    })

    expect(fetchMock).toHaveBeenCalledWith('/api/application-draft', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jobDescription: 'Hybrid role at Example Labs' }),
    })
  })

  test('throws when the API responds unsuccessfully', async () => {
    fetchMock.mockResolvedValue({ ok: false } as Response)

    await expect(generateApplicationDraft('Example listing')).rejects.toThrow(
      'Unable to generate a draft.',
    )
  })

  test('throws when the API draft does not match the expected contract', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        draft: {
          companyName: 'Example Labs',
        },
      }),
    } as Response)

    await expect(generateApplicationDraft('Example listing')).rejects.toThrow()
  })
})
