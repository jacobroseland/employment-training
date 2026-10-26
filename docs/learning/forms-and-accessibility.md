# Forms and accessibility

## Controlled inputs and submitted values

A controlled input uses React state for its displayed value. Country Explorer keeps the text being typed separate from the submitted search term, so filtering changes only when the form is submitted.

    const [searchInput, setSearchInput] = useState('')
    const [submittedSearch, setSubmittedSearch] = useState('')

On submit, trim whitespace before validation and saving the query. Trimming avoids searches that differ only because of accidental leading or trailing spaces.

## Form values versus application data

Form controls work with strings, even when an empty optional value should become `null` in the application's data. Keep the controlled form values local to the form component, then let the parent convert a valid submission into the domain object it owns.

    type ApplicationFormValues = {
      companyName: string
      location: string
    }

    type JobApplication = {
      companyName: string
      location: string | null
    }

    function toOptionalValue(value: string) {
      return value || null
    }

This keeps inputs easy to control and makes the boundary where data is normalized explicit. The Job Search Pipeline parent also creates fields owned by the application rather than the form, such as `id` and `createdAt`.

## Custom validation

Use a real `<form>` with `onSubmit`; it supports Enter-to-submit and gives the interaction clear semantics. `noValidate` is appropriate when React is providing the validation message rather than the browser's default popup.

For an invalid field:

- Connect the visible `<label>` using `htmlFor` and `id`.
- Set `aria-invalid={true}` only while invalid.
- Point `aria-describedby` to the error message's `id`.
- Give the error `role="alert"` when it needs immediate announcement.

## Native elements first

Use a `<button type="button">` for show/hide controls, then expose its state with `aria-expanded` and connect it to the controlled panel with `aria-controls`.

    <button
      type="button"
      aria-expanded={isDetailsExpanded}
      aria-controls={detailsId}
      onClick={onDetailsToggle}
    >
      Show details
    </button>

Use `hidden` on content that should not be visible or reachable while collapsed. Use `role="status"` for loading and result-count messages that should be announced without interrupting the user.

## Semantic content

Use a list (`ul`/`li`) for a collection of country cards. Use `dl`, `dt`, and `dd` for label/value facts such as capital and population. A `dt` is the term; one or more `dd` values describe it.
