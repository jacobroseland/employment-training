# Routing

React Router is installed and provides addressable, refresh-safe navigation for the training sandbox.

## Current route model

    /                             exercise catalog
    /exercises/:exerciseId        individual exercise
    /learning                     learning-material catalog
    /learning/:documentId         individual learning document

`App.tsx` defines routes. `AppLayout` owns the persistent header and `<Outlet />`; React Router renders the matching child route into that outlet.

    <Route element={<AppLayout />}>
      <Route index element={<ExerciseCatalogPage />} />
      <Route path="exercises/:exerciseId" element={<ExercisePage />} />
      <Route path="learning" element={<LearningCatalogPage />} />
      <Route path="learning/:documentId" element={<LearningDocumentPage />} />
    </Route>

## Route parameters

Dynamic path segments begin with `:`. For example, this URL:

    /exercises/hello-world

matches `exercises/:exerciseId`. `useParams()` provides `{ exerciseId: 'hello-world' }`, which `ExercisePage` uses to find the matching item in `exerciseCatalog`.

Path parameters identify the main resource being viewed. They differ from query-string values such as `/exercises?exerciseId=hello-world`, which use `useSearchParams()`.

## Navigation conventions

- Use `Link` for ordinary navigation that changes the URL, such as the header title, back links, and learning-documents link.
- Use `useNavigate()` for navigation triggered by an existing callback API, such as `ExerciseCard`'s `onOpen` handler.
- Use `<Navigate replace />` for corrective redirects. Replacing an invalid URL prevents the browser Back button from returning to the same broken route.
- Keep catalog data as the source of truth. Route pages find an exercise or document by its URL ID rather than holding the active screen in React state.

## Testing routes

Route tests should render `App` inside `MemoryRouter`. It provides in-memory browser history for tests without requiring a real browser.

    render(
      <MemoryRouter initialEntries={['/learning']}>
        <App />
      </MemoryRouter>,
    )
