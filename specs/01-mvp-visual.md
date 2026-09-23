# SPEC 01 — MVP visual de Arcade Vault

> **Status:** aprobado
> **Depends on:** ninguno
> **Date:** 2026-09-23
> **Objective:** Portar a Next.js App Router las cinco pantallas del prototipo — biblioteca, detalle, reproductor, acceso y salón — más el nav y el footer, reproduciendo solo la capa visual sin implementar ningún juego.

## Por qué existe este spec

El prototipo es una SPA con routing por hash que no se puede desplegar ni enchufar a un backend. Portarlo a rutas reales de App Router deja la estructura de navegación, los tipos de datos y el estado compartido en su sitio definitivo, de modo que las specs futuras (juegos reales, backend de puntajes, cuentas) solo rellenen el interior de pantallas que ya existen.

Decisiones que se apartan del prototipo y conviene tener presentes: el routing por hash desaparece, `data.jsx` pasa a módulos TypeScript puros, y el reproductor conserva un temporizador cosmético en lugar de un juego.

## Scope

**In:**

- `lib/games.ts`: tipos y catálogo de los 8 juegos (verbatim de `data.jsx`).
- `lib/scores.ts`: `PLAYERS` + `seededScores(seed, count)` determinista (verbatim de `data.jsx`).
- Nav persistente (escritorio + panel móvil) y footer, en el layout raíz.
- Ruta `/`: hero, buscador, chips de categoría, rejilla de cards con tilt 3D y estado vacío.
- Ruta `/juego/[id]`: cover, tags, descripción larga, `stat-strip` y leaderboard de 10 filas.
- Ruta `/auth`: tabs iniciar sesión / crear cuenta, fields, validación mínima, botón invitado, botones sociales decorativos.
- Ruta `/salon`: tabs por juego, podio oro/plata/bronce, tabla de 12 filas y fila "you" si hay usuario.
- Ruta `/jugar/[id]`: HUD, CRT y arena decorativa (CSS puro), overlay de pausa, modal de guardar puntuación y toast.
- Estado de usuario y puntajes en `localStorage` (`av_user`, `av_scores`).
- `app/not-found.tsx` estilizado para ids inexistentes.
- Textos en español idénticos a los del prototipo.

**Out of scope (para specs futuras):**

- Cualquier juego real: canvas, loop de render, colisiones, física, input de teclado/táctil.
- Backend, base de datos o API de puntajes; el localStorage es el único almacén.
- Autenticación real (OAuth, sesiones, contraseñas verificadas); los botones de Google y GitHub son decorativos.
- Ranking global real: `seededScores` es un PRNG, no datos de usuarios.
- i18n, tests, analítica, PWA.

## Data model

```ts
// lib/games.ts
type Cat = "ARCADE" | "PUZZLE" | "SHOOTER" | "VERSUS";
type CatFilter = "TODOS" | Cat;

type Game = {
  id: string;        // "bloque-buster"
  title: string;     // "BLOQUE BUSTER"
  short: string;     // una línea para la card
  long: string;      // párrafo del detalle
  cat: Cat;
  cover: string;     // clase CSS del arte: "cover-bricks", "cover-tetro", ...
  color: "cyan" | "magenta" | "yellow" | "green";
  best: number;      // 28450
  plays: string;     // "12.4K"
};

export const GAMES: readonly Game[];        // 8 juegos
export const CATS: readonly Cat[];          // 4 categorías de juego
export const FILTERS: readonly CatFilter[]; // ["TODOS", ...CATS]
export function getGame(id: string): Game | undefined;
export function formatScore(n: number): string; // "28.450"
```

```ts
// lib/scores.ts
type Row = {
  rank: number;   // 1..count
  name: string;   // de PLAYERS, sin repetir
  score: number;
  date: string;   // "DD/MM/2026"
};

export function seededScores(seed: number, count = 12): Row[];
```

Semillas exactas del prototipo: detalle → `seededScores(id.length * 17 + 3, 10)`; salón → `seededScores(tab.length * 23 + 7, 12)`.

```ts
// localStorage
"av_user"   -> { name: string } | null
"av_scores" -> Array<{ game: string; score: number; name: string; at: number }>
```

Convenciones:

