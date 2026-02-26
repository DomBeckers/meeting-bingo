import type { BingoSquare as BingoSquareType } from '../types';
import { cn } from '../lib/utils';

interface Props {
  square: BingoSquareType;
  isWinningSquare: boolean;
  onClick: () => void;
}

export function BingoSquare({ square, isWinningSquare, onClick }: Props) {
  const { word, isFilled, isAutoFilled, isFreeSpace } = square;

  return (
    <button
      onClick={onClick}
      disabled={isFreeSpace}
      className={cn(
        'aspect-square p-1.5 border-2 rounded-lg transition-all duration-200',
        'flex items-center justify-center text-center',
        'text-[10px] sm:text-xs md:text-sm font-medium',
        'hover:scale-105 active:scale-95 touch-manipulation',
        !isFilled && 'bg-white border-gray-200 text-gray-700 hover:border-blue-300',
        isFilled && !isFreeSpace && 'bg-blue-500 border-blue-600 text-white',
        isAutoFilled && 'animate-pulse',
        isFreeSpace && 'bg-amber-100 border-amber-300 text-amber-700 cursor-default',
        isWinningSquare && 'bg-green-500 border-green-600 text-white ring-2 ring-green-300',
      )}
    >
      <span className={cn(
        'break-words leading-tight line-clamp-2 overflow-hidden',
        isFilled && !isFreeSpace && 'line-through opacity-90',
      )}>
        {isFreeSpace ? 'FREE' : word}
      </span>
    </button>
  );
}
