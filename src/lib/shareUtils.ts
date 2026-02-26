import type { GameState } from '../types';

function buildShareText(game: GameState): string {
  const duration = game.startedAt && game.completedAt
    ? Math.round((game.completedAt - game.startedAt) / 1000 / 60)
    : null;

  const lines = [
    '🎯 Meeting Bingo!',
    `I got BINGO in ${duration ? `${duration} min` : 'record time'}!`,
    `${game.filledCount}/25 squares filled`,
    '',
    'meetingbingo.vercel.app',
  ];

  return lines.join('\n');
}

export async function share(game: GameState): Promise<void> {
  const text = buildShareText(game);

  if (navigator.share) {
    await navigator.share({ text });
  } else {
    await navigator.clipboard.writeText(text);
  }
}
