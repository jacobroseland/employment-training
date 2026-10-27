import './ApplicationDraftPanel.css'
import { generateApplicationDraft } from '../ApplicationDraftService'
import type { ApplicationDraft } from '../JobSearchPipeline.types'
import { useState } from 'react'

type ApplicationDraftPanelProps = {
  onUseDraft: (draft: ApplicationDraft) => void
}

type DraftRequestStatus = 'idle' | 'loading' | 'success' | 'error'

function ApplicationDraftPanel({ onUseDraft }: ApplicationDraftPanelProps) {
  const [jobDescription, setJobDescription] = useState('')
  const [draft, setDraft] = useState<ApplicationDraft | null>(null)
  const [requestStatus, setRequestStatus] = useState<DraftRequestStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleGenerateDraft(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!jobDescription.trim()) {
      setDraft(null)
      setErrorMessage('Paste a job description before generating a draft.')
      setRequestStatus('error')
      return
    }

    setErrorMessage('')
    setRequestStatus('loading')

    try {
      const nextDraft = await generateApplicationDraft(jobDescription)

      setDraft(nextDraft)
      setRequestStatus('success')
    } catch {
      setDraft(null)
      setErrorMessage('Unable to generate a draft. Try again.')
      setRequestStatus('error')
    }
  }

  function handleUseDraft() {
    if (draft) {
      onUseDraft(draft)
    }
  }

  return (
    <details className="application-draft-panel">
      <summary>Draft from a job description</summary>

      <div className="application-draft-panel-content">
        <p>
          Paste a listing to practice an AI-assisted intake workflow. This local
          version returns an example draft, so review every value before saving.
        </p>

        <form onSubmit={handleGenerateDraft}>
          <label htmlFor="job-description">
            <span>Job description</span>

            <textarea
              aria-describedby={
                errorMessage ? 'job-description-error' : undefined
              }
              aria-invalid={Boolean(errorMessage)}
              id="job-description"
              name="jobDescription"
              rows={6}
              value={jobDescription}
              onChange={(event) => {
                setJobDescription(event.target.value)

                if (errorMessage) {
                  setErrorMessage('')
                  setRequestStatus('idle')
                }
              }}
            />
          </label>

          {errorMessage ? (
            <p
              id="job-description-error"
              className="application-draft-error"
              role="alert"
            >
              {errorMessage}
            </p>
          ) : null}

          <button type="submit" disabled={requestStatus === 'loading'}>
            {requestStatus === 'loading'
              ? 'Generating draft…'
              : 'Generate draft'}
          </button>
        </form>

        {requestStatus === 'loading' ? (
          <p className="application-draft-status" role="status">
            Reviewing the job description…
          </p>
        ) : null}

        {draft ? (
          <section
            className="application-draft-result"
            aria-labelledby="application-draft-result-heading"
          >
            <h4 id="application-draft-result-heading">Suggested details</h4>

            <dl>
              <div>
                <dt>Company</dt>
                <dd>{draft.companyName}</dd>
              </div>
              <div>
                <dt>Role</dt>
                <dd>{draft.roleTitle}</dd>
              </div>
              <div>
                <dt>Work arrangement</dt>
                <dd>{draft.workArrangement}</dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>{draft.location}</dd>
              </div>
            </dl>

            <button type="button" onClick={handleUseDraft}>
              Use this draft
            </button>
          </section>
        ) : null}
      </div>
    </details>
  )
}

export default ApplicationDraftPanel
