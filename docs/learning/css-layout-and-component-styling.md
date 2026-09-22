# CSS layout and component styling

## Responsive grids

Country cards use CSS Grid for a responsive catalog. `auto-fit` creates as many columns as fit, and `minmax` prevents a card from becoming too narrow.

    .country-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
      gap: 1rem;
    }

`gap` adds consistent space between grid items without needing margins on individual cards.

## Flexbox inside a card

Use a column flex layout when a card's contents need vertical rhythm. `gap` handles spacing between children. `margin-top: auto` on a trailing action pushes it to the bottom when cards have unequal content heights.

## Scoped component styles

Use a component-specific root class such as `.country-card` or `.hello-world`. This is a readable local convention even with regular CSS files. CSS Modules are optional; their generated class names solve global-name collisions, but they are not required for small exercises or interview coding tasks.

Native CSS nesting can improve readability when it mirrors a clear component relationship:

    .country-card {
      > h3 {
        margin: 0;
      }

      &.is-featured {
        border-color: rebeccapurple;
      }
    }

Avoid nesting merely to reflect every DOM level; deeply nested selectors become harder to override and reuse.

## Units and visual details

- Use `rem` for scalable spacing and typography. It is based on the root font size.
- A pixel radius is reasonable for a precise visual value; use `rem` when it should scale with typography.
- Use a wrapper around an image when its border, padding, or background should frame the image without altering the image's own dimensions.
- Browser default margins on headings and paragraphs are normal. Reset them intentionally where a flex/grid `gap` controls spacing.

Keep instructional comments above the declaration they explain, especially while learning a new layout technique.
