import CountryExplorer from './CountryExplorer/CountryExplorer'
import HelloWorld from './HelloWorld/HelloWorld'
import JobSearchPipeline from './JobSearchPipeline/JobSearchPipeline'
import type { ComponentType } from 'react'

export type ExerciseStatus = 'available' | 'coming-soon'

type BaseExercise = {
  id: string
  title: string
  description: string
}

type AvailableExercise = BaseExercise & {
  status: 'available'
  Component: ComponentType
}

type ComingSoonExercise = BaseExercise & {
  status: 'coming-soon'
  Component?: never
}

export type Exercise = AvailableExercise | ComingSoonExercise

export const exerciseCatalog: Exercise[] = [
  {
    id: 'hello-world',
    title: 'Hello, World!',
    description: 'Render your first React component.',
    status: 'available',
    Component: HelloWorld,
  },
  {
    id: 'personal-greeting',
    title: 'Personal Greeting',
    description: 'Use a typed prop to display a personalized message.',
    status: 'coming-soon',
  },
  {
    id: 'country-explorer',
    title: 'Country Explorer',
    description:
      'Search for countries, filter returned results by region, and expand a country for details such as capital, population, languages, and flag.',
    status: 'available',
    Component: CountryExplorer,
  },
  {
    id: 'job-search-pipeline',
    title: 'Job Search Pipeline',
    description:
      'Track applications, organize follow-ups, and manage each role through your job search.',
    status: 'available',
    Component: JobSearchPipeline,
  },
]
