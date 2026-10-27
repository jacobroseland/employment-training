import { generateApplicationDraft } from './ApplicationDraftService'
import { describe, expect, test } from '@jest/globals'

describe('generateApplicationDraft', () => {
  test('creates predictable practice drafts from job-description hints', async () => {
    const [hybridDraft, onSiteDraft, remoteDraft] = await Promise.all([
      generateApplicationDraft(
        'Hybrid role: https://example.com/jobs/hybrid-engineer',
      ),
      generateApplicationDraft('Onsite position'),
      generateApplicationDraft('Distributed team'),
    ])

    expect(hybridDraft).toMatchObject({
      companyName: 'Example Company',
      roleTitle: 'Senior Software Engineer',
      workArrangement: 'hybrid',
      jobUrl: 'https://example.com/jobs/hybrid-engineer',
    })
    expect(onSiteDraft.workArrangement).toBe('on-site')
    expect(remoteDraft).toMatchObject({
      workArrangement: 'remote',
      jobUrl: '',
    })
  })
})
