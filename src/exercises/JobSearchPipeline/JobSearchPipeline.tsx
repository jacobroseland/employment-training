import './JobSearchPipeline.css'
import ApplicationCard from './components/ApplicationCard'
import ApplicationDraftPanel from './components/ApplicationDraftPanel'
import ApplicationForm from './components/ApplicationForm'
import { loadApplications, saveApplications } from './JobSearchPipeline.storage'
import type {
  ApplicationDraft,
  ApplicationFormValues,
  JobApplication,
} from './JobSearchPipeline.types'
import {
  emptyApplicationFormValues,
  jobStatusOptions,
} from './JobSearchPipeline.types'
import { useEffect, useRef, useState } from 'react'

const initialApplications: JobApplication[] = [
  {
    id: 'assured-staff-frontend-engineer',
    companyName: 'Assured',
    roleTitle: 'Staff Frontend Engineer',
    status: 'applied',
    workArrangement: 'remote',
    location: 'Remote - United States',
    jobUrl: 'https://www.assured.claims/',
    dateApplied: '2026-10-20',
    nextFollowUpDate: '2026-10-27',
    notes:
      'Modern insurance claims platform with a strong focus on frontend architecture, UX quality, and AI-assisted development.',
    createdAt: '2026-10-20T14:30:00.000Z',
  },
  {
    id: 'nexhealth-senior-software-engineer',
    companyName: 'NexHealth',
    roleTitle: 'Senior Software Engineer',
    status: 'saved',
    workArrangement: 'remote',
    location: 'Austin, TX',
    jobUrl: 'https://www.nexhealth.com/careers',
    dateApplied: null,
    nextFollowUpDate: null,
    notes:
      'Healthcare interoperability platform. The role spans React and TypeScript customer experiences with broader full-stack product work.',
    createdAt: '2026-10-22T16:15:00.000Z',
  },
  {
    id: 'owner-senior-software-engineer',
    companyName: 'Owner',
    roleTitle: 'Senior Software Engineer, RestX',
    status: 'interviewing',
    workArrangement: 'remote',
    location: 'Remote - United States or Canada',
    jobUrl: 'https://www.owner.com/',
    dateApplied: '2026-10-15',
    nextFollowUpDate: '2026-10-28',
    notes:
      'Restaurant operations software with React, Next.js, Node.js, TypeScript, PostgreSQL, and AI-native workflows.',
    createdAt: '2026-10-14T18:00:00.000Z',
  },
]

type StatusFilter = 'all' | JobApplication['status']

const statusOptions: { label: string; value: StatusFilter }[] = [
  { label: 'All statuses', value: 'all' },
  ...jobStatusOptions,
]

type SortOption = 'recently-added' | 'next-follow-up' | 'company-name'

const sortOptions: { label: string; value: SortOption }[] = [
  { label: 'Recently added', value: 'recently-added' },
  { label: 'Next follow-up', value: 'next-follow-up' },
  { label: 'Company name', value: 'company-name' },
]

function getFollowUpTime(date: string | null) {
  if (!date) {
    return Number.POSITIVE_INFINITY
  }

  return new Date(`${date}T00:00:00Z`).getTime()
}

function toOptionalValue(value: string) {
  return value || null
}

function toApplicationDetails(
  values: ApplicationFormValues,
): Omit<JobApplication, 'id' | 'createdAt'> {
  return {
    companyName: values.companyName,
    roleTitle: values.roleTitle,
    status: values.status,
    workArrangement: values.workArrangement,
    location: toOptionalValue(values.location),
    jobUrl: toOptionalValue(values.jobUrl),
    dateApplied: toOptionalValue(values.dateApplied),
    nextFollowUpDate: toOptionalValue(values.nextFollowUpDate),
    notes: toOptionalValue(values.notes),
  }
}

function createApplication(values: ApplicationFormValues): JobApplication {
  return {
    id: crypto.randomUUID(),
    ...toApplicationDetails(values),
    createdAt: new Date().toISOString(),
  }
}

function toFormValues(application: JobApplication): ApplicationFormValues {
  return {
    companyName: application.companyName,
    roleTitle: application.roleTitle,
    status: application.status,
    workArrangement: application.workArrangement,
    location: application.location ?? '',
    jobUrl: application.jobUrl ?? '',
    dateApplied: application.dateApplied ?? '',
    nextFollowUpDate: application.nextFollowUpDate ?? '',
    notes: application.notes ?? '',
  }
}

