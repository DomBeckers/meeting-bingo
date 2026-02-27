import { Button } from './ui/Button';

interface Props {
  onStart: () => void;
}

export function LandingPage({ onStart }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-pink-100 to-pink-50">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🎯</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Meeting Bingo</h1>
        <p className="text-lg text-gray-600 mb-8">
          Turn your meetings into a game! Listen for buzzwords and fill your bingo card automatically.
        </p>

        <Button size="lg" onClick={onStart}>
          New Game
        </Button>

        <div className="mt-12 text-left space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">How it works</h2>
          <div className="space-y-3">
            <div className="flex gap-3 items-start">
              <span className="text-xl">1️⃣</span>
              <p className="text-sm text-gray-600">Pick a buzzword category</p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-xl">2️⃣</span>
              <p className="text-sm text-gray-600">Start listening during your meeting</p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-xl">3️⃣</span>
              <p className="text-sm text-gray-600">Squares fill automatically when buzzwords are spoken — or tap manually</p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-xl">4️⃣</span>
              <p className="text-sm text-gray-600">Get 5 in a row for BINGO!</p>
            </div>
          </div>
        </div>

        <p className="mt-8 text-xs text-gray-400">
          Audio is processed locally in your browser. Nothing is recorded or sent anywhere.
        </p>
      </div>
    </div>
  );
}
