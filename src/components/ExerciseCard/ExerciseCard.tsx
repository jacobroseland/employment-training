import './ExerciseCard.css'
import type { Exercise } from '../../exercises/exerciseCatalog'

type ExerciseCardProps = {
  exercise: Exercise
  onOpen: (exerciseId: string) => void
}

function ExerciseCard({ exercise, onOpen }: ExerciseCardProps) {
  return (
    <>
      <article className="exercise-card">
        <h3>{exercise.title}</h3>
        <p>{exercise.description}</p>
        <span className={`exercise-card-status ${exercise.status}`}>
          {exercise.status === 'available' ? 'Available' : 'Coming soon'}
        </span>

        {exercise.status === 'available' && (
          <button
            className="open"
            type="button"
            aria-label={`Open ${exercise.title} exercise`}
            onClick={() => onOpen(exercise.id)}
          >
            Open exercise
          </button>
        )}
      </article>
    </>
  )
}

export default ExerciseCard
