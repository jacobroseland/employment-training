import { learningCatalog } from '../../learning/learningCatalog'
import { useNavigate } from 'react-router'

function LearningCatalogPage() {
  const navigate = useNavigate()

  function handleOpenDocument(documentId: string) {
    navigate(`/learning/${documentId}`)
  }

  return (
    <section
      className="learning-catalog"
      aria-labelledby="learning-catalog-heading"
    >
      <h2 id="learning-catalog-heading" className="exercise-title">
        Learning materials
      </h2>

      <p className="learning-catalog-intro">
        Concise notes and the evolving platform roadmap for this sandbox.
      </p>

      <ul className="learning-grid">
        {learningCatalog.map((document) => (
          <li key={document.id}>
            <button
              className="learning-card"
              type="button"
              onClick={() => handleOpenDocument(document.id)}
            >
              <h3>{document.title}</h3>
              <p>{document.description}</p>
              <span aria-hidden="true">Read note →</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default LearningCatalogPage
