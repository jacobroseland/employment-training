import './ApplicationForm.css'
import type { ApplicationFormValues } from '../JobSearchPipeline.types'
import {
  jobStatusOptions,
  workArrangementOptions,
} from '../JobSearchPipeline.types'
import { useState } from 'react'

type ApplicationFormProps = {
  values: ApplicationFormValues
  onClear: () => void
  onSubmit: (values: ApplicationFormValues) => void
  onValueChange: (field: keyof ApplicationFormValues, value: string) => void
  secondaryActionLabel: string
  submitLabel: string
}

type ApplicationFormErrors = Partial<
  Record<'companyName' | 'roleTitle' | 'jobUrl', string>
>

function isValidJobUrl(value: string) {
  try {
    const url = new URL(value)

    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

function ApplicationForm({
  values,
  onClear,
  onSubmit,
  onValueChange,
  secondaryActionLabel,
  submitLabel,
}: ApplicationFormProps) {
  const [errors, setErrors] = useState<ApplicationFormErrors>({})

  function updateFormValue(field: keyof ApplicationFormValues, value: string) {
    onValueChange(field, value)

    if (
      field === 'companyName' ||
      field === 'roleTitle' ||
      field === 'jobUrl'
    ) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [field]: undefined,
      }))
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors: ApplicationFormErrors = {}

    if (!values.companyName.trim()) {
      nextErrors.companyName = 'Enter a company name.'
    }

    if (!values.roleTitle.trim()) {
      nextErrors.roleTitle = 'Enter a role title.'
    }

    if (values.jobUrl && !isValidJobUrl(values.jobUrl.trim())) {
      nextErrors.jobUrl = 'Enter a valid HTTP or HTTPS URL.'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    onSubmit({
      ...values,
      companyName: values.companyName.trim(),
      roleTitle: values.roleTitle.trim(),
      location: values.location.trim(),
      jobUrl: values.jobUrl.trim(),
      notes: values.notes.trim(),
    })

    setErrors({})
  }

  function handleClear() {
    onClear()
    setErrors({})
  }

  return (
    <form className="application-form" noValidate onSubmit={handleSubmit}>
      <div className="application-form-grid">
        <label className="application-form-field" htmlFor="company-name">
          <span>
            Company name <span aria-hidden="true">*</span>
          </span>

          <input
            aria-describedby={
              errors.companyName ? 'company-name-error' : undefined
            }
            aria-invalid={Boolean(errors.companyName)}
            id="company-name"
            name="companyName"
            required
            type="text"
            value={values.companyName}
            onChange={(event) =>
              updateFormValue('companyName', event.target.value)
            }
          />

          {errors.companyName ? (
            <span
              id="company-name-error"
              className="application-form-error"
              role="alert"
            >
              {errors.companyName}
            </span>
          ) : null}
        </label>

        <label className="application-form-field" htmlFor="role-title">
          <span>
            Role title <span aria-hidden="true">*</span>
          </span>

          <input
            aria-describedby={errors.roleTitle ? 'role-title-error' : undefined}
            aria-invalid={Boolean(errors.roleTitle)}
            id="role-title"
            name="roleTitle"
            required
            type="text"
            value={values.roleTitle}
            onChange={(event) =>
              updateFormValue('roleTitle', event.target.value)
            }
          />

          {errors.roleTitle ? (
            <span
              id="role-title-error"
              className="application-form-error"
              role="alert"
            >
              {errors.roleTitle}
            </span>
          ) : null}
        </label>

        <label className="application-form-field" htmlFor="application-status">
          <span>Status</span>

          <select
            id="application-status"
            name="status"
            value={values.status}
            onChange={(event) => updateFormValue('status', event.target.value)}
          >
            {jobStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="application-form-field" htmlFor="work-arrangement">
          <span>Work arrangement</span>

          <select
            id="work-arrangement"
            name="workArrangement"
            value={values.workArrangement}
            onChange={(event) =>
              updateFormValue('workArrangement', event.target.value)
            }
          >
            {workArrangementOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label
          className="application-form-field"
          htmlFor="application-location"
        >
          <span>Location</span>

          <input
            id="application-location"
            name="location"
            type="text"
            value={values.location}
            onChange={(event) =>
              updateFormValue('location', event.target.value)
            }
          />
        </label>

        <label className="application-form-field" htmlFor="job-listing-url">
          <span>Job listing URL</span>

          <input
            aria-describedby={errors.jobUrl ? 'job-url-error' : undefined}
            aria-invalid={Boolean(errors.jobUrl)}
            id="job-listing-url"
            name="jobUrl"
            type="url"
            value={values.jobUrl}
            onChange={(event) => updateFormValue('jobUrl', event.target.value)}
          />

          {errors.jobUrl ? (
            <span
              id="job-url-error"
              className="application-form-error"
              role="alert"
            >
              {errors.jobUrl}
            </span>
          ) : null}
        </label>

        <label className="application-form-field" htmlFor="date-applied">
          <span>Date applied</span>

          <input
            id="date-applied"
            name="dateApplied"
            type="date"
            value={values.dateApplied}
            onChange={(event) =>
              updateFormValue('dateApplied', event.target.value)
            }
          />
        </label>

        <label className="application-form-field" htmlFor="next-follow-up-date">
          <span>Next follow-up date</span>

          <input
            id="next-follow-up-date"
            name="nextFollowUpDate"
            type="date"
            value={values.nextFollowUpDate}
            onChange={(event) =>
              updateFormValue('nextFollowUpDate', event.target.value)
            }
          />
        </label>

        <label
          className="application-form-field application-form-field--full-width"
          htmlFor="application-notes"
        >
          <span>Notes</span>

          <textarea
            id="application-notes"
            name="notes"
            rows={4}
            value={values.notes}
            onChange={(event) => updateFormValue('notes', event.target.value)}
          />
        </label>
      </div>

      <div className="application-form-actions">
        <button type="submit">{submitLabel}</button>
        <button
          type="button"
          className="application-form-clear"
          onClick={handleClear}
        >
          {secondaryActionLabel}
        </button>
      </div>
    </form>
  )
}

export default ApplicationForm
