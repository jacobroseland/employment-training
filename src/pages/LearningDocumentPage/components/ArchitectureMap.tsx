import './ArchitectureMap.css'

function ArchitectureMap() {
  return (
    <section
      className="architecture-map"
      aria-labelledby="architecture-map-title"
    >
      <div className="architecture-map__heading">
        <p>System architecture</p>
        <h3 id="architecture-map-title">Employment Training system map</h3>
        <span>
          Runtime boundaries, primary packages, quality checks, and deployment
        </span>
      </div>

      <figure className="architecture-map__figure">
        <svg
          className="architecture-map__diagram"
          viewBox="0 0 1280 1050"
          role="img"
          aria-labelledby="architecture-map-svg-title architecture-map-svg-description"
        >
          <title id="architecture-map-svg-title">
            Employment Training architecture
          </title>
          <desc id="architecture-map-svg-description">
            A technical architecture diagram that maps the React browser
            application, Supabase hosted services, local development services,
            test tooling, and the GitHub to Vercel delivery path.
          </desc>

          <defs>
            <marker
              id="architecture-arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
          </defs>

          <rect
            className="architecture-map__canvas"
            x="0"
            y="0"
            width="1280"
            height="1050"
            rx="20"
          />

          <g className="architecture-map__zone architecture-map__zone--client">
            <rect x="40" y="72" width="380" height="600" rx="14" />
            <text x="68" y="112">
              CLIENT · BROWSER
            </text>
            <text className="architecture-map__zone-subtitle" x="68" y="138">
              UI, routing, and browser-safe data access
            </text>
          </g>
          <g className="architecture-map__zone architecture-map__zone--cloud">
            <rect x="460" y="72" width="780" height="600" rx="14" />
            <text x="488" y="112">
              HOSTED PRODUCTION SERVICES
            </text>
            <text className="architecture-map__zone-subtitle" x="488" y="138">
              Identity, data ownership, and static frontend hosting
            </text>
          </g>
          <g className="architecture-map__zone architecture-map__zone--local">
            <rect x="40" y="712" width="760" height="290" rx="14" />
            <text x="68" y="752">
              LOCAL DEVELOPMENT ONLY
            </text>
            <text className="architecture-map__zone-subtitle" x="68" y="778">
              Developer tools, AI drafting, and GraphQL; not part of Vercel
            </text>
          </g>
          <g className="architecture-map__zone architecture-map__zone--delivery">
            <rect x="840" y="712" width="400" height="290" rx="14" />
            <text x="868" y="752">
              QUALITY AND DELIVERY
            </text>
            <text className="architecture-map__zone-subtitle" x="868" y="778">
              Automated verification before deployment
            </text>
          </g>

          <g className="architecture-map__node architecture-map__node--person">
            <rect x="80" y="190" width="125" height="88" rx="8" />
            <text x="142" y="226">
              User
            </text>
            <text className="architecture-map__node-detail" x="142" y="250">
              web browser
            </text>
          </g>
          <g className="architecture-map__node architecture-map__node--react">
            <rect x="235" y="185" width="145" height="110" rx="8" />
            <text x="307" y="215">
              React UI
            </text>
            <text className="architecture-map__node-detail" x="307" y="239">
              react + react-dom
            </text>
            <text className="architecture-map__node-detail" x="307" y="258">
              TypeScript + CSS
            </text>
            <text className="architecture-map__node-detail" x="307" y="277">
              react-router
            </text>
          </g>
          <g className="architecture-map__node architecture-map__node--content">
            <rect x="80" y="355" width="300" height="88" rx="8" />
            <text x="230" y="386">
              Learning Center
            </text>
            <text className="architecture-map__node-detail" x="230" y="411">
              react-markdown · repository docs
            </text>
          </g>
          <g className="architecture-map__node architecture-map__node--client-data">
            <rect x="80" y="510" width="300" height="88" rx="8" />
            <text x="230" y="541">
              Supabase browser client
            </text>
            <text className="architecture-map__node-detail" x="230" y="566">
              @supabase/supabase-js · sessions + data
            </text>
          </g>

          <g className="architecture-map__node architecture-map__node--auth">
            <rect x="500" y="190" width="175" height="88" rx="8" />
            <text x="587" y="221">
              Supabase Auth
            </text>
            <text className="architecture-map__node-detail" x="587" y="247">
              identity + session
            </text>
          </g>
          <g className="architecture-map__node architecture-map__node--api">
            <rect x="760" y="190" width="175" height="88" rx="8" />
            <text x="847" y="221">
              Supabase data API
            </text>
            <text className="architecture-map__node-detail" x="847" y="247">
              authenticated requests
            </text>
          </g>
          <g className="architecture-map__node architecture-map__node--data">
            <rect x="1020" y="190" width="175" height="88" rx="8" />
            <text x="1107" y="215">
              Postgres + RLS
            </text>
            <text className="architecture-map__node-detail" x="1107" y="239">
              applications + installs
            </text>
            <text className="architecture-map__node-detail" x="1107" y="258">
              migrations + ownership
            </text>
          </g>
          <g className="architecture-map__node architecture-map__node--vercel">
            <rect x="750" y="445" width="195" height="88" rx="8" />
            <text x="847" y="476">
              Vercel
            </text>
            <text className="architecture-map__node-detail" x="847" y="501">
              Vite production build
            </text>
          </g>

          <g className="architecture-map__node architecture-map__node--vite">
            <rect x="80" y="825" width="130" height="88" rx="8" />
            <text x="145" y="856">
              Vite
            </text>
            <text className="architecture-map__node-detail" x="145" y="881">
              client + proxy
            </text>
          </g>
          <g className="architecture-map__node architecture-map__node--express">
            <rect x="245" y="825" width="165" height="88" rx="8" />
            <text x="327" y="852">
              Express + Yoga
            </text>
            <text className="architecture-map__node-detail" x="327" y="876">
              REST + GraphQL
            </text>
            <text className="architecture-map__node-detail" x="327" y="895">
              request validation
            </text>
          </g>
          <g className="architecture-map__node architecture-map__node--ollama">
            <rect x="445" y="825" width="135" height="88" rx="8" />
            <text x="512" y="856">
              Ollama
            </text>
            <text className="architecture-map__node-detail" x="512" y="881">
              local model
            </text>
          </g>
          <g className="architecture-map__node architecture-map__node--local-data">
            <rect x="615" y="825" width="145" height="88" rx="8" />
            <text x="687" y="852">
              Local Supabase
            </text>
            <text className="architecture-map__node-detail" x="687" y="876">
              CLI + OrbStack
            </text>
            <text className="architecture-map__node-detail" x="687" y="895">
              SQL migrations
            </text>
          </g>
          <g className="architecture-map__node architecture-map__node--storybook">
            <rect x="205" y="935" width="260" height="44" rx="8" />
            <text x="335" y="963">
              Storybook + MSW · isolated UI states
            </text>
          </g>

          <g className="architecture-map__node architecture-map__node--github">
            <rect x="870" y="830" width="130" height="88" rx="8" />
            <text x="935" y="861">
              GitHub
            </text>
            <text className="architecture-map__node-detail" x="935" y="886">
              main branch
            </text>
          </g>
          <g className="architecture-map__node architecture-map__node--actions">
            <rect x="1040" y="810" width="165" height="128" rx="8" />
            <text x="1122" y="839">
              GitHub Actions
            </text>
            <text className="architecture-map__node-detail" x="1122" y="864">
              Prettier + ESLint
            </text>
            <text className="architecture-map__node-detail" x="1122" y="883">
              Jest + Testing Library
            </text>
            <text className="architecture-map__node-detail" x="1122" y="902">
              Supertest + Playwright
            </text>
          </g>

          <g className="architecture-map__connection">
            <path d="M 205 234 H 235" />
            <text x="220" y="217">
              uses
            </text>
            <path d="M 307 295 V 355" />
            <text x="345" y="332">
              renders docs
            </text>
            <path d="M 307 295 V 510" />
            <text x="348" y="477">
              uses
            </text>
            <path d="M 380 540 H 500 V 234" />
            <text x="438" y="523">
              session
            </text>
            <path d="M 380 568 H 760 V 252" />
            <text x="570" y="587">
              private data
            </text>
            <path d="M 935 234 H 1020" />
            <text x="977" y="217">
              RLS
            </text>
            <path d="M 847 445 V 365 H 307 V 295" />
            <text x="577" y="348">
              serves production frontend
            </text>
          </g>
          <g className="architecture-map__connection architecture-map__connection--local">
            <path d="M 307 295 V 650 H 145 V 825" />
            <text x="176" y="631">
              local /api + /graphql
            </text>
            <path d="M 210 869 H 245" />
            <text x="228" y="852">
              proxy
            </text>
            <path d="M 410 869 H 445" />
            <text x="428" y="852">
              draft
            </text>
          </g>
          <g className="architecture-map__connection architecture-map__connection--delivery">
            <path d="M 1000 874 H 1040" />
            <text x="1020" y="857">
              push
            </text>
            <path d="M 1122 810 V 625 H 847 V 533" />
            <text x="985" y="608">
              verified deployment
            </text>
          </g>
        </svg>

        <figcaption>
          <span className="architecture-map__legend architecture-map__legend--hosted">
            Hosted production service
          </span>
          <span className="architecture-map__legend architecture-map__legend--local">
            Local-only development service
          </span>
          <span className="architecture-map__legend architecture-map__legend--delivery">
            Quality and delivery service
          </span>
        </figcaption>
      </figure>

      <dl className="architecture-map__summary">
        <div>
          <dt>Browser-safe by design</dt>
          <dd>
            The browser holds only public Supabase configuration; ownership is
            enforced by database RLS policies.
          </dd>
        </div>
        <div>
          <dt>Local AI boundary</dt>
          <dd>
            Express hosts the local REST and GraphQL labs; Zod and Ollama keep
            AI drafting useful without becoming a production dependency.
          </dd>
        </div>
        <div>
          <dt>Automated delivery</dt>
          <dd>
            Formatting, type checks, tests, and the Vite build are verified
            before Vercel deploys the frontend.
          </dd>
        </div>
      </dl>
    </section>
  )
}

export default ArchitectureMap
