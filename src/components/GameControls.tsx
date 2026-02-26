import { Button } from './ui/Button';
import { cn } from '../lib/utils';

interface Props {
  isListening: boolean;
  isSupported: boolean;
  filledCount: number;
  onToggleListen: () => void;
  onNewCard: () => void;
}

export function GameControls({ isListening, isSupported, filledCount, onToggleListen, onNewCard }: Props) {
  return (
    <div className="flex items-center justify-between gap-3 mt-4">
      <div className="flex items-center gap-3">
        {isSupported && (
          <Button
            variant={isListening ? 'primary' : 'secondary'}
            size="sm"
            onClick={onToggleListen}
          >
            <span className={cn(
              'inline-block w-2 h-2 rounded-full mr-2',
              isListening ? 'bg-red-300 animate-pulse' : 'bg-gray-400',
            )} />
            {isListening ? 'Listening...' : 'Start Listening'}
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={onNewCard}>
          New Card
        </Button>
      </div>
      <span className="text-sm text-gray-500">{filledCount}/25</span>
    </div>
  );
}