- `seededScores` es puro: sin `Math.random`, sin `Date`, sin `Intl` — mismo resultado en Node y en el navegador.
- `formatScore` es la única vía de formatear números; nunca `toLocaleString` suelto en componentes.
- El formulario de acceso normaliza el nombre a `(usuario || "PLAYER1").toUpperCase().slice(0, 10)`.

## Implementation plan

Cada paso compila, navega y es commiteable por separado.

1. **`lib/games.ts` + `lib/scores.ts`.** Tipos, catálogo, PRNG y `formatScore`, portados verbatim de `data.jsx`. Sin UI. Verificación: `npm run build` pasa.
2. **Shell compartido.** `components/app-provider.tsx` (`"use client"`: contexto `{ user, ready, login, signOut, saveScore }`, lectura de `localStorage` en `useEffect`), `components/site-nav.tsx` (`"use client"`: links con `usePathname`, contador de créditos, botón invitado/logueado, hamburguesa y panel móvil), `components/site-footer.tsx` (server, texto literal del prototipo). `app/layout.tsx` pasa a envolver `AppProvider > SiteNav > main.av-main > SiteFooter`.
3. **`/` biblioteca.** `components/library.tsx` (`"use client"`: estado `q`/`cat`), `components/game-card.tsx` (`"use client"`: tilt 3D con `useRef` + `onMouseMove`/`onMouseLeave` mutando `style.transform`), `components/cover-art.tsx` (server). `app/page.tsx` server que renderiza `<Library />`.
4. **`/juego/[id]` detalle.** `app/juego/[id]/page.tsx` server: `const { id } = await params` con `PageProps<'/juego/[id]'>`, `getGame(id)`, `notFound()` si no existe. `components/game-detail.tsx` (server, links con `next/link`) y `components/leaderboard.tsx` (server, filas `lb-row` con `top1/top2/top3`).
5. **`/auth` acceso.** `components/auth-form.tsx` (`"use client"`: `tab`, `user`, `pass`, `email`), conectar `login`/`signOut` del contexto. Verificación manual: entrar, recargar y seguir logueado; salir y volver a invitado.
6. **`/salon` salón de la fama.** `components/hall-of-fame.tsx` (`"use client"`: `tab` por juego), `components/podium.tsx` y `components/hall-table.tsx` (server), fila "you" alimentada por `useApp()`.
7. **`/jugar/[id]` reproductor.** `app/jugar/[id]/page.tsx` server (`await params` + `notFound()`) y `components/game-player.tsx` (`"use client"`: HUD, CRT, temporizador de score, PAUSA/REANUDAR, FIN, reiniciar, modal de iniciales y toast `toast-saved`). Último paso por ser el de mayor riesgo.
8. **Cierre.** `app/not-found.tsx` estilizado, marcado activo del nav (`/juego/*` y `/jugar/*` activan Biblioteca), cierre del panel móvil al navegar. Pasar `npm run lint` y `npm run build`.

## Acceptance criteria

- [ ] `npm run dev`, `npm run build` y `npm run lint` terminan sin errores.
- [ ] La consola del navegador no muestra errores ni avisos de hidratación en ninguna de las cinco rutas.
- [ ] `/` muestra hero, buscador, 5 chips, 8 cards y el estado vacío "NO HAY RESULTADOS" al filtrar por algo inexistente.
- [ ] El buscador filtra por título y los chips filtran por categoría, combinables entre sí.
- [ ] Clic en una card y clic en "JUGAR" llevan a `/juego/[id]` del juego correcto.
- [ ] `/juego/[id]` muestra cover, 4 tags, descripción larga, los 3 `stat-strip` y 10 filas de leaderboard con podio dorado/plateado/bronce.
- [ ] `/juego/no-existe` muestra el 404 estilizado con status HTTP 404.
- [ ] El nav aparece en las cinco rutas; "Biblioteca" queda activo en `/`, `/juego/*` y `/jugar/*`.
- [ ] En móvil, la hamburguesa abre el panel, el link navega y el panel se cierra.
- [ ] `/auth` en modo "Crear cuenta" pide correo y contraseña; enviar guarda `av_user` y el nav muestra el nombre en mayúsculas (máx. 10 caracteres).
- [ ] Recargar tras entrar mantiene la sesión; "JUGAR COMO INVITADO" y el botón de salir devuelven al estado invitado y limpian `av_user`.
- [ ] `/salon` cambia de tabla al pulsar otro chip de juego, muestra podio de 3 y tabla de 12 filas, y añade la fila "you" solo con usuario.
- [ ] `/jugar/[id]` muestra el score subiendo solo, y PAUSA lo congela, REANUDAR lo retoma y FIN abre el modal.
- [ ] Guardar la puntuación escribe en `av_scores` y muestra el toast "▸ PUNTUACIÓN GUARDADA_".
- [ ] Ninguna pantalla usa canvas, `requestAnimationFrame` ni rutas de juego; la arena del CRT es CSS puro.
- [ ] Los textos visibles son idénticos a los del prototipo, incluido el footer "© 2026 ARCADE VAULT · HECHO CON PIXELES Y NEÓN · v2.6.0".
- [ ] `references/` queda intacto.

