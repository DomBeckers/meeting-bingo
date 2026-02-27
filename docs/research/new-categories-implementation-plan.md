# Plan: Add 3 New Bingo Categories (Traffic, Kids, Hockey)

## Context
The app currently has 3 bingo categories (Agile, Corporate, Tech). The user wants 3 new ones: **Traffic**, **Kids**, and **Hockey**, following the same structure.

## Files to Modify

### 1. `src/types/index.ts`
- Add `'traffic' | 'kids' | 'hockey'` to the `CategoryId` union type

### 2. `src/data/categories.ts`
- Add 3 new category objects to the `categories` array, each with:
  - `id`, `name`, `description`, `icon`, `words` (45 words each)

**Traffic** (icon: 🚗) — road rage bingo: "merge", "turn signal", "rubbernecking", "construction zone", "detour", "tailgating", "road rage", "pothole", "speed trap", "fender bender", etc.

**Kids** (icon: 👶) — parenting/kid phrases bingo: "are we there yet", "I'm bored", "snack time", "screen time", "bedtime", "tantrum", "play date", "time out", "nap time", "because I said so", etc.

**Hockey** (icon: 🏒) — hockey commentary bingo: "power play", "hat trick", "icing", "penalty box", "face-off", "breakaway", "slap shot", "top shelf", "five hole", "offside", etc.

## Steps
1. Update `CategoryId` type in `src/types/index.ts`
2. Add 3 new category entries (45 words each) in `src/data/categories.ts`
3. No other files need changes — the app dynamically renders from the categories array

## Verification
- `npm run typecheck` — confirm no type errors
- `npm run lint` — confirm no lint issues
- `npm run dev` — open app, confirm all 6 categories appear on the category select screen and each generates a valid bingo card
