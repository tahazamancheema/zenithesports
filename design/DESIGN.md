---
name: Zenith Esports Design System
colors:
  surface: '#16130e'
  surface-dim: '#16130e'
  surface-bright: '#3c3933'
  surface-container-lowest: '#100e09'
  surface-container-low: '#1e1b16'
  surface-container: '#221f1a'
  surface-container-high: '#2d2a24'
  surface-container-highest: '#38342f'
  on-surface: '#e9e1d9'
  on-surface-variant: '#d0c5b4'
  inverse-surface: '#e9e1d9'
  inverse-on-surface: '#33302a'
  outline: '#999080'
  outline-variant: '#4d4639'
  surface-tint: '#e4c27a'
  primary: '#ffe1a3'
  on-primary: '#3f2e00'
  primary-container: '#e6c47b'
  on-primary-container: '#685012'
  inverse-primary: '#745b1d'
  secondary: '#f5fff4'
  on-secondary: '#00391f'
  secondary-container: '#16ff9e'
  on-secondary-container: '#007243'
  tertiary: '#dee3ff'
  on-tertiary: '#222e58'
  tertiary-container: '#bac6f9'
  on-tertiary-container: '#45517d'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdf9c'
  primary-fixed-dim: '#e4c27a'
  on-primary-fixed: '#251a00'
  on-primary-fixed-variant: '#5a4304'
  secondary-fixed: '#56ffa8'
  secondary-fixed-dim: '#00e38b'
  on-secondary-fixed: '#002110'
  on-secondary-fixed-variant: '#00522f'
  tertiary-fixed: '#dce1ff'
  tertiary-fixed-dim: '#b8c4f7'
  on-tertiary-fixed: '#0a1842'
  on-tertiary-fixed-variant: '#394570'
  background: '#16130e'
  on-background: '#e9e1d9'
  surface-variant: '#38342f'
  background-deep: '#0A0A0A'
  surface-card: '#141414'
  text-high: '#F5F5F5'
  text-medium: '#A0A0A0'
  accent-gold-muted: '#B39962'
  glow-gold: rgba(230, 196, 123, 0.3)
typography:
  display-xl:
    fontFamily: Inter
    fontSize: 72px
    fontWeight: '900'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.7'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  section-padding: 120px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

# Design Document: Zenith Esports Landing Page Redesign

## 1. Overview & Brand Identity
Zenith Esports is Pakistan's premier competitive ecosystem, specifically focusing on PUBG Mobile. The current brand identity is strong, featuring a dark, high-contrast palette with gold/yellow accents and bold typography. The redesign will maintain this "pro-gamer" aesthetic while improving clarity, visual hierarchy, and user engagement.

**Core Values:**
*   **Professionalism:** High-quality tournament production.
*   **Integrity:** Fair play and strict rules.
*   **Community:** Connecting Pakistani gamers.

## 2. Visual Style (Theme)

### Color Palette
*   **Primary Background:** Deep Charcoal/Black (`#0A0A0A`)
*   **Primary Accent:** Zenith Gold (`#E6C47B`) - used for primary CTAs and headings.
*   **Secondary Accent:** Electric Green (`#00FF9D`) - used sparingly for "Live" indicators and success states (Region: Pakistan).
*   **Text (High Emphasis):** Off-White (`#F5F5F5`)
*   **Text (Medium Emphasis):** Muted Gold/Grey (`#A0A0A0`)

### Typography
*   **Headings:** Bold, uppercase sans-serif (e.g., 'Inter' or 'Oswald') with tight letter spacing for a high-impact, competitive feel.
*   **Body:** Clean, readable sans-serif (e.g., 'Inter') with generous line height for readability against dark backgrounds.

### Imagery & Components
*   **Hero Section:** High-resolution esports-themed background with a subtle overlay to ensure text legibility.
*   **Cards:** Dark cards with subtle borders or gradients to create depth without breaking the dark theme.
*   **Buttons:** Rectangular with sharp or very slightly rounded corners. Gold for primary actions, outlined/ghost for secondary.

## 3. Screen Structure (Landing Page Sections)

### A. Navigation Bar
*   Sticky header with Zenith Esports logo.
*   Links: Home, Tournaments, About Us, My Profile.
*   Primary CTA: "Login / Register" in Zenith Gold.

### B. Hero Section
*   **Headline:** "LEVEL UP YOUR COMPETITIVE GAME" (Large, Bold, Gold).
*   **Subheadline:** Concise description of the circuit and infrastructure.
*   **CTAs:** "JOIN THE CIRCUIT" (Primary) and "BROWSE EVENTS" (Secondary).

### C. Live Stats/Ticker
*   A horizontal bar showing real-time impact: Active Players, Prize Pools Distributed, Tournaments Run, Region focus.

### D. Latest Content & Live Broadcast
*   Prominent video player or thumbnail for the latest tournament stream.
*   "Broadcast Information" sidebar showing Channel Handle, Current Game, and Connection Status.
*   "Join the Community" CTA for YouTube subscription.

### E. Value Propositions (Why Compete With Us?)
*   Headline: "PROFESSIONAL TOURNAMENT QUALITY".
*   Feature Grid:
    *   **Strict Integrity:** Focus on manual verification and fair battlefield.
    *   **High-End Broadcast:** High-fidelity streams and professional production.
    *   **Technical Brackets:** Automated tournament logic.
    *   **Fast Settlements:** Verified and finalized prize distributions.

### F. Upcoming/Featured Tournaments (New Section Suggestion)
*   A card-based carousel or grid showing upcoming PUBG Mobile tournaments with dates, prize pools, and "Register" buttons.

### G. Footer
*   Directory links (About Us, Terms, Privacy, Support, Contact).
*   Technical Support details (WhatsApp unit, Operational hours).
*   Social Media links (YouTube, Instagram, Discord).
*   Copyright and "Project by BEYOND ZENITH" branding.

## 4. Key Improvements
1.  **Enhanced Visual Depth:** Use subtle gradients and glow effects on buttons to give it a more modern "gaming" feel.
2.  **Clearer Tournament Path:** Add a specific section for "Upcoming Tournaments" to drive immediate conversion.
3.  **Mobile Optimization:** Ensure the multi-column sections stack gracefully on smaller screens.
4.  **Interactive Elements:** Hover states for cards and buttons that use the Zenith Gold glow.