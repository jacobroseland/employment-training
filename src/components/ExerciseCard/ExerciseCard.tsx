import './ExerciseCard.css'
import type { Exercise } from '../../exercises/exerciseCatalog'

type ExerciseCardProps = {
  exercise: Exercise
  onOpen?: (exerciseId: string) => void
  primaryAction?: {
    isDisabled?: boolean
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    isDisabled?: boolean
    label: string
    onClick: () => void
  }
}

function ExerciseCard({
  exercise,
  onOpen,
  primaryAction,
  secondaryAction,
}: ExerciseCardProps) {
  const action =
    primaryAction ??
    (onOpen
      ? {
          label: 'Open exercise',
          onClick: () => onOpen(exercise.id),
        }
      : undefined)

  return (
    <>
      <article className="exercise-card">
        <h3>{exercise.title}</h3>
        <p>{exercise.description}</p>
        <span className={`exercise-card-status ${exercise.status}`}>
          {exercise.status === 'available' ? 'Available' : 'Coming soon'}
        </span>

        {exercise.status === 'available' && action ? (
          <button
            className="open"
            type="button"
            aria-label={
              primaryAction
                ? `${action.label} ${exercise.title}`
                : `Open ${exercise.title} exercise`
            }
            disabled={action.isDisabled}
            onClick={action.onClick}
          >
            {action.label}
          </button>
        ) : null}

        {secondaryAction ? (
          <button
            className="secondary-action"
            type="button"
            disabled={secondaryAction.isDisabled}
            onClick={secondaryAction.onClick}
          >
            {secondaryAction.label}
          </button>
        ) : null}
      </article>
    </>
  )
}

export default ExerciseCard
