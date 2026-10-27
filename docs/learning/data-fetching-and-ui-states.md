# Data fetching and UI states

## Shape external data at the boundary

The Country Explorer API returns `RestCountry` data. `toCountry` converts that raw shape into the app's `Country` type before it reaches the UI.

    function toCountry(restCountry: RestCountry): Country {
      return {
        countryName: restCountry.name,
        countryCode: restCountry.alpha3Code,
        // Map API fields into predictable UI fields.
      }
    }

This isolates API naming, missing values, and response changes to one place.

## Fetch inside an effect

An effect cannot itself be `async`, so declare and call an inner async function. Track the state needed to render an honest UI: data, loading, and error.

    useEffect(() => {
      async function loadCountries() {
        // Set loading, request data, map it, and update error state.
      }

      void loadCountries()
    }, [])

## Failure paths

`!response.ok` handles an HTTP response with an unsuccessful status, such as 404 or 500. `catch` handles failures where a usable response was not obtained, plus errors thrown while processing the response. `finally` is useful for cleanup that must run in either case, such as turning off loading.

    try {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Unable to load countries.')
      }
    } catch (error) {
      setError('Unable to load countries.')
    } finally {
      setIsLoading(false)
    }

## Render the full state model

Account for each user-visible outcome:

- Loading: request is in progress.
- Error: data could not be loaded.
- Success: render countries and filters.
- Empty: a successful filter has no matching countries.
- More results: render **Load more countries** only when more filtered countries exist.

Current filtering is client-side after the country list is loaded. If a future API supports server-side search or pagination, preserve these same UI states while the request parameters change.

## Keep async generation behind a service boundary

An asynchronous UI component should not need to know whether its data comes from a temporary mock, a REST endpoint, or a local LLM. Give the component one focused service function and keep the implementation details behind it:

    const draft = await generateApplicationDraft(jobDescription)

In Job Search Pipeline, `ApplicationDraftPanel` owns user-visible request states (`idle`, `loading`, `success`, and `error`). `ApplicationDraftService` owns how the draft is produced. The current implementation waits briefly and returns a predictable practice-mode result; a future version can make a Node/Ollama request while preserving the panel's interaction and the parent form's review-before-save workflow.
