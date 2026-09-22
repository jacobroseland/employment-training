import { exerciseCatalog } from '../../exercises/exerciseCatalog'
import { Navigate, useParams } from 'react-router'

function ExercisePage() {
  const { exerciseId } = useParams()

  const exercise = exerciseCatalog.find(
    (catalogExercise) => catalogExercise.id === exerciseId,
  )

  if (!exercise || exercise.status !== 'available') {
    return <Navigate to="/" replace />
  }

  const ExerciseComponent = exercise.Component

  return <ExerciseComponent />
}

export default ExercisePage
