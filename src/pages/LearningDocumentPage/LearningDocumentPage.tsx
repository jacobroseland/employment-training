import MarkdownDocument from '../../components/MarkdownDocument/MarkdownDocument'
import { learningCatalog } from '../../learning/learningCatalog'
import ArchitectureMap from './components/ArchitectureMap'
import { Navigate, useParams } from 'react-router'

function LearningDocumentPage() {
  const { documentId } = useParams()

  const document = learningCatalog.find(
    (catalogDocument) => catalogDocument.id === documentId,
  )

  if (!document) {
    return <Navigate to="/learning" replace />
  }

  return (
    <section className="learning-document" aria-labelledby="learning-title">
      <h2 id="learning-title" className="exercise-title">
        {document.title}
      </h2>

      {document.id === 'architecture-overview' && <ArchitectureMap />}

      <MarkdownDocument content={document.content} />
    </section>
  )
}

export default LearningDocumentPage
