import { useAuth } from '../../auth/authContext'
import ExerciseCard from '../../components/ExerciseCard/ExerciseCard'
import { exerciseCatalog } from '../../exercises/exerciseCatalog'
import {
  installApp,
  loadInstalledAppIds,
  uninstallApp,
} from '../../lib/appInstallations.repository'
import { isSupabaseConfigured } from '../../lib/supabaseClient'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

function ExerciseCatalogPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [installedAppIds, setInstalledAppIds] = useState<string[]>([])
  const [installationError, setInstallationError] = useState<string | null>(
    null,
  )
  const [pendingAppId, setPendingAppId] = useState<string | null>(null)

  const publicExercises = exerciseCatalog.filter(
    (exercise) =>
      exercise.status === 'available' && exercise.access === 'public',
  )

  const personalExercises = exerciseCatalog.filter(
    (exercise) =>
      exercise.status === 'available' && exercise.access === 'account-required',
  )

  const comingSoonExercises = exerciseCatalog.filter(
    (exercise) => exercise.status === 'coming-soon',
  )

  const installedPersonalExercises = personalExercises.filter((exercise) =>
    installedAppIds.includes(exercise.id),
  )

  const uninstalledPersonalExercises = personalExercises.filter(
    (exercise) => !installedAppIds.includes(exercise.id),
  )

  useEffect(() => {
    let isCurrent = true

    if (!isSupabaseConfigured || !user) {
      void Promise.resolve().then(() => {
        if (isCurrent) {
          setInstalledAppIds([])
        }
      })
      return
    }

    void loadInstalledAppIds()
      .then((appIds) => {
        if (isCurrent) {
          setInstalledAppIds(appIds)
        }
      })
      .catch(() => {
        if (isCurrent) {
          setInstallationError('Your installed apps could not be loaded.')
        }
      })

    return () => {
      isCurrent = false
    }
  }, [user])

  function handleOpenExercise(exerciseId: string) {
    navigate(`/exercises/${exerciseId}`)
  }

  async function handleInstall(exerciseId: string) {
    if (!user) {
      navigate('/account?returnTo=%2F')
      return
    }

    try {
      setInstallationError(null)
      setPendingAppId(exerciseId)
      await installApp(user.id, exerciseId)
      setInstalledAppIds((currentAppIds) => [...currentAppIds, exerciseId])
    } catch {
      setInstallationError('This app could not be installed. Please try again.')
    } finally {
      setPendingAppId(null)
    }
  }

  async function handleUninstall(exerciseId: string) {
    try {
      setInstallationError(null)
      setPendingAppId(exerciseId)
      await uninstallApp(exerciseId)
      setInstalledAppIds((currentAppIds) =>
        currentAppIds.filter((appId) => appId !== exerciseId),
      )
    } catch {
      setInstallationError('This app could not be removed. Please try again.')
    } finally {
      setPendingAppId(null)
    }
  }

  return (
    <section
      className="exercise-catalog"
      aria-labelledby="exercise-catalog-heading"
    >
      <h2 id="exercise-catalog-heading" className="exercise-title">
        Exercise Catalog
      </h2>

      <p className="exercise-catalog-intro">
        Explore public exercises or sign in to install personal tools with
        private data.
      </p>

      {isSupabaseConfigured && user ? (
        <section
          className="exercise-catalog-section"
          aria-labelledby="my-apps-heading"
        >
          <h3 id="my-apps-heading">My personal apps</h3>
          <p>Tools you have chosen to keep in your personal workspace.</p>

          {installedPersonalExercises.length > 0 ? (
            <ul className="exercise-grid">
              {installedPersonalExercises.map((exercise) => (
                <li key={exercise.id}>
                  <ExerciseCard
                    exercise={exercise}
                    primaryAction={{
                      label: 'Open app',
                      onClick: () => handleOpenExercise(exercise.id),
                    }}
                    secondaryAction={{
                      isDisabled: pendingAppId === exercise.id,
                      label:
                        pendingAppId === exercise.id
                          ? 'Removing…'
                          : 'Remove from my apps',
                      onClick: () => void handleUninstall(exercise.id),
                    }}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="exercise-catalog-empty-state">
              Install a personal app from Explore apps to add it here.
            </p>
          )}
        </section>
      ) : null}

      {installationError ? (
        <p className="exercise-catalog-error" role="alert">
          {installationError}
        </p>
      ) : null}

      <section
        className="exercise-catalog-section"
        aria-labelledby="explore-apps-heading"
      >
        <h3 id="explore-apps-heading">Explore apps</h3>
        <ul className="exercise-grid">
          {[
            ...publicExercises,
            ...uninstalledPersonalExercises,
            ...comingSoonExercises,
          ].map((exercise) => (
            <li key={exercise.id}>
              <ExerciseCard
                exercise={exercise}
                onOpen={handleOpenExercise}
                primaryAction={
                  exercise.status === 'available' &&
                  exercise.access === 'account-required'
                    ? {
                        isDisabled: pendingAppId === exercise.id,
                        label: user
                          ? pendingAppId === exercise.id
                            ? 'Installing…'
                            : 'Install app'
                          : 'Sign in to install',
                        onClick: () => void handleInstall(exercise.id),
                      }
                    : undefined
                }
              />
            </li>
          ))}
        </ul>
      </section>
    </section>
  )
}

export default ExerciseCatalogPage
