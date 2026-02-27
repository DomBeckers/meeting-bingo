import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { GameState } from '../types';
import { BingoCard } from './BingoCard';
import { Button } from './ui/Button';
import { share } from '../lib/shareUtils';

interface Props {
  game: GameState;
  onPlayAgain: () => void;
  onHome: () => void;
}

export function WinScreen({ game, onPlayAgain, onHome }: Props) {
  useEffect(() => {
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
  }, []);

  const duration = game.startedAt && game.completedAt
    ? Math.round((game.completedAt - game.startedAt) / 1000 / 60)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-200 to-pink-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <h1 className="text-5xl font-bold text-green-600 mb-2 animate-bounce-in">BINGO!</h1>
        <p className="text-gray-600 mb-6">
          {game.winningWord && <>The winning word was <strong>"{game.winningWord}"</strong></>}
        </p>

        {game.card && (
          <div className="mb-6">
            <BingoCard
              card={game.card}
              winningLine={game.winningLine}
              onSquareClick={() => {}}
            />
          </div>
        )}

        <div className="flex gap-2 justify-center mb-4">
          <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{game.filledCount}/25</div>
            <div className="text-xs text-gray-500">Squares</div>
          </div>
          {duration !== null && (
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
              <div className="text-2xl font-bold text-gray-900">{duration}m</div>
              <div className="text-xs text-gray-500">Duration</div>
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-center">
          <Button onClick={onPlayAgain}>Play Again</Button>
          <Button variant="secondary" onClick={() => share(game)}>
            Share
          </Button>
          <Button variant="ghost" onClick={onHome}>Home</Button>
        </div>
      </div>
    </div>
  );
}