function JobSearchPipeline() {
  const [applications, setApplications] = useState(() =>
    loadApplications(initialApplications),
  )

  const [formValues, setFormValues] = useState(emptyApplicationFormValues)

  const [editingApplicationId, setEditingApplicationId] = useState<
    string | null
  >(null)

  const [pendingDeletionApplicationId, setPendingDeletionApplicationId] =
    useState<string | null>(null)

  const [isResetConfirmationVisible, setIsResetConfirmationVisible] =
    useState(false)

  const [isApplicationFormVisible, setIsApplicationFormVisible] =
    useState(false)

  const applicationFormSectionRef = useRef<HTMLElement>(null)

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const [sortOption, setSortOption] = useState<SortOption>('recently-added')

  const editingApplication = applications.find(
    (application) => application.id === editingApplicationId,
  )

  useEffect(() => {
    if (editingApplicationId && isApplicationFormVisible) {
      applicationFormSectionRef.current?.scrollIntoView?.({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, [editingApplicationId, isApplicationFormVisible])

  useEffect(() => {
    saveApplications(applications)
  }, [applications])

  const visibleApplications = applications.filter((application) => {
    return statusFilter === 'all' || application.status === statusFilter
  })

  const sortedApplications = [...visibleApplications].sort(
    (firstApplication, secondApplication) => {
      switch (sortOption) {
        case 'recently-added':
          return (
            new Date(secondApplication.createdAt).getTime() -
            new Date(firstApplication.createdAt).getTime()
          )

        case 'next-follow-up':
          return (
            getFollowUpTime(firstApplication.nextFollowUpDate) -
            getFollowUpTime(secondApplication.nextFollowUpDate)
          )

        case 'company-name':
          return firstApplication.companyName.localeCompare(
            secondApplication.companyName,
          )
      }
    },
  )

  function handleApplicationSubmit(values: ApplicationFormValues) {
    if (editingApplicationId) {
      setApplications((currentApplications) =>
        currentApplications.map((application) => {
          if (application.id !== editingApplicationId) {
            return application
          }

          return {
            ...application,
            ...toApplicationDetails(values),
          }
        }),
      )
    } else {
      setApplications((currentApplications) => [
        ...currentApplications,
        createApplication(values),
      ])
    }

    handleFormClear()
    setIsApplicationFormVisible(false)
  }

  function handleFormValueChange(
    field: keyof ApplicationFormValues,
    value: string,
  ) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }))
  }

  function handleUseDraft(draft: ApplicationDraft) {
    setFormValues({
      ...emptyApplicationFormValues,
      ...draft,
    })
    setEditingApplicationId(null)
    setIsApplicationFormVisible(true)
  }

  function handleFormClear() {
    setFormValues(emptyApplicationFormValues)

    if (editingApplicationId) {
      setEditingApplicationId(null)
      setIsApplicationFormVisible(false)
    }
  }

  function handleEditApplication(application: JobApplication) {
    setFormValues(toFormValues(application))
    setEditingApplicationId(application.id)
    setPendingDeletionApplicationId(null)
    setIsApplicationFormVisible(true)
  }

  function handleDeleteApplication(applicationId: string) {
    setApplications((currentApplications) =>
      currentApplications.filter(
        (application) => application.id !== applicationId,
      ),
    )

    if (editingApplicationId === applicationId) {
      handleFormClear()
    }

    setPendingDeletionApplicationId(null)
  }

  function handleResetSampleData() {
    setApplications(initialApplications)
    setPendingDeletionApplicationId(null)
    setIsResetConfirmationVisible(false)
  }

  return (
    <section
      className="job-search-pipeline"
      aria-labelledby="job-search-pipeline-heading"
    >
      <h2 id="job-search-pipeline-heading" className="exercise-title">
        Job Search Pipeline
      </h2>

      <div className="application-management-actions">
        <button
          className="application-form-toggle"
          type="button"
          aria-controls="application-form-panel"
          aria-expanded={isApplicationFormVisible}
          onClick={() => setIsApplicationFormVisible((isVisible) => !isVisible)}
        >
          {isApplicationFormVisible
            ? 'Hide application form'
            : editingApplication
              ? 'Resume editing application'
              : 'Add an application'}
        </button>

        {isResetConfirmationVisible ? (
          <div
            className="application-reset-confirmation"
            role="group"
            aria-label="Reset sample data confirmation"
          >
            <span>Replace saved applications with sample data?</span>

            <button
              type="button"
              className="application-reset-confirm"
              onClick={handleResetSampleData}
            >
              Confirm reset
            </button>

            <button
              type="button"
              className="application-reset-cancel"
              onClick={() => setIsResetConfirmationVisible(false)}
            >
              Keep saved applications
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="application-reset"
            onClick={() => setIsResetConfirmationVisible(true)}
          >
            Reset sample data
          </button>
        )}
      </div>

      <section
        ref={applicationFormSectionRef}
        id="application-form-panel"
        className="application-form-section"
        aria-labelledby="add-application-heading"
        hidden={!isApplicationFormVisible}
      >
        <h3 id="add-application-heading">
          {editingApplication ? 'Edit application' : 'New application'}
        </h3>

        {!editingApplication ? (
          <ApplicationDraftPanel onUseDraft={handleUseDraft} />
        ) : null}

        <ApplicationForm
          key={editingApplicationId ?? 'new-application'}
          values={formValues}
          onClear={handleFormClear}
          onSubmit={handleApplicationSubmit}
          onValueChange={handleFormValueChange}
          secondaryActionLabel={
            editingApplication ? 'Cancel edit' : 'Clear form'
          }
          submitLabel={editingApplication ? 'Save changes' : 'Save application'}
        />
      </section>

      <div className="application-filters">
        <label className="application-filter-label">
          <span>Filter by status</span>

          <span className="application-select-wrapper">
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as StatusFilter)
              }
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </span>
        </label>
        <label className="application-filter-label">
          <span>Sort by</span>

          <span className="application-select-wrapper">
            <select
              value={sortOption}
              onChange={(event) =>
                setSortOption(event.target.value as SortOption)
              }
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </span>
        </label>
      </div>

      <section
        className="application-list-section"
        aria-labelledby="tracked-applications-heading"
      >
        <h3 id="tracked-applications-heading">
          Tracked applications ({sortedApplications.length})
        </h3>

        {sortedApplications.length > 0 ? (
          <ul className="application-list">
            {sortedApplications.map((application) => (
              <li key={application.id}>
                <ApplicationCard
                  application={application}
                  isDeleteConfirmationVisible={
                    pendingDeletionApplicationId === application.id
                  }
                  onDeleteCancel={() => setPendingDeletionApplicationId(null)}
                  onDeleteConfirm={() =>
                    handleDeleteApplication(application.id)
                  }
                  onDeleteRequest={() =>
                    setPendingDeletionApplicationId(application.id)
                  }
                  onEdit={handleEditApplication}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="application-empty-state">
            No applications match the selected status.
          </p>
        )}
      </section>
    </section>
  )
}

export default JobSearchPipeline
