---
name: codequest-ui
description: >-
  Visual design system for CodeQuest. Use when editing assets/style.css or
  styling any PHP page. Pastel elegant aesthetic, anti-vibecode, mobile-first.
---

# CodeQuest UI System

Pastel elegante. Rápido de aplicar. No debe parecer generado por IA.

## Design tokens (paste into `:root`)

```css
:root {
  /* Surfaces */
  --bg: #F7F4FF;
  --bg-warm: #FFF8F2;
  --surface: #FFFFFF;
  --surface-muted: #F0EDF8;

  /* Text */
  --text: #2D2640;
  --text-muted: #6B6280;
  --text-inverse: #FFFFFF;

  /* Accent (max 3 active per screen) */
  --accent: #9B8AFB;      /* lavanda — primary actions */
  --accent-warm: #FFB088; /* melocotón — highlights, streaks */
  --accent-cool: #7ECBA1; /* menta — success, correct answers */

  /* Semantic */
  --error: #E8737A;
  --success: #7ECBA1;

  /* Shape */
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --border: 1px solid rgba(45, 38, 64, 0.08);
  --shadow: 0 4px 24px rgba(45, 38, 64, 0.06);
  --shadow-hover: 0 8px 32px rgba(45, 38, 64, 0.10);

  /* Spacing scale */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
}
```

## Typography

```css
body {
  font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
  color: var(--text);
  background: var(--bg);
  /* NO animated gradients on body */
}
```

- Headings: `font-weight: 600`, `letter-spacing: -0.02em`
- Subtitles: `var(--text-muted)`, `14–15px`
- One font only. Don't add a second display font mid-hackathon.

## Components (reuse these class names)

| Class | Use |
|-------|-----|
| `.brand` | Logo row: icon + "CodeQuest" |
| `.brand-icon` | Small square icon, solid accent bg |
| `.card` | White surface, `--radius-lg`, `--shadow`, `--border` |
| `.subtitle` | Muted helper text under headings |
| `.btn-primary` / `.submit-btn` | Filled `--accent`, white text — **max 1 per view** |
| `.btn-secondary` | Muted bg — cancel, back, clear |
| `.text-link` / `.logout-link` | Tertiary navigation |
| `.field` + `label` + `input` | Form stack |
| `.alert-error` | Soft red bg, no harsh borders |

When restyling: **update tokens + these classes first**. Pages inherit automatically.

## Button hierarchy & flow (see `MANIFIESTO.md`)

- **One primary CTA per screen** — never two `.btn-primary` fighting for attention.
- **Linear flow:** register → login → onboarding → dashboard → game. Don't link ahead of auth/onboarding.
- **State transitions:** hide previous panel → show next → one feedback (loading/success/error). Disable button while submitting.
- **Destructive actions** (logout, clear) use `.btn-secondary` or `.text-link`, never primary.


## Layout rules

- `body`: flex column, centered, `min-height: 100vh`, `padding: var(--space-lg)`
- Cards: `max-width: 360px` (forms) or `600px` (hub/game)
- Mobile first — test at `375px` before desktop tweaks

## Motion

- **Allowed:** `transition: 0.15s ease` on hover/focus for buttons and cards
- **Allowed:** one subtle `@keyframes` for card entrance (opacity + translateY 8px)
- **Forbidden:** infinite background animations, pulsing glows, parallax

## Anti-vibecode checklist

Before finishing a CSS change, verify:

- [ ] Background is solid or subtle static gradient (not animated)
- [ ] No `backdrop-filter: blur` on every element
- [ ] No hot pink `#ff6b9d` neon — use pastel accents above
- [ ] Border radius consistent (`--radius-md` or `--radius-lg`, not both randomly)
- [ ] Emojis only on game/quiz/achievements, not login titles
- [ ] Contrast readable: text on white passes quick eye test
- [ ] Only one primary button per view; flow matches MANIFIESTO state order

## Migration from current dark theme

1. Replace `:root` variables (don't append a second theme)
2. Remove `gradientShift` animation from `body`
3. Swap glass cards → solid `--surface` white cards
4. Change `.brand` text to dark on light bg
5. Update button/input focus states to `--accent` ring, not neon glow

## Brand block (copy-paste)

```html
<div class="brand">
  <div class="brand-icon">⚡</div>
  CodeQuest
</div>
```

Icon can be ⚡ 🎯 or `{ }` — pick one and keep it everywhere.
