import { useAuth } from '../../auth/authContext'
import { exerciseCatalog } from '../../exercises/exerciseCatalog'
import { Navigate, useLocation, useParams } from 'react-router'

function ExercisePage() {
  const { exerciseId } = useParams()
  const { isConfigured, isLoading, user } = useAuth()
  const location = useLocation()

  const exercise = exerciseCatalog.find(
    (catalogExercise) => catalogExercise.id === exerciseId,
  )

  if (!exercise || exercise.status !== 'available') {
    return <Navigate to="/" replace />
  }

  if (exercise.access === 'account-required' && isConfigured && isLoading) {
    return <p role="status">Checking your session…</p>
  }

  if (exercise.access === 'account-required' && isConfigured && !user) {
    return (
      <Navigate
        replace
        to={`/account?returnTo=${encodeURIComponent(location.pathname)}`}
      />
    )
  }

  const ExerciseComponent = exercise.Component

  return <ExerciseComponent />
}

export default ExercisePage
