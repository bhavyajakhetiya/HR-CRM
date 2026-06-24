---
name: Elevate HR
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#464555'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#831ada'
  on-secondary: '#ffffff'
  secondary-container: '#9e41f5'
  on-secondary-container: '#fffbff'
  tertiary: '#454853'
  on-tertiary: '#ffffff'
  tertiary-container: '#5d606b'
  on-tertiary-container: '#d9dbe8'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#f0dbff'
  secondary-fixed-dim: '#ddb8ff'
  on-secondary-fixed: '#2c0051'
  on-secondary-fixed-variant: '#6800b4'
  tertiary-fixed: '#e0e2ef'
  tertiary-fixed-dim: '#c3c6d2'
  on-tertiary-fixed: '#181b24'
  on-tertiary-fixed-variant: '#434751'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-padding: 32px
  card-gap: 24px
  section-margin: 40px
  gutter: 24px
---

## Brand & Style

The design system is centered on the concept of "Effortless Orchestration." It targets HR professionals and hiring managers who need to balance complex data with human empathy. The aesthetic merges **Corporate Modern** reliability with **Glassmorphic** lightness, creating a workspace that feels productive rather than clinical.

The visual narrative is driven by high-contrast primary actions set against a soft, multi-tonal lavender background. This approach ensures that while the interface feels expansive and calm, the path to the next task is always unmistakable. The emotional goal is to evoke a sense of organized clarity and professional warmth.

## Colors

The palette is built on a foundation of "Atmospheric Lavenders." The background canvas uses a soft lavender tint to reduce eye strain compared to pure white. 

- **Primary (Electric Indigo):** Reserved for core "Call to Action" buttons and active states. It provides the necessary "pop" against the soft background.
- **Secondary (Soft Violet):** Used for supporting visual elements, status indicators, and subtle accents.
- **Surface (Pure White):** All card containers are pure white to create a distinct "elevation" from the lavender canvas.
- **Functional Colors:** Success (Emerald), Warning (Amber), and Error (Rose) are slightly desaturated to maintain the professional, calm aesthetic.

## Typography

This design system utilizes **Plus Jakarta Sans** for its friendly yet precise geometric qualities. The type scale is generous, prioritizing legibility and hierarchy.

- **Headlines:** Use semi-bold weights with tight letter spacing for a modern, authoritative feel.
- **Body Text:** Standard body copy uses a slightly lighter weight to maintain a sense of airiness.
- **Labels:** Small labels and data headers use medium weight with increased letter spacing to ensure clarity at small scales.
- **Hierarchy:** Use color (Neutral 600 vs Neutral 900) rather than just size to distinguish between secondary information and primary headings.

## Layout & Spacing

The system follows a **Fixed-Fluid Hybrid** model. While the sidebar and right-hand utility panels remain fixed (280px and 320px respectively), the central content area fluidly adapts to fill the remaining space.

- **The Canvas:** The entire app is treated as a single "Tray" with a 24px-32px outer margin.
- **Grid:** A 12-column grid is used within the fluid central area. Gutters are fixed at 24px to maintain a spacious feel.
- **Mobile Reflow:** On mobile devices, the sidebars transform into a bottom navigation bar and a top-right "drawer" menu. All 3-column layouts stack vertically.

## Elevation & Depth

Depth is conveyed through **Tonal Layering** and **Soft Ambient Shadows**.

1.  **Level 0 (Canvas):** The base lavender layer. No shadows.
2.  **Level 1 (Main Cards):** Pure white surfaces with a 12% opacity shadow, 20px blur, and a 4px vertical offset. This makes them feel "placed" on the canvas.
3.  **Level 2 (Active States/Modals):** A higher elevation (24px blur) with a subtle indigo tint in the shadow to signify interactivity or focus.
4.  **Glassmorphism:** Use a 10px backdrop-blur on the sidebar and navigation elements to allow the background hues to bleed through, maintaining a sense of continuity.

## Shapes

The design system employs a "High-Radius" strategy to emphasize approachability and modern software trends. 

- **Cards & Primary Containers:** Use a minimum of 24px corner radius (`rounded-xl` and above).
- **Buttons:** Fully rounded (pill-shaped) for high-contrast actions, while secondary buttons use a 12px radius.
- **Selection States:** Highlighted rows in tables or lists use a 12px corner radius on the hover/active background.
- **Avatars:** Circular (100% radius) to contrast against the geometric cards.

## Components

### Buttons
- **Primary:** Solid Electric Indigo with white text. Pill-shaped. 
- **Secondary:** Ghost style with an Electric Indigo border and text. 
- **Action Icons:** 40x40px rounded squares with soft lavender backgrounds.

### Cards
- Always white backgrounds.
- 24px internal padding.
- Used for grouping related HR metrics, applicant profiles, or calendar views.

### Input Fields
- Soft lavender-grey borders (1px).
- 12px rounded corners.
- Focus state: 2px Electric Indigo border with a subtle glow.

### Chips & Badges
- Used for status (e.g., "In Review", "Hired").
- High-saturation text on low-saturation backgrounds of the same hue (e.g., Dark Green text on Pale Green background).

### List Items
- Generous vertical padding (16px).
- Use subtle dividers (1px, 5% black) or 8px gaps between card-based list items.