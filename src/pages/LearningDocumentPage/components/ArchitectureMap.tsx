import './ArchitectureMap.css'

type ArchitectureNeed = {
  id: string
  need: string
  technologies: string[]
  outcome: string
  boundary: string
}

const userJourney = [
  {
    step: '01',
    title: 'Explore',
    detail: 'Browse public exercises and learning material.',
  },
  {
    step: '02',
    title: 'Sign in',
    detail: 'Create a private workspace for personal tools.',
  },
  {
    step: '03',
    title: 'Organize',
    detail: 'Create, edit, filter, and save job applications.',
  },
  {
    step: '04',
    title: 'Accelerate',
    detail: 'Turn pasted job details into an editable AI draft.',
  },
]

const architectureNeeds: ArchitectureNeed[] = [
  {
    id: 'experience',
    need: 'Build a clear browser experience',
    technologies: ['React', 'TypeScript', 'React Router', 'Scoped CSS'],
    outcome:
      'Route-based pages, self-contained exercises, accessible controls, and responsive layouts.',
    boundary: 'Runs in the browser',
  },
  {
    id: 'identity',
    need: 'Keep personal data private',
    technologies: ['Supabase Auth', 'Postgres', 'Row Level Security'],
    outcome:
      'A signed-in user can access only their own job applications and installed-app choices.',
    boundary: 'Hosted Supabase',
  },
  {
    id: 'ai',
    need: 'Turn unstructured listings into usable drafts',
    technologies: ['Express', 'Zod', 'Ollama', 'Structured output'],
    outcome:
      'Pasted job details become validated, editable form suggestions instead of automatic records.',
    boundary: 'Local machine only',
  },
  {
    id: 'delivery',
    need: 'Ship confidently and repeatably',
    technologies: [
      'Jest',
      'Supertest',
      'Playwright',
      'Storybook',
      'GitHub Actions',
      'Vercel',
    ],
    outcome:
      'Changes are checked at component, API, browser, and build levels before production deployment.',
    boundary: 'GitHub and Vercel',
  },
]

function ArchitectureMap() {
  return (
    <section
      className="architecture-map"
      aria-labelledby="architecture-map-title"
    >
      <div className="architecture-map__intro">
        <p className="architecture-map__eyebrow">System map</p>
        <h3 id="architecture-map-title">From user need to working system</h3>
        <p>
          Each layer has one job: deliver a helpful experience, protect private
          data, assist with AI locally, and ship changes with confidence.
        </p>
      </div>

      <section
        className="architecture-map__journey"
        aria-labelledby="user-journey-title"
      >
        <div className="architecture-map__section-heading">
          <p className="architecture-map__eyebrow">User workflow</p>
          <h4 id="user-journey-title">How a person moves through the app</h4>
        </div>

        <ol className="architecture-map__journey-list">
          {userJourney.map((journeyStep) => (
            <li
              key={journeyStep.step}
              className="architecture-map__journey-step"
            >
              <span aria-hidden="true">{journeyStep.step}</span>
              <div>
                <h5>{journeyStep.title}</h5>
                <p>{journeyStep.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="need-map-title">
        <div className="architecture-map__section-heading">
          <p className="architecture-map__eyebrow">
            Need → technology → outcome
          </p>
          <h4 id="need-map-title">Why each layer exists</h4>
        </div>

        <ul className="architecture-map__need-list">
          {architectureNeeds.map((architectureNeed) => (
            <li
              key={architectureNeed.id}
              className={`architecture-map__need architecture-map__need--${architectureNeed.id}`}
            >
              <article>
                <p className="architecture-map__need-label">Need</p>
                <h5>{architectureNeed.need}</h5>

                <p className="architecture-map__need-label">Technology</p>
                <ul className="architecture-map__technology-list">
                  {architectureNeed.technologies.map((technology) => (
                    <li key={technology}>{technology}</li>
                  ))}
                </ul>

                <p className="architecture-map__need-label">Achievement</p>
                <p>{architectureNeed.outcome}</p>

                <p className="architecture-map__boundary">
                  {architectureNeed.boundary}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section
        className="architecture-map__runtime"
        aria-labelledby="runtime-flow-title"
      >
        <div className="architecture-map__section-heading">
          <p className="architecture-map__eyebrow">Runtime flow</p>
          <h4 id="runtime-flow-title">Where requests go today</h4>
        </div>

        <div
          className="architecture-map__flow"
          aria-label="Application runtime flow"
        >
          <div className="architecture-map__flow-card">
            <strong>Browser</strong>
            <span>React UI + Router</span>
          </div>
          <span className="architecture-map__flow-arrow" aria-hidden="true">
            →
          </span>
          <div className="architecture-map__flow-card">
            <strong>Supabase</strong>
            <span>Auth + protected data</span>
          </div>
          <span className="architecture-map__flow-branch" aria-hidden="true">
            +
          </span>
          <div className="architecture-map__flow-card architecture-map__flow-card--local">
            <strong>Local AI</strong>
            <span>Vite → Express → Ollama</span>
          </div>
        </div>

        <p className="architecture-map__runtime-note">
          The browser talks to hosted Supabase for identity and private data.
          The AI branch stays local until we introduce an authenticated hosted
          endpoint and server-side provider key.
        </p>
      </section>
    </section>
  )
}

export default ArchitectureMap
