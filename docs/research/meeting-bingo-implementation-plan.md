# Meeting Bingo — Implementation Plan

## Context

The repo has research docs (PRD, architecture, UXR) but zero application code. The architecture doc contains reference implementations for most core files. This plan takes the project from empty to a deployed, functional bingo game with live speech recognition.

**Scope:** P0 (MVP) + P1 features. No dark mode, sound effects, or multiplayer.

---

## Phase 1: Foundation (~20 min)

### 1.1 Scaffold Vite + React project
- Run `npm create vite@latest . -- --template react-ts` in project root
- Delete boilerplate: `src/App.css`, `src/assets/`, `public/vite.svg`

### 1.2 Install dependencies
```
npm install canvas-confetti
npm install -D tailwindcss postcss autoprefixer @types/canvas-confetti
npx tailwindcss init -p
```

### 1.3 Configure build tools
- **`vite.config.ts`** — from architecture doc (port 3000, sourcemaps)
- **`tailwind.config.js`** — from architecture doc (custom `bounceIn` keyframe, `pulse-fast` animation)
- **`src/index.css`** — replace with Tailwind directives only

### 1.4 Create types and data (from architecture doc)
- **`src/types/index.ts`** — all interfaces (`BingoSquare`, `GameState`, `SpeechRecognitionState`, etc.)
- **`src/data/categories.ts`** — 3 buzzword packs (40+ words each)

### 1.5 Create core library files (pure functions, no React)
- **`src/lib/utils.ts`** — `cn()` classname helper (simple implementation, no clsx dep)
- **`src/lib/cardGenerator.ts`** — Fisher-Yates shuffle, 24 words + free center (from arch doc)
- **`src/lib/bingoChecker.ts`** — check rows/cols/diagonals, `countFilled`, `getClosestToWin` (from arch doc)
- **`src/lib/wordDetector.ts`** — word boundary matching, multi-word phrases, aliases (from arch doc)
- **`src/lib/shareUtils.ts`** — build share text + clipboard/Web Share API (custom, not in doc)

### 1.6 Create persistence hook
- **`src/hooks/useLocalStorage.ts`** — generic `useState` wrapper backed by localStorage

**Checkpoint:** `npm run dev` starts, `npm run typecheck` passes.

---

## Phase 2: Core Game (~30 min)

### 2.1 Shared UI primitives
- **`src/components/ui/Button.tsx`** — primary/secondary/ghost variants, sm/md/lg sizes
- **`src/components/ui/Toast.tsx`** — `ToastContainer` with auto-dismiss, success/info/warning styles
- **`src/components/ui/Card.tsx`** — simple wrapper with consistent border/shadow

### 2.2 Game state hook
- **`src/hooks/useGame.ts`** — central hook owning all game state:
  - `startGame(categoryId)` — generates card, resets state
  - `toggleSquare(row, col)` — manual tap with win detection
  - `fillByWord(word)` — auto-fill by speech with win detection + toast
  - `resetGame()`, `setListening()`
  - Persists to localStorage via `useLocalStorage`
  - Win detection runs atomically inside state updater (no useEffect gap)

### 2.3 Bingo detection hook
- **`src/hooks/useBingoDetection.ts`** — derives `winningSquareIds: Set<string>` from game state

### 2.4 Screen components
- **`src/components/BingoSquare.tsx`** — from arch doc (filled/auto-filled/free/winning states)
- **`src/components/BingoCard.tsx`** — 5x5 CSS grid, passes click handlers
- **`src/components/LandingPage.tsx`** — hero + "New Game" + privacy message + how-it-works
- **`src/components/CategorySelect.tsx`** — 3 category cards with preview words
- **`src/components/GameControls.tsx`** — listen toggle, progress counter, new card button
- **`src/components/TranscriptPanel.tsx`** — from arch doc (live transcript + detected words)
- **`src/components/GameBoard.tsx`** — header + BingoCard + GameControls + TranscriptPanel
- **`src/components/WinScreen.tsx`** — confetti (canvas-confetti), winning card, stats, share button

### 2.5 Root app and routing
- **`src/App.tsx`** — screen state machine (landing → category → game → win), wires useGame + speech
- **`src/main.tsx`** — React root render
- **`index.html`** — update title to "Meeting Bingo"

**Checkpoint:** Full game playable with manual taps. Landing → Category → Game → BINGO → Win all work.

---

## Phase 3: Speech Integration (~25 min)

### 3.1 Speech recognition hook
- **`src/hooks/useSpeechRecognition.ts`** — from arch doc:
  - Wraps Web Speech API with feature detection
  - Continuous listening with auto-restart on timeout
  - Separates final vs interim transcripts
  - `onResult` callback ref pattern for latest closure

### 3.2 Wire speech → game in App.tsx
- Speech `onResult` callback → `detectWordsWithAliases()` → `fillByWord()` for each match
- `filledWordSet` ref tracks already-filled words to prevent duplicate detection
- Reset on new card generation

### 3.3 Error handling
- `not-allowed` — show "Microphone denied" message, fall back to manual mode
- `no-speech` — auto-restart handled by hook
- Feature detection — hide listen button if `!isSupported`

**Checkpoint:** Say buzzwords, squares auto-fill. Toast notifications appear.

---

## Phase 4: Polish & Deploy (~15 min)

### 4.1 Responsive mobile audit
- `touch-manipulation` on BingoSquare (eliminate 300ms tap delay)
- `overflow-hidden` + `line-clamp-2` on long buzzword text
- `max-h-32 overflow-y-auto` on TranscriptPanel

### 4.2 Favicon
- **`public/favicon.svg`** — target emoji SVG

### 4.3 Deploy to Vercel
- `vercel` for initial deploy, `vercel --prod` for production
- Update share URL in `shareUtils.ts` to match deployed URL

**Checkpoint:** Full end-to-end test on deployed URL. Mobile + desktop.

---

## Files Summary

| Source | Files |
|--------|-------|
| From architecture doc (copy/adapt) | `types/index.ts`, `data/categories.ts`, `lib/cardGenerator.ts`, `lib/bingoChecker.ts`, `lib/wordDetector.ts`, `hooks/useSpeechRecognition.ts`, `BingoSquare.tsx`, `TranscriptPanel.tsx`, `vite.config.ts`, `tailwind.config.js` |
| Write from scratch | `lib/utils.ts`, `lib/shareUtils.ts`, `hooks/useLocalStorage.ts`, `hooks/useGame.ts`, `hooks/useBingoDetection.ts`, `BingoCard.tsx`, `LandingPage.tsx`, `CategorySelect.tsx`, `GameBoard.tsx`, `WinScreen.tsx`, `GameControls.tsx`, `ui/Button.tsx`, `ui/Toast.tsx`, `ui/Card.tsx`, `App.tsx` |

**Total: ~32 files** (including config)

---

## Verification

1. `npm run typecheck` — zero errors
2. `npm run build` — clean production build
3. Manual test: Landing → Category → Game → tap 5 in a row → Win screen + confetti
4. Speech test (Chrome): Start listening → speak buzzwords → squares auto-fill → BINGO
5. Mobile test: responsive layout, tap works, share button copies to clipboard
6. `vercel --prod` — deployed and accessible
