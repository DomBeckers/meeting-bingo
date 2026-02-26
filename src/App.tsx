import { useCallback, useRef, useState } from 'react';
import type { CategoryId } from './types';
import { useGame } from './hooks/useGame';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { detectWordsWithAliases } from './lib/wordDetector';
import { LandingPage } from './components/LandingPage';
import { CategorySelect } from './components/CategorySelect';
import { GameBoard } from './components/GameBoard';
import { WinScreen } from './components/WinScreen';
import { ToastContainer } from './components/ui/Toast';

type Screen = 'landing' | 'category' | 'game' | 'win';

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const { game, toasts, dismissToast, startGame, toggleSquare, fillByWord, setListening, resetGame } = useGame();
  const speech = useSpeechRecognition();
  const [detectedWords, setDetectedWords] = useState<string[]>([]);
  const filledWordsRef = useRef<Set<string>>(new Set());

  const handleSpeechResult = useCallback((transcript: string) => {
    if (!game.card || game.status !== 'playing') return;

    const matches = detectWordsWithAliases(transcript, game.card.words, filledWordsRef.current);
    for (const word of matches) {
      filledWordsRef.current.add(word.toLowerCase());
      setDetectedWords(prev => [...prev, word]);
      const result = fillByWord(word);
      if (result.won) {
        speech.stopListening();
        setScreen('win');
      }
    }
  }, [game.card, game.status, fillByWord, speech]);

  const handleStart = () => setScreen('category');

  const handleCategorySelect = (categoryId: CategoryId) => {
    startGame(categoryId);
    filledWordsRef.current = new Set();
    setDetectedWords([]);
    setScreen('game');
  };

  const handleToggleListen = () => {
    if (game.isListening) {
      speech.stopListening();
      setListening(false);
    } else {
      speech.startListening(handleSpeechResult);
      setListening(true);
    }
  };

  const handleNewCard = () => {
    speech.stopListening();
    setListening(false);
    filledWordsRef.current = new Set();
    setDetectedWords([]);
    setScreen('category');
  };

  const handleSquareClick = (row: number, col: number) => {
    toggleSquare(row, col);
    if (game.status === 'won') {
      speech.stopListening();
      setListening(false);
      setScreen('win');
    }
  };

  // Check if game just won from toggle
  if (game.status === 'won' && screen === 'game') {
    speech.stopListening();
    setListening(false);
    setScreen('win');
  }

  const handlePlayAgain = () => {
    filledWordsRef.current = new Set();
    setDetectedWords([]);
    setScreen('category');
  };

  const handleHome = () => {
    speech.stopListening();
    setListening(false);
    resetGame();
    filledWordsRef.current = new Set();
    setDetectedWords([]);
    setScreen('landing');
  };

  return (
    <>
      {screen === 'landing' && <LandingPage onStart={handleStart} />}
      {screen === 'category' && (
        <CategorySelect onSelect={handleCategorySelect} onBack={handleHome} />
      )}
      {screen === 'game' && game.card && (
        <GameBoard
          game={game}
          speech={speech}
          detectedWords={detectedWords}
          onSquareClick={handleSquareClick}
          onToggleListen={handleToggleListen}
          onNewCard={handleNewCard}
          onBack={handleHome}
        />
      )}
      {screen === 'win' && (
        <WinScreen game={game} onPlayAgain={handlePlayAgain} onHome={handleHome} />
      )}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
