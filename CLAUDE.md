# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Meeting Bingo — a browser-based bingo game with live audio transcription. Players get a 5x5 card of meeting buzzwords; squares fill automatically via Web Speech API or manual tap. Early-stage (no application code yet — architecture planned in `docs/research/`).

## Planned Stack

- **Framework**: React 18 + TypeScript, Vite build tool
- **Styling**: Tailwind CSS
- **Speech**: Web Speech API (browser-native, free)
- **State**: React useState + Context, localStorage persistence
- **Animation**: CSS + canvas-confetti
- **Deployment**: Vercel (free tier)

## Development Commands (once scaffolded)

- `npm run dev` — start Vite dev server (port 3000)
- `npm run build` — `tsc && vite build` (outputs to `dist/`)
- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` — ESLint on `.ts`/`.tsx` files
- `npm run preview` — preview production build locally

## Architecture

The app is fully client-side (no backend). Key layers:
- **Components** (`src/components/`): LandingPage → CategorySelect → GameBoard → WinScreen flow
- **Hooks** (`src/hooks/`): `useSpeechRecognition` (Web Speech API wrapper), `useGame` (state), `useBingoDetection` (win checker)
- **Lib** (`src/lib/`): Pure logic — `cardGenerator.ts` (Fisher-Yates shuffle, 24 words + free space), `bingoChecker.ts` (row/col/diagonal detection), `wordDetector.ts` (transcript → buzzword matching with aliases)
- **Data** (`src/data/categories.ts`): Three buzzword categories (Agile, Corporate, Tech) with ~45 words each

Full architecture plan: `docs/research/meeting-bingo-architecture.md`

## Environment Variables

- Managed with [Varlock](https://varlock.dev/env-spec) — schema defined in `.env.schema`
- TypeScript types auto-generated to `env.d.ts`
- Use `varlock run -- <command>` to inject env vars into commands
- `LINEAR_API_KEY` is the primary secret; access it through varlock, never hardcode

## Tools

- **Varlock**: Environment variable manager. Use `varlock run -- <command>` to inject secrets into commands. Use `varlock load` to verify env vars are configured.
- **Vercel CLI**: Installed globally (`vercel`). Used for deployment.
- **Linear API via curl**: Use `varlock run -- bash -c 'curl -s -X POST https://api.linear.app/graphql -H "Content-Type: application/json" -H "Authorization: $LINEAR_API_KEY" -d "<graphql>"'` to interact with Linear.
- **gh**: GitHub CLI for PRs, issues, and repo management.

## Integrations

- **Linear** (project management): use the GraphQL API at `https://api.linear.app/graphql` with the `LINEAR_API_KEY` via varlock. The Linear CLI (`lin`) does not work in this environment due to TTY requirements.
- Team: "Dom Beckers" (key: `DOM`, id: `76238e83-915b-4f9f-b8f0-f94417bf2aba`)
