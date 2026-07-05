# CodeQuest — Manifiesto XTREME (24h)

> No buscamos excelencia. Buscamos algo **bueno, rápido y coherente**.
> KISS sobre cleverness. SOLID solo donde evita retrabajo.

## Identidad

| Campo | Valor |
|-------|-------|
| **Nombre** | CodeQuest |
| **Qué es** | Plataforma gamificada de preguntas de programación |
| **Demo north star** | Registro → onboarding → jugar → ver puntos/logros |
| **Tono** | Gamificado pero sobrio. Emojis solo en juego, logros y feedback |

**Regla de oro:** todo copy, título y marca dice **CodeQuest**. Nada de CodeQuestion, MiPlataforma ni nombres del repo.

## Principios XTREME

1. **Ship > polish infinito** — Si funciona y se ve bien en 5 min de demo, está listo.
2. **Un archivo CSS, un sistema** — Variables en `:root`, componentes reutilizables. No duplicar estilos inline.
3. **Cero frameworks nuevos** — PHP + CSS vanilla. Sin Tailwind, React, build step.
4. **No tocar DB salvo blocker** — Esquema congelado. Lógica PHP solo si la demo lo exige.
5. **Anti-vibecode** — Si parece landing genérica de IA, está mal.

## Scope lock (NO tocar)

- Esquema MySQL / migraciones
- Páginas nuevas (solo pulir: login, register, onboarding, dashboard, game, achievements, leaderboard)
- Animaciones pesadas (gradientes infinitos, blur excesivo, micro-interacciones por todas partes)
- Refactors PHP “por arquitectura” sin impacto en demo

## Estética: pastel elegante, no slop

### Sí
- Fondo claro crema/lavanda (`#F7F4FF`, `#FFF8F2`)
- Cards blancas con borde sutil (`1px`, opacidad baja)
- Acentos: lavanda `#9B8AFB`, melocotón `#FFB088`, menta `#7ECBA1`
- Sombras suaves (`0 4px 24px rgba(0,0,0,0.06)`)
- Tipografía: system-ui o una sola Google Font (ej. `DM Sans`)
- Espaciado en escala 4/8/16/24/32

### No (vibecode red flags)
- Gradiente animado en todo el `body`
- Glassmorphism + neón rosa en cada card
- 5+ colores de acento compitiendo
- Emojis en cada título de página
- Bordes redondeados random (22px aquí, 8px allá)

## UI/UX: botones y flujo lógico

### Jerarquía (una pantalla = una acción principal)

| Nivel | Clase | Cuándo usar | Máximo por vista |
|-------|-------|-------------|------------------|
| **Primario** | `.btn-primary` / `.submit-btn` | La acción que queremos que el usuario haga | **1** |
| **Secundario** | `.btn-secondary` | Alternativa válida pero no la meta (Cancelar, Borrar, Anterior) | 1–2 |
| **Terciario** | `.text-link` / `.logout-link` | Navegación o acciones de bajo riesgo | Sin límite, pero discretos |

**Reglas:**
- Nunca dos botones primarios compitiendo en la misma card.
- El primario va **abajo del formulario** o al final del flujo visual (Z-pattern).
- Secundario siempre visualmente más débil: fondo muted, sin sombra fuerte.
- Destructivo (cerrar sesión, borrar) **nunca** es primario — usa secundario o link.

### Transiciones de estado (no saltar pasos)

El usuario avanza en orden. Cada pantalla tiene **un solo “siguiente paso”** lógico:

```
register → login → onboarding → dashboard → game → resultados → hub
```

| Pantalla | CTA primario | No hacer |
|----------|--------------|----------|
| Login | Iniciar sesión | Link a juego sin auth |
| Register | Crear cuenta | Ir directo al dashboard |
| Onboarding | Elegir nivel / Continuar | Saltar a game sin guardar nivel |
| Dashboard | Jugar ahora | 3 CTAs del mismo peso visual |
| Game (menú) | Elegir modo (cards) | Botón “Guardar” sin contexto |
| Game (partida) | Siguiente / Ejecutar | Volver al menú y guardar a la vez como primarios |
| Resultados | Guardar y volver | Cerrar sin feedback de puntos |

**Al cambiar de estado UI:**
1. **Ocultar** la vista anterior (`display: none` / panel inactivo) antes de mostrar la nueva.
2. **Un feedback** por acción: loading → éxito/error → navegación. No encadenar 3 toasts.
3. **Deshabilitar** el botón mientras procesa (`is-loading` / `disabled`) para evitar doble submit.
4. **No regresar** a un estado inconsistente (ej. onboarding otra vez si ya `onboarded = 1`).

### Estados del botón

| Estado | Comportamiento |
|--------|----------------|
| Default | Clickeable, contraste claro |
| Hover | Cambio sutil (color o sombra), sin saltos de layout |
| Active | `scale(0.98)` máximo — nada dramático |
| Loading | Spinner + `pointer-events: none` — mismo tamaño del botón |
| Disabled | Opacidad 0.5, sin hover — solo cuando la acción no aplica |

### Checklist rápido antes de merge

- [ ] ¿Hay solo **un** `.btn-primary` dominante en esta vista?
- [ ] ¿El CTA lleva al **siguiente paso** del flujo, no a un callejón?
- [ ] ¿Los links secundarios no compiten en tamaño/color con el primario?
- [ ] ¿Al hacer clic, la UI avanza o confirma — no ambas cosas a la vez sin feedback?


| Orden | Entrega | Por qué |
|-------|---------|---------|
| 1 | Unificar marca → CodeQuest | Coherencia instantánea en demo |
| 2 | CSS tokens + layout base | Un cambio, todas las páginas mejoran |
| 3 | Login + register + dashboard | Primera impresión del jurado |
| 4 | Game + feedback visual | Core del producto |
| 5 | Leaderboard + achievements | Wow factor competitivo |
| 6 | Onboarding | Si sobra tiempo |

## Definición de “hecho”

- [ ] Todas las páginas dicen CodeQuest
- [ ] Paleta pastel aplicada sin romper legibilidad
- [ ] Flujo demo completo sin errores 500
- [ ] Mobile usable (375px, sin scroll horizontal)
- [ ] Nada que grite “template de IA”
- [ ] Un CTA primario por vista; flujo sin saltos de estado illógicos

## Cómo trabajar con Cursor

1. Leer este manifiesto antes de tocar código.
2. Cambios pequeños, verificables, una página a la vez.
3. CSS: editar variables primero, componentes después.
4. PHP: solo copy/marca salvo bug blocker.
5. No crear docs extra. Solo este manifiesto + skills en `.cursor/skills/`.

---

*Hackathon mode: si dudas entre bonito y funcional → funcional. Si dudas entre refactor y CSS → CSS.*
