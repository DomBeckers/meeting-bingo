import type { GameState, SpeechRecognitionState } from '../types';
import { BingoCard } from './BingoCard';
import { GameControls } from './GameControls';
import { TranscriptPanel } from './TranscriptPanel';
import { CATEGORIES } from '../data/categories';

interface Props {
  game: GameState;
  speech: SpeechRecognitionState;
  detectedWords: string[];
  onSquareClick: (row: number, col: number) => void;
  onToggleListen: () => void;
  onNewCard: () => void;
  onBack: () => void;
}

export function GameBoard({
  game,
  speech,
  detectedWords,
  onSquareClick,
  onToggleListen,
  onNewCard,
  onBack,
}: Props) {
  const category = CATEGORIES.find(c => c.id === game.category);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back
          </button>
          <h1 className="text-lg font-bold text-gray-900">
            {category?.icon} {category?.name}
          </h1>
        </div>

        {game.card && (
          <BingoCard
            card={game.card}
            winningLine={game.winningLine}
            onSquareClick={onSquareClick}
          />
        )}

        <GameControls
          isListening={game.isListening}
          isSupported={speech.isSupported}
          filledCount={game.filledCount}
          onToggleListen={onToggleListen}
          onNewCard={onNewCard}
        />

        {speech.isSupported && (
          <TranscriptPanel
            transcript={speech.transcript}
            interimTranscript={speech.interimTranscript}
            detectedWords={detectedWords}
            isListening={game.isListening}
          />
        )}
      </div>
    </div>
  );
}
