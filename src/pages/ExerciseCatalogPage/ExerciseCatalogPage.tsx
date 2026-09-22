import ExerciseCard from '../../components/ExerciseCard/ExerciseCard'
import { exerciseCatalog } from '../../exercises/exerciseCatalog'
import { useNavigate } from 'react-router'

function ExerciseCatalogPage() {
  const navigate = useNavigate()

  const availableExercises = exerciseCatalog.filter(
    (exercise) => exercise.status === 'available',
  )

  const comingSoonExercises = exerciseCatalog.filter(
    (exercise) => exercise.status === 'coming-soon',
  )

  const orderedExercises = [...availableExercises, ...comingSoonExercises]

  function handleOpenExercise(exerciseId: string) {
    navigate(`/exercises/${exerciseId}`)
  }

  return (
    <section
      className="exercise-catalog"
      aria-labelledby="exercise-catalog-heading"
    >
      <h2 id="exercise-catalog-heading" className="exercise-title">
        Exercise Catalog
      </h2>

      <ul className="exercise-grid">
        {orderedExercises.map((exercise) => (
          <li key={exercise.id}>
            <ExerciseCard exercise={exercise} onOpen={handleOpenExercise} />
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ExerciseCatalogPage
