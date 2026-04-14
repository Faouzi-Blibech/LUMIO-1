---
name: lumio-design-system
description: CSS tokens, typography, components, brand guidelines, and design rules. Read when creating or modifying any UI component, page, or style.
---

# Design System

## Design Language

LUMIO uses a modern, glassmorphism-inspired design system with clean curves and professional typography.

### Typography (Local Fonts)
All fonts are loaded locally from `public/assets/fonts/`:
- **Headings:** `Montserrat` (font-heading, sans-serif) — weight 600/700
- **Body:** `Lexend` (font-body, sans-serif) — weight 400/500
- **Alternative:** `Cairo` (Arabic/Secondary context, sans-serif) — weight 500/600

### Brand Assets
- **Logos:** Loaded from `/assets/Logos/logo/lumio main logo.png` and `/assets/Logos/logo icon/lumio icon white.png`. Do not use raw text "lumio" or SVG placeholders for the logo mark.
- **Patterns:** Standardized background patterns:
  - `bg-pattern-blue` (`/assets/pattern/Pattern lumio blue.png`)
  - `bg-pattern-white` (`/assets/pattern/Pattern lumio white.png`)
  These patterns should be applied dynamically using CSS classes, notably on the `LiveSession` interface or hero layouts.

## Dashboard Design Tokens (Tailwind + CSS vars)

```css
:root {
  --background: 210 20% 98%;
  --foreground: 200 29% 18%;
  --card: 0 0% 100%;
  --card-foreground: 200 29% 18%;
  
  --primary: 241 44% 42%;          /* Brand Blue */
  --primary-foreground: 0 0% 100%;
  
  --secondary: 216 52% 55%;        /* Soft Blue */
  --secondary-foreground: 0 0% 100%;
  
  --destructive: 0 72% 51%;        /* Red */
  --success: 142 72% 42%;          /* Green */
  --warning: 38 92% 50%;           /* Amber */
  
  --muted: 200 18% 90%;
  --muted-foreground: 240 8% 50%;
  
  --border: 214 20% 92%;
  --ring: 241 44% 42%;
  --radius: 1.25rem;

  --shadow-soft: 0 2px 20px -4px hsl(241 44% 42% / 0.08);
  --shadow-card: 0 4px 32px -8px hsl(241 44% 42% / 0.10);
  --shadow-elevated: 0 12px 48px -12px hsl(241 44% 42% / 0.15);
}
```

## Component Patterns (from reference)

### KPI Cards
```
- bg-card rounded-2xl border border-border/50 shadow-soft border-l-4
- icon in bg-primary/8 rounded-xl container
- value in font-heading font-extrabold text-2xl
- change indicator with TrendingUp/Down icon
```

### Data Tables
```
- Table wrapped in bg-card rounded-2xl border border-border/50 shadow-soft
- Hoverable row states using `hover:bg-muted/20 transition-colors`
```

### Cards / Panels
```
- bg-card rounded-2xl border border-border/50 p-6 shadow-soft
- Section title: font-heading font-bold text-foreground
```

### Navigation (top bar)
```
- sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg
- Nav items: px-4 py-2 text-sm rounded-xl transition-colors
- Active Link: text-primary bg-primary/8
- Logo usage: Always use the `lumio icon white.png` wrapped in a `bg-gradient-primary` square next to the "lumio" text, or the `lumio main logo.png`.
```

### Charts (Recharts)
```
- AreaChart with gradient fill (e.g. primary color, 15% → 0% opacity)
- CartesianGrid strokeDasharray="3 3"
- Tooltip styled to have rounded borders and `Lexend` font.
```

### Status Badges (RiskBadge)
```
- low: bg-success/10 text-success border-success/20
- moderate: bg-warning/10 text-warning border-warning/20
- needs-attention: bg-destructive/10 text-destructive border-destructive/20
```

## Animations (framer-motion)

Use `framer-motion` exclusively.
- **Card Entrance:** `initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}`
- **Pulsing Indicator:** `animate-pulse` or specific tailwind classes
- **Floating Modals:** `initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}`

## Design Rules — NEVER Break

```
✗ No Google Fonts `@import` rule — use local `@font-face` definitions.
✗ No generic system fonts — always use Montserrat, Lexend, or Cairo.
✗ No raw `<svg>` code for the Lumio logo — use the assets in `/assets/Logos/`.
✗ No React Native / Expo / StyleSheet code anywhere.
✓ Always use framer-motion for page transitions and element reveals.
✓ Always use shadcn/ui components as the base (extended with custom styles).
✓ Ensure clean spacing (`gap-2`, `gap-4`) and rounded corners (`rounded-xl`, `rounded-2xl`).
```
