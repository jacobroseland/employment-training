# React component patterns

## State ownership

Keep shared state in the closest common parent. The parent passes data down as props and receives events back through callback props.

In Country Explorer, `CountryExplorer` owns which country is expanded. `CountryCard` receives `country`, `isDetailsExpanded`, and `onDetailsToggle`. This keeps the card reusable and prevents multiple cards from independently disagreeing about the selected state.

    <CountryCard
      country={country}
      isDetailsExpanded={expandedCountryCode === country.countryCode}
      onDetailsToggle={() => setExpandedCountryCode(country.countryCode)}
    />

## Controlled form state

When a parent needs to populate, inspect, or reset a form's values, keep those values in the parent. The form component receives the current values and reports individual changes through a callback.

In the Job Search Pipeline, `JobSearchPipeline` owns `formValues`, while `ApplicationForm` owns only UI-specific error messages:

```tsx
const [formValues, setFormValues] = useState(emptyApplicationFormValues)

function handleFormValueChange(
  field: keyof ApplicationFormValues,
  value: string,
) {
  setFormValues((currentValues) => ({
    ...currentValues,
    [field]: value,
  }))
}

const applicationForm = (
  <ApplicationForm
    values={formValues}
    onValueChange={handleFormValueChange}
    // Other callbacks omitted for brevity.
  />
)
```

This gives the application one source of truth for draft values. It also prepares the form for a future AI workflow: the parent can accept an AI-generated draft, put it into `formValues`, and let the user review and edit it before saving.

## Reusing a form for create and edit modes

The same controlled form can support both adding and editing. The parent keeps the selected record ID in state, fills the form with that record's values when editing begins, and decides whether submit creates or updates a record.

```tsx
function handleEditApplication(application: JobApplication) {
  setFormValues(toFormValues(application))
  setEditingApplicationId(application.id)
  setIsApplicationFormVisible(true)
}
```

When saving an edit, preserve the existing record's `id` and `createdAt`; replace only the editable details. A clear secondary action can become **Cancel edit** in this mode, so the user can discard the draft without changing the stored application.

## DOM effects after state changes

Use an effect for browser actions that must happen after React renders updated state. In Job Search Pipeline, selecting **Edit** first opens the populated form, then scrolls its section into view:

```tsx
const applicationFormSectionRef = useRef<HTMLElement>(null)

useEffect(() => {
  if (editingApplicationId && isApplicationFormVisible) {
    applicationFormSectionRef.current?.scrollIntoView?.({
      behavior: 'smooth',
      block: 'start',
    })
  }
}, [editingApplicationId, isApplicationFormVisible])
```

The optional call keeps the test environment safe, since JSDOM does not implement browser scrolling. The real browser scrolls only for edit mode—not when the user opens a blank add form.

## Browser persistence with localStorage

`localStorage` provides small, browser-local persistence without a backend. Keep browser read/write details in a focused storage module, then let the component use a lazy state initializer and an effect:

```tsx
const [applications, setApplications] = useState(() =>
  loadApplications(initialApplications),
)

useEffect(() => {
  saveApplications(applications)
}, [applications])
```

The lazy initializer reads storage only during initial state setup. The effect writes whenever the application list changes. Because browser storage can be manually edited, corrupted, or outdated, parse it as `unknown`, validate the records, and fall back to sample data when it is invalid.

## Inline confirmation state

For a destructive action such as delete, keep the pending record ID in the parent rather than putting independent confirmation state in every card. This guarantees that one confirmation is open at a time and keeps the actual deletion in the component that owns the list:

```tsx
const [pendingDeletionApplicationId, setPendingDeletionApplicationId] =
  useState<string | null>(null)

function handleDeleteApplication(applicationId: string) {
  setApplications((currentApplications) =>
    currentApplications.filter(
      (application) => application.id !== applicationId,
    ),
  )

  setPendingDeletionApplicationId(null)
}
```

Each card receives whether its confirmation is visible plus request, cancel, and confirm callbacks. An inline confirmation avoids a browser dialog, remains testable, and keeps keyboard focus in a predictable card context.

## Organizing a component

Use consistent sections so a component is easy to scan:

1. Imports and types
2. Constants and pure helper functions
3. Component state
4. Derived values
5. Effects
6. Event handlers
7. JSX returned from the component

Pure helpers such as `toCountry` belong outside the component when they do not use props or state. Keeping them there makes them easier to test and prevents recreating them on every render.

## Types

Use a dedicated `.types.ts` file when several files share a domain type. `CountryExplorer.types.ts` holds the UI-ready `Country` type used by both the explorer and `CountryCard`.

Keep the API response type separate from the UI type. A mapper transforms the raw response into the shape the UI needs, which prevents API-specific naming and optional fields from spreading through components.

## Catalog-driven exercise rendering

The exercise catalog stores each exercise's metadata and component. `App` can select an entry and render its component dynamically rather than maintaining a growing conditional chain.

    const ActiveExercise = activeExercise?.Component
    return ActiveExercise ? <ActiveExercise /> : <ExerciseCatalog />