## Decisions

- **Sí:** App Router con rutas reales (`/`, `/juego/[id]`, `/jugar/[id]`, `/auth`, `/salon`). URLs compartibles y ruteo idiomático. **No:** conservar el routing por hash del prototipo; produce URLs ilegibles y desperdicia el router de Next.
- **Sí:** page server que hace `await params` y delega, con `notFound()` real. Da 404 con status correcto y saca del bundle cliente lo no interactivo. **No:** marcar la page entera como cliente.
- **Sí:** contexto de React (`AppProvider`) montado en el layout raíz. Las páginas hijas no reciben props del layout, y el nav necesita el usuario en todas las rutas. **No:** estado por pantalla ni prop drilling.
- **Sí:** `user` arranca en `null` y `localStorage` se lee en `useEffect`, con bandera `ready`. Evita el mismatch de hidratación. **No:** leer `localStorage` en el render o en el inicializador de `useState`.
- **Sí:** las clases portadas de `styles.css` siguen en `globals.css` y son el mecanismo de estilado. Tailwind solo se usa en layout o estructura nueva. **No:** migrar el tema a utilidades Tailwind (decisión explícita: coste alto y riesgo de perder el look arcade). Consecuencia aceptada: en este repo conviven dos sistemas de estilo.
- **Sí:** reproductor "mock vivo": temporizador de score, PAUSA/FIN/reiniciar y guardado sobre estado local. La pantalla se siente funcional sin ningún juego. **No:** juego real, canvas o loop de render.
- **Sí:** `seededScores` determinista, portado tal cual. Sirve idéntico en servidor y cliente. **No:** generar puntajes con `Math.random` en el render (rompería la hidratación).
- **Sí:** componentes compartidos solo donde hay reutilización real (`CoverArt`, `Leaderboard`, `Podium`, `HallTable`, nav, footer). **No:** extraer un `Button` genérico (las clases `.btn` ya son el contrato) ni fusionar `Leaderboard` y `HallTable` (el markup `lb-row` y `<tr>` difiere; una tabla con variantes sería peor).
- **No:** modal y toast como componentes reutilizables; tienen un solo consumidor y viven dentro de `game-player.tsx`.
- **No:** tests. El repo no tiene framework de tests y este spec es de fidelidad visual.

## Risks

| Riesgo | Mitigación |
| --- | --- |
| `toLocaleString`/ICU distinto entre Node y navegador → mismatch de hidratación en puntajes | Centralizar todo formato en `formatScore`, con agrupación determinista de miles. |
| `localStorage` no disponible (modo privado, SSR) | Envolver lectura y escritura en `try/catch`; degradar a estado en memoria. La UI sigue funcionando, solo no persiste. |
| `PageProps<'/ruta'>` no resuelve si nunca corrió el typegen | Correr `npm run dev` o `npm run build` antes de tipar las páginas con params. |
| Tilt 3D con `mousemove` en React 19 estricto | `useRef<HTMLDivElement>(null)` tipado y mutación directa de `style.transform`, dentro de un componente `"use client"`. |
| El id inexistente devolvía `null` en el prototipo | En Next, `notFound()` en la page server más `app/not-found.tsx` estilizado. |
| `next dev` reescribe el bloque de `AGENTS.md` como cambio sin commitear | Commitearlo junto con el trabajo, como indica `CLAUDE.md`. |

## What is **not** in this spec

- Implementación de juegos (canvas, loop, colisiones, input).
- Backend, API de puntajes o ranking entre usuarios reales.
- Autenticación real y OAuth.
- Migración del tema CSS a Tailwind.
- Tests automatizados, i18n, analítica, PWA.

Cada uno de esos, si llega, va en su propio spec.