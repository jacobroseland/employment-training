import './ApplicationCard.css'
import type { JobApplication } from '../JobSearchPipeline.types'
import { workArrangementLabels } from '../JobSearchPipeline.types'

type ApplicationCardProps = {
  application: JobApplication
  isDeleteConfirmationVisible: boolean
  onDeleteCancel: () => void
  onDeleteConfirm: () => void
  onDeleteRequest: () => void
  onEdit: (application: JobApplication) => void
}

function formatDate(date: string | null) {
  if (!date) {
    return null
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`))
}

function formatStatus(status: JobApplication['status']) {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function ApplicationCard({
  application,
  isDeleteConfirmationVisible,
  onDeleteCancel,
  onDeleteConfirm,
  onDeleteRequest,
  onEdit,
}: ApplicationCardProps) {
  const appliedDate = formatDate(application.dateApplied)
  const followUpDate = formatDate(application.nextFollowUpDate)

  return (
    <article className="application-card">
      <header className="application-card-header">
        <div>
          <h3>{application.companyName}</h3>

          <p className="application-card-role">{application.roleTitle}</p>
        </div>

        <span
          className={`application-card-status application-card-status--${application.status}`}
        >
          {formatStatus(application.status)}
        </span>
      </header>

      <dl className="application-card-details">
        <div>
          <dt>Work arrangement</dt>
          <dd>{workArrangementLabels[application.workArrangement]}</dd>
        </div>

        {application.location && (
          <div>
            <dt>Location</dt>
            <dd>{application.location}</dd>
          </div>
        )}

        <div>
          <dt>Date applied</dt>
          <dd>{appliedDate ?? 'Not yet applied'}</dd>
        </div>

        {followUpDate && (
          <div>
            <dt>Next follow-up</dt>
            <dd>{followUpDate}</dd>
          </div>
        )}
      </dl>

      {application.notes && (
        <p className="application-card-notes">{application.notes}</p>
      )}

      <div className="application-card-actions">
        {isDeleteConfirmationVisible ? (
          <div
            className="application-card-delete-confirmation"
            role="group"
            aria-label={`Delete ${application.companyName} confirmation`}
          >
            <span>Delete {application.companyName}?</span>

            <button
              type="button"
              className="application-card-delete-confirm"
              onClick={onDeleteConfirm}
            >
              Confirm delete
            </button>

            <button
              type="button"
              className="application-card-delete-cancel"
              onClick={onDeleteCancel}
            >
              Keep application
            </button>
          </div>
        ) : (
          <>
            <button
              type="button"
              className="application-card-edit"
              onClick={() => onEdit(application)}
            >
              Edit {application.companyName}
            </button>

            <button
              type="button"
              className="application-card-delete"
              onClick={onDeleteRequest}
            >
              Delete {application.companyName}
            </button>

            {application.jobUrl && (
              <a
                href={application.jobUrl}
                target="_blank"
                rel="noreferrer"
                className="application-card-link"
              >
                View job listing
              </a>
            )}
          </>
        )}
      </div>
    </article>
  )
}

export default ApplicationCard
