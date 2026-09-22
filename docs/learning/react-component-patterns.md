# React component patterns

## State ownership

Keep shared state in the closest common parent. The parent passes data down as props and receives events back through callback props.

In Country Explorer, `CountryExplorer` owns which country is expanded. `CountryCard` receives `country`, `isDetailsExpanded`, and `onDetailsToggle`. This keeps the card reusable and prevents multiple cards from independently disagreeing about the selected state.

    <CountryCard
      country={country}
      isDetailsExpanded={expandedCountryCode === country.countryCode}
      onDetailsToggle={() => setExpandedCountryCode(country.countryCode)}
    />

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
