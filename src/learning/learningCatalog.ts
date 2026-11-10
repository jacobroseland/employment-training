import architectureOverview from '../../docs/architecture.md?raw'
import cssLayoutAndComponentStyling from '../../docs/learning/css-layout-and-component-styling.md?raw'
import dataFetchingAndUiStates from '../../docs/learning/data-fetching-and-ui-states.md?raw'
import exerciseTechnologyMap from '../../docs/learning/exercise-technology-map.md?raw'
import formsAndAccessibility from '../../docs/learning/forms-and-accessibility.md?raw'
import reactComponentPatterns from '../../docs/learning/react-component-patterns.md?raw'
import routing from '../../docs/learning/routing.md?raw'
import supabaseLocalDevelopment from '../../docs/learning/supabase-local-development.md?raw'
import testingAndApiMocking from '../../docs/learning/testing-and-api-mocking.md?raw'
import projectBootstrap from '../../docs/project-bootstrap/README.md?raw'

export type LearningDocument = {
  id: string
  title: string
  description: string
  content: string
}

export const learningCatalog: LearningDocument[] = [
  {
    id: 'exercise-technology-map',
    title: 'Exercise technology map',
    description:
      'A quick map of the technologies and engineering habits practiced in every exercise.',
    content: exerciseTechnologyMap,
  },
  {
    id: 'architecture-overview',
    title: 'Architecture overview',
    description:
      'How the browser app, Supabase, local AI service, GitHub Actions, and Vercel fit together.',
    content: architectureOverview,
  },
  {
    id: 'supabase-local-development',
    title: 'Supabase local development and migrations',
    description:
      'Local Postgres, schema migrations, authentication, Row Level Security, and hosted Supabase environments.',
    content: supabaseLocalDevelopment,
  },
  {
    id: 'react-component-patterns',
    title: 'React component patterns',
    description:
      'State ownership, component organization, shared types, and catalog-driven rendering.',
    content: reactComponentPatterns,
  },
  {
    id: 'forms-and-accessibility',
    title: 'Forms and accessibility',
    description:
      'Controlled inputs, validation, semantic HTML, and accessible status messages.',
    content: formsAndAccessibility,
  },
  {
    id: 'data-fetching-and-ui-states',
    title: 'Data fetching and UI states',
    description:
      'Fetching, response mapping, errors, loading states, and empty results.',
    content: dataFetchingAndUiStates,
  },
  {
    id: 'css-layout-and-component-styling',
    title: 'CSS layout and component styling',
    description:
      'Responsive grids, flexbox, CSS nesting, units, and component scoping.',
    content: cssLayoutAndComponentStyling,
  },
  {
    id: 'testing-and-api-mocking',
    title: 'Testing and API mocking',
    description:
      'The planned Jest, React Testing Library, Playwright, and MSW foundation.',
    content: testingAndApiMocking,
  },
  {
    id: 'routing',
    title: 'Routing',
    description:
      'The planned move from in-memory exercise selection to shareable URLs.',
    content: routing,
  },
  {
    id: 'project-bootstrap',
    title: 'Project bootstrap roadmap',
    description:
      'The platform roadmap: quality, design handoff, CI, deployment, and backend learning.',
    content: projectBootstrap,
  },
]
