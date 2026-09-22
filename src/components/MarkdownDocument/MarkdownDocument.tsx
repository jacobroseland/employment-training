import './MarkdownDocument.css'
import ReactMarkdown from 'react-markdown'

type MarkdownDocumentProps = {
  content: string
}

function MarkdownDocument({ content }: MarkdownDocumentProps) {
  return (
    <div className="markdown-document">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}

export default MarkdownDocument
