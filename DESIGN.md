# The Floating Semantic Layer: Design System Documentation

## 1. Overview & Creative North Star
The "Floating Semantic Layer" is a design system crafted for the modern developer who views code not as a static file, but as a fluid, multidimensional architecture. This system moves away from the "Industrial Command Center" aesthetic—characterized by heavy borders and rigid grids—to embrace a "Repo-Local" atmosphere that feels grounded, professional, and ethereal.

**Creative North Star: The Digital Stratosphere.**
This system visualizes data and logic as elements floating within a deep, topological space. We break the "template" look by utilizing intentional asymmetry, layered translucency, and a focus on Z-axis depth. Components are not "containers" in the traditional sense; they are localized concentrations of light and semantic meaning.

---

## 2. Colors
Our palette is anchored in deep midnight tones, punctuated by high-energy electric accents that guide the eye toward critical developer actions.

### Core Palette
*   **Background (`#0b1326`):** A deep navy base. Use a radial gradient for main views, transitioning from `surface` to `surface_container_lowest`.
*   **Primary Cyan (`#c3f5ff` / `#00e5ff`):** The "Electric Cyan." Used for primary actions and "live" states.
*   **Secondary Indigo (`#bac3ff`):** The "Soft Indigo." Used for semantic highlighting and secondary navigation elements.
*   **Neutrals:** `on_surface` (`#dae2fd`) for primary text and `on_surface_variant` (`#bac9cc`) for metadata and secondary labels.

### The "No-Line" Rule
Traditional 1px solid borders are strictly prohibited for sectioning. Boundaries must be defined through:
1.  **Background Shifts:** Distinguish sections by placing a `surface_container` element against a `surface` background.
2.  **Tonal Transitions:** Use a 2px blur on a container’s edge rather than a stroke.
3.  **Topological Grids:** Use faint, low-opacity (`4%`) grid patterns to suggest structure without imposing hard walls.

### Surface Hierarchy & Nesting
Treat the UI as stacked sheets of fine, semi-transparent paper.
*   **Base:** `surface`
*   **Sectioning:** `surface_container_low`
*   **Interactive Cards:** `surface_container_high`
*   **Popovers/Modals:** `surface_container_highest` with `backdrop-blur: 12px`.

---

## 3. Typography
The typographic voice is high-end editorial meets technical precision.

*   **Display & Headlines (Space Grotesk):** Headlines use `display-lg` down to `headline-sm`. Always use **Mixed Case**. The wide apertures and geometric forms of Space Grotesk provide an approachable, modern feel.
*   **Titles & Body (Inter):** Inter provides high legibility for dense technical documentation. Use `title-md` for section headers and `body-md` for general descriptions.
*   **Code & Metadata (JetBrains Mono):** All terminal output, code snippets, and repo-specific paths must use JetBrains Mono. Its increased x-height ensures clarity in complex logic.

---

## 4. Elevation & Depth
In this design system, depth is a functional tool, not a stylistic flourish.

### The Layering Principle
Depth is achieved by stacking `surface-container` tiers. To create "lift," move up the hierarchy:
*   Place a `surface_container_lowest` card on a `surface_container_low` background to create a "recessed" look.
*   Place a `surface_container_highest` modal on a `surface` background to create "projection."

### Ambient Shadows
When an element must float (e.g., a floating action button or dropdown), use **Ambient Shadows**:
*   **Color:** `#000000` at `12%` opacity or a tinted version of `surface_container_highest`.
*   **Blur:** High values (16px to 32px).
*   **Spread:** Negative values to keep the shadow "tucked" under the element.

### Glassmorphism & Ghost Borders
For floating panels, use `surface_variant` at `60%` opacity with a `backdrop-filter: blur(10px)`. If accessibility requires a border, use a **Ghost Border**: `outline_variant` at `15%` opacity. Never use a 100% opaque stroke.

---

## 5. Components

### Buttons
*   **Primary:** `primary` background with `on_primary` text. Use a subtle glow (`box-shadow: 0 0 15px primary_container`) on hover.
*   **Secondary:** `secondary_container` background with `on_secondary_container` text. Borderless.
*   **Tertiary:** No background. `primary` text. Subtle `surface_bright` background shift on hover.

### Input Fields
*   **Style:** No bottom line or full border. Use `surface_container_low` with a `sm` (0.125rem) corner radius.
*   **Focus State:** Transition the background to `surface_container_high` and add a faint `primary` glow.

### Cards & Lists
*   **The Divider Ban:** Do not use line dividers between list items. Use 12px – 16px of vertical white space or a subtle `surface_container` background change to indicate separate entities.
*   **Interactive List Items:** On hover, use a `surface_bright` background with a `0.25rem` corner radius.

### Additional Repo-Specific Components
*   **The Semantic Badge:** Small, `full` rounded chips using `secondary_fixed_dim` for repo tags or branch names.
*   **Code Block "Trays":** Use `surface_container_lowest` backgrounds for code snippets to provide a "sunken" feel, making the code appear as if it's etched into the interface.

---

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical layouts for Hero sections to emphasize the "Floating" direction.
*   **Do** lean into `surface-container` shifts for hierarchy.
*   **Do** use Space Grotesk for technical headings to maintain an editorial feel.
*   **Do** ensure all text on `surface` backgrounds meets WCAG AA contrast ratios using the `on_surface` tokens.

### Don't
*   **Don't** use 1px solid borders (unless it's a Ghost Border at <20% opacity).
*   **Don't** use all-caps for headlines; it feels too "Industrial/Military."
*   **Don't** use harsh, pure black shadows.
*   **Don't** clutter the UI with dividers; let white space and tonal shifts do the heavy lifting.

---

## 7. Logo Design System

The Kenon mark is derived from an abstracted `K`, rather than from a purely decorative dot pattern.

Its structure is built around one anchor point extending into four connected points. This reflects a core idea in Kenon’s design language: **one anchor, four facets**.

- Anchor: space / module- Four facets: time, quality, intent, and dependencies

Because of that, the logo is meant to express both the name **Kenon** and the project’s structural model, not just a generic “tech dots” aesthetic.

## Color system

Kenon’s formal mark is monochrome: **black and white**.

On the website and in digital presentation, grey-blue or fluorescent grey-blue accents may appear as supporting interface colors, but they are not part of the formal primary mark.

## Usage note

Formal usage should prefer the monochrome version to keep the identity stable across contexts and media.