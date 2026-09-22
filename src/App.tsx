import './App.css'
import AppLayout from './AppLayout'
import ExerciseCatalogPage from './pages/ExerciseCatalogPage/ExerciseCatalogPage'
import ExercisePage from './pages/ExercisePage/ExercisePage'
import LearningCatalogPage from './pages/LearningCatalogPage/LearningCatalogPage'
import LearningDocumentPage from './pages/LearningDocumentPage/LearningDocumentPage'
import { Route, Routes } from 'react-router'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<ExerciseCatalogPage />} />
        <Route path="exercises/:exerciseId" element={<ExercisePage />} />
        <Route path="learning" element={<LearningCatalogPage />} />
        <Route path="learning/:documentId" element={<LearningDocumentPage />} />
      </Route>
    </Routes>
  )
}

export default App
