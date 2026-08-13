# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

> El bloque de AGENTS.md ("This is NOT the Next.js you know") lo escribe y re-escribe `next dev`. No lo borres del diff: solo se regenera como cambio sin commitear. Cómmitalo junto con tu trabajo para mantener el árbol limpio. Lee la guía relevante en `node_modules/next/dist/docs/` antes de escribir código.

## Proyecto

**Arcade Vault** — plataforma para jugar online y competir por la mayor cantidad de puntos. Proyecto arrancado con `create-next-app`; solo existe la página de inicio por defecto.

## Comandos

```bash
npm run dev    # servidor de desarrollo
npm run build  # build de producción
npm start      # servidor de producción (tras build)
npm run lint   # ESLint (config plana en eslint.config.mjs)
```

No hay framework de tests configurado.

## Stack y notas clave

- **Next.js 16.3.0** (App Router, `app/`) + **React 19** + **TypeScript** (strict). La API difiere de versiones anteriores — consulta `node_modules/next/dist/docs/01-app/`.
- **Route Props Helpers:** `PageProps<'/ruta'>` y `LayoutProps<'/ruta'>` son tipos globales (sin importar) que tipan `params`, `searchParams` y slots. Se generan al correr `next dev`/`next build`/`next typegen`. Ver `app/layout.tsx` usa `LayoutProps<"/">`.
- `params` y `searchParams` en pages/layouts son **Promises** — hay que `await`-arlas. Las rutas estáticas resuelven `params` a `{}`.
- **Tailwind CSS v4** — sin `tailwind.config.js`; se configura en `app/globals.css` con `@import "tailwindcss"` y `@theme inline`. Plugin `@tailwindcss/postcss` en `postcss.config.mjs`.
- Alias de imports `@/*` → raíz del proyecto (definido en `tsconfig.json`).
- Rutas nuevas: carpeta en `app/` + archivo `page.tsx` (UI) o `route.ts` (API).

## Workflow Spec-Driven (skills `/spec` y `/spec-impl`)

Flujo central del proyecto. Specs viven en `specs/NN-slug.md`, numerados secuencialmente. Estructura de cada spec: header (Status, Depends on, Date, Objective en una frase), Scope (in/not-in), Data model, Implementation plan, Acceptance criteria (checklist booleano), Decisions, Risks.

- `/spec` — diseña un spec **sin escribir código**: aclara requisitos por fases, construye sección por sección con confirmación, y guarda en `specs/` en estado `Draft` (el humano lo pasa a `Approved` al revisar).
- `/spec-impl NN-slug` — implementa un spec **solo si su estado significa "Approved"** (acepta equivalente en cualquier idioma: Aprobado/Aprovado/…). Verifica que el working tree esté limpio, crea y cambia a la rama `spec-NN-slug`, e implementa paso a paso con pausas para revisar diffs.
- Config opcional `specs/.spec-config.yml` controla `AutoCreateBranch` (true por defecto).
- Skills instaladas vía: `npx skills@latest add Klerith/fernando-skills`. Base: https://github.com/Klerith/fernando-skills