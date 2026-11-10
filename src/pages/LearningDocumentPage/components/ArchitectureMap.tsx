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
          Current production, local-development, and delivery boundaries
        </span>
      </div>

      <figure className="architecture-map__figure">
        <svg
          className="architecture-map__diagram"
          viewBox="0 0 1200 980"
          role="img"
          aria-labelledby="architecture-map-svg-title architecture-map-svg-description"
        >
          <title id="architecture-map-svg-title">
            Employment Training architecture
          </title>
          <desc id="architecture-map-svg-description">
            A technical architecture diagram showing the browser application,
            hosted Supabase authentication and database services, local AI draft
            services, and the GitHub to Vercel delivery pipeline.
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
            width="1200"
            height="980"
            rx="20"
          />

          <g className="architecture-map__zone architecture-map__zone--client">
            <rect x="40" y="72" width="350" height="570" rx="14" />
            <text x="68" y="112">
              CLIENT · BROWSER
            </text>
            <text className="architecture-map__zone-subtitle" x="68" y="138">
              User-facing application
            </text>
          </g>
          <g className="architecture-map__zone architecture-map__zone--cloud">
            <rect x="430" y="72" width="730" height="570" rx="14" />
            <text x="458" y="112">
              HOSTED SERVICES
            </text>
            <text className="architecture-map__zone-subtitle" x="458" y="138">
              Production data, identity, and deployment
            </text>
          </g>
          <g className="architecture-map__zone architecture-map__zone--local">
            <rect x="40" y="682" width="710" height="250" rx="14" />
            <text x="68" y="722">
              LOCAL DEVELOPMENT ONLY
            </text>
            <text className="architecture-map__zone-subtitle" x="68" y="748">
              AI drafting never reaches the deployed Vercel frontend
            </text>
          </g>
          <g className="architecture-map__zone architecture-map__zone--delivery">
            <rect x="790" y="682" width="370" height="250" rx="14" />
            <text x="818" y="722">
              QUALITY AND DELIVERY
            </text>
            <text className="architecture-map__zone-subtitle" x="818" y="748">
              Every pushed change is verified
            </text>
          </g>

          <g className="architecture-map__node architecture-map__node--person">
            <rect x="80" y="190" width="120" height="86" rx="8" />
            <text x="140" y="226">
              User
            </text>
            <text className="architecture-map__node-detail" x="140" y="250">
              browser
            </text>
          </g>
          <g className="architecture-map__node architecture-map__node--react">
            <rect x="230" y="190" width="120" height="86" rx="8" />
            <text x="290" y="220">
              React app
            </text>
            <text className="architecture-map__node-detail" x="290" y="244">
              TypeScript
            </text>
            <text className="architecture-map__node-detail" x="290" y="263">
              Router + CSS
            </text>
          </g>
          <g className="architecture-map__node architecture-map__node--auth">
            <rect x="480" y="190" width="150" height="86" rx="8" />
            <text x="555" y="220">
              Supabase Auth
            </text>
            <text className="architecture-map__node-detail" x="555" y="247">
              session identity
            </text>
          </g>
          <g className="architecture-map__node architecture-map__node--api">
            <rect x="740" y="190" width="150" height="86" rx="8" />
            <text x="815" y="220">
              Supabase API
            </text>
            <text className="architecture-map__node-detail" x="815" y="247">
              repository calls
            </text>
          </g>
          <g className="architecture-map__node architecture-map__node--data">
            <rect x="1000" y="190" width="120" height="86" rx="8" />
            <text x="1060" y="220">
              Postgres
            </text>
            <text className="architecture-map__node-detail" x="1060" y="244">
              RLS policies
            </text>
            <text className="architecture-map__node-detail" x="1060" y="263">
              migrations
            </text>
          </g>
          <g className="architecture-map__node architecture-map__node--vercel">
            <rect x="690" y="420" width="160" height="86" rx="8" />
            <text x="770" y="450">
              Vercel
            </text>
            <text className="architecture-map__node-detail" x="770" y="477">
              static Vite build
            </text>
          </g>
          <g className="architecture-map__node architecture-map__node--vite">
            <rect x="80" y="800" width="130" height="86" rx="8" />
            <text x="145" y="830">
              Vite
            </text>
            <text className="architecture-map__node-detail" x="145" y="857">
              local proxy
            </text>
          </g>
          <g className="architecture-map__node architecture-map__node--express">
            <rect x="315" y="800" width="130" height="86" rx="8" />
            <text x="380" y="830">
              Express
            </text>
            <text className="architecture-map__node-detail" x="380" y="857">
              Zod validation
            </text>
          </g>
          <g className="architecture-map__node architecture-map__node--ollama">
            <rect x="550" y="800" width="130" height="86" rx="8" />
            <text x="615" y="830">
              Ollama
            </text>
            <text className="architecture-map__node-detail" x="615" y="857">
              local model
            </text>
          </g>
          <g className="architecture-map__node architecture-map__node--github">
            <rect x="825" y="800" width="110" height="86" rx="8" />
            <text x="880" y="830">
              GitHub
            </text>
            <text className="architecture-map__node-detail" x="880" y="857">
              main branch
            </text>
          </g>
          <g className="architecture-map__node architecture-map__node--actions">
            <rect x="1010" y="800" width="110" height="86" rx="8" />
            <text x="1065" y="830">
              Actions
            </text>
            <text className="architecture-map__node-detail" x="1065" y="850">
              test + build
            </text>
            <text className="architecture-map__node-detail" x="1065" y="869">
              Storybook
            </text>
          </g>

          <g className="architecture-map__connection">
            <path d="M 200 233 H 230" />
            <text x="215" y="216">
              uses
            </text>
            <path d="M 350 218 H 480" />
            <text x="415" y="201">
              session
            </text>
            <path d="M 350 248 H 740" />
            <text x="545" y="267">
              private data requests
            </text>
            <path d="M 890 233 H 1000" />
            <text x="945" y="216">
              RLS
            </text>
            <path d="M 770 420 V 330 H 290 V 276" />
            <text x="530" y="313">
              serves production bundle
            </text>
          </g>
          <g className="architecture-map__connection architecture-map__connection--local">
            <path d="M 290 276 V 620 H 145 V 800" />
            <text x="162" y="602">
              /api draft request
            </text>
            <path d="M 210 843 H 315" />
            <text x="262" y="826">
              proxy
            </text>
            <path d="M 445 843 H 550" />
            <text x="497" y="826">
              validated prompt
            </text>
          </g>
          <g className="architecture-map__connection architecture-map__connection--delivery">
            <path d="M 935 843 H 1010" />
            <text x="972" y="826">
              push
            </text>
            <path d="M 1065 800 V 570 H 770 V 506" />
            <text x="928" y="553">
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
          <dt>Experience</dt>
          <dd>
            React and Router make the catalog and exercises usable as a real
            browser application.
          </dd>
        </div>
        <div>
          <dt>Trust</dt>
          <dd>
            Supabase Auth and database policies protect personal application
            data at the data layer.
          </dd>
        </div>
        <div>
          <dt>Acceleration</dt>
          <dd>
            Express, Zod, and Ollama create a safe local draft workflow without
            exposing a hosted AI key.
          </dd>
        </div>
      </dl>
    </section>
  )
}

export default ArchitectureMap
