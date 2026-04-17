```markdown
# Design System Document

## 1. Overview & Creative North Star: "The Kinetic Monolith"

This design system is built to evoke the high-stakes, precision-driven world of elite competitive gaming. We are moving away from the cluttered, "neon-soaked" tropes of gaming UI to embrace **The Kinetic Monolith**. This North Star defines a digital environment that feels forged from raw obsidian and liquid gold—heavy, authoritative, and immovable, yet pulsing with data-driven energy.

To achieve this, we reject standard web layouts. We prioritize **intentional asymmetry**, where heavy headlines are balanced by expansive negative space, and **tonal layering**, where depth is communicated through light rather than lines. The goal is an editorial experience that feels less like a website and more like a high-end broadcast command center.

---

## 2. Colors & Atmospheric Depth

The palette is rooted in a high-contrast relationship between deep "Obsidian" blacks and "Champagne Gold" accents. 

### The "No-Line" Rule
We do not use 1px solid borders to define sections. In this system, boundaries are invisible. Separation must be achieved through **background color shifts**. For example, a `surface-container-low` component sits directly on a `surface` background. The shift in value provides the structure; the absence of a line provides the sophistication.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical, stacked slabs.
- **Base Layer:** `surface` (#131313)
- **Secondary Sections:** `surface-container-low` (#1b1b1b)
- **Actionable Cards:** `surface-container` (#1f1f1f)
- **Active/Hovered States:** `surface-container-high` (#2a2a2a)

### The "Glass & Gradient" Rule
To inject "soul" into the tech-focused aesthetic, utilize the **Zenith Gradient** (`primary-container` to `primary`). 
*   **Application:** Use this gradient only for high-impact CTAs, progress bars, or "Winner" states.
*   **Glassmorphism:** For floating overlays (modals/tooltips), use `surface-container` at 70% opacity with a `24px` backdrop-blur. This creates a "frosted obsidian" effect that allows the underlying gameplay data to bleed through subtly.

---

## 3. Typography: The Editorial Voice

Typography is our primary tool for authority. We mix technical precision with aggressive, wide-set accents.

*   **Display & Headlines (Agency FB):** These are your "Aggressive" tokens. Agency FB is tall and condensed; use it for player names, match scores, and section titles. It should feel like it was stamped onto the screen.
*   **UI & Accents (Stretch Pro):** This is our "Data" font. Use it sparingly for labels, category tags (e.g., "LIVE NOW"), and micro-copy. Its ultra-wide profile provides a tech-forward, cinematic feel.
*   **Body & Information (Instrument Sans):** Our "Functional" token. Instrument Sans provides high legibility for player bios, news articles, and settings. 

**Scale Strategy:** 
- Use extreme contrast. A `display-lg` headline should dwarf `body-md` text to create a sense of hierarchy and importance.

---

## 4. Elevation & Depth

We eschew traditional drop shadows for **Tonal Layering** and **Ambient Glows**.

### The Layering Principle
Depth is achieved by stacking. A `surface-container-lowest` card placed on a `surface-container-low` section creates a recessed "carved" effect. Conversely, placing `surface-bright` elements on `surface` creates a "raised" effect.

### Ambient Shadows
Shadows are only permitted for "Floating" elements (Modals/Popovers). 
- **Value:** `0px 24px 48px rgba(0, 0, 0, 0.4)`
- **The Glow Exception:** For "Epic" or "Legendary" items, use a primary-tinted glow (`surface_tint` at 10% opacity) to mimic the radiance of gold.

### The "Ghost Border" Fallback
If a visual divider is strictly required for accessibility, use a **Ghost Border**: `outline-variant` (#4e4638) at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Buttons
*   **Primary:** A hard-edged (0px radius) block using the Champagne Gradient. Text is `on-primary` (#402d00) set in **Stretch Pro**.
*   **Secondary:** No fill. A "Ghost Border" (15% opacity silver) with `secondary` text. On hover, the background fills to `surface-container-highest`.
*   **Tertiary:** Text-only, using `primary` color with a 2px underline offset by 4px.

### Cards & Lists
*   **Forbid Dividers:** Do not use lines between list items. Use 16px or 24px of vertical space. 
*   **Hover States:** Cards should not "pop" up; they should shift in color from `surface-container` to `surface-container-high`.

### Input Fields
*   **Styling:** A bottom-only "Ghost Border" (2px). When focused, the border animates to 100% opacity `primary` (Gold). 
*   **Labels:** Always use **Stretch Pro** at `label-sm` for field labels to maintain the "instrument panel" aesthetic.

### Additional Components: "The Stat-Strip"
Unique to this system, a "Stat-Strip" is a horizontal bar of `surface-container-lowest` that houses real-time data (APM, K/D, Win Rate) using `primary` colored text for values and `secondary` for labels.

---

## 6. Do’s and Don’ts

### Do
*   **Do use 0px Corner Radius:** Every element is a sharp, precise monolith. Rounding is forbidden.
*   **Do embrace Negative Space:** Let the "Obsidian" (`surface`) breathe. High-performance apps require clarity, not clutter.
*   **Do use Asymmetric Grids:** Align your headlines to the far left, but keep your action buttons tucked into the bottom right to create a "kinetic" tension.

### Don’t
*   **Don’t use "Grey":** Use the `surface` tokens. Standard greys feel muddy; our surfaces are tinted with the warmth of the gold and the coolness of the silver.
*   **Don’t use 100% White for Body Text:** Use `on-surface-variant` (#d1c5b3). It reduces eye strain during long gaming sessions and feels more premium.
*   **Don’t use standard transitions:** Use "Expo-Out" easing for all hover states. It should feel snappy and responsive, like a mechanical keyboard click.```