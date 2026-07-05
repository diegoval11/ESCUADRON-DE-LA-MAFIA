---
name: codequest-xtreme
description: >-
  Hackathon workflow for CodeQuest PHP platform. Use when editing this repo,
  planning features, or any task where speed and demo impact matter more than
  perfection. Enforces KISS, scope lock, and CodeQuest branding.
---

# CodeQuest XTREME Develop

24h hackathon mode. Read `MANIFIESTO.md` at repo root first.

## Product

- **Name:** CodeQuest (always — never CodeQuestion, MiPlataforma, etc.)
- **Stack:** Plain PHP + single `assets/style.css` + MySQL
- **Demo path:** register → login → onboarding → dashboard → game → achievements/leaderboard

## Rules (non-negotiable)

1. **KISS** — Smallest diff that ships. No abstractions for one use case.
2. **Scope lock** — No new pages, no DB schema changes, no JS frameworks, no build tools.
3. **SOLID lite** — Extract only when the same pattern appears 3+ times or a bug repeats.
4. **Ship > polish** — Good enough beats perfect at hour 18.
5. **One CSS file** — Use `:root` tokens; extend existing classes before inventing new ones.

## Before every change

Ask internally:
- Does this help the 5-minute demo?
- Can I do it with CSS only?
- Am I adding vibecode slop (animated gradients, blur stacks, emoji spam)?

If no / yes / yes → stop and simplify.

## PHP conventions

- Keep existing `session_start()` + `include "config.php"` pattern.
- Prepared statements already in place — don't rewrite data layer.
- Auth guard at top of protected pages — copy existing pattern from `dashboard.php`.
- Copy/marca: product name is **CodeQuest** in `<title>`, `.brand`, and user-facing strings.

## File map

| File | Role |
|------|------|
| `login.php`, `register.php` | Entry + first impression |
| `onboarding.php`, `save_level.php` | Skill level setup |
| `dashboard.php` | Hub after login |
| `game.php`, `save_score.php` | Core gameplay |
| `achievements.php`, `leaderboard.php` | Social/competitive wow |
| `assets/style.css` | All visual identity |
| `config.php` | DB connection only — don't expand |

## Commit mindset

- One logical change per turn (e.g. "rename brand" OR "pastel tokens", not both unless tiny).
- After CSS token change, spot-check login + game on mobile width.

## Anti-patterns (reject these)

- Adding Tailwind, Bootstrap, or a bundler
- Splitting CSS into 5 files mid-hackathon
- Renaming PHP files or restructuring folders
- "While I'm here" refactors
- New animations unless replacing an existing ugly one
