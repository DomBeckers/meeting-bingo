import { useState, useCallback } from 'react';
import type { GameState, CategoryId, WinningLine, Toast } from '../types';
import { generateCard } from '../lib/cardGenerator';
import { checkForBingo, countFilled } from '../lib/bingoChecker';

const INITIAL_STATE: GameState = {
  status: 'idle',
  category: null,
  card: null,
  isListening: false,
  startedAt: null,
  completedAt: null,
  winningLine: null,
  winningWord: null,
  filledCount: 0,
};

export function useGame() {
  const [game, setGame] = useState<GameState>(INITIAL_STATE);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const startGame = useCallback((categoryId: CategoryId) => {
    const card = generateCard(categoryId);
    setGame({
      status: 'playing',
      category: categoryId,
      card,
      isListening: false,
      startedAt: Date.now(),
      completedAt: null,
      winningLine: null,
      winningWord: null,
      filledCount: 1,
    });
  }, []);

  const toggleSquare = useCallback((row: number, col: number) => {
    setGame(prev => {
      if (!prev.card || prev.status !== 'playing') return prev;
      const square = prev.card.squares[row][col];
      if (square.isFreeSpace) return prev;

      const newSquares = prev.card.squares.map(r => r.map(s => ({ ...s })));
      const target = newSquares[row][col];
      target.isFilled = !target.isFilled;
      target.isAutoFilled = false;
      target.filledAt = target.isFilled ? Date.now() : null;

      const newCard = { ...prev.card, squares: newSquares };
      const winningLine = checkForBingo(newCard);

      if (winningLine) {
        return {
          ...prev,
          card: newCard,
          status: 'won',
          completedAt: Date.now(),
          winningLine,
          winningWord: target.word,
          filledCount: countFilled(newCard),
        };
      }

      return { ...prev, card: newCard, filledCount: countFilled(newCard) };
    });
  }, []);

  const fillByWord = useCallback((word: string) => {
    let won = false;
    let winLine: WinningLine | null = null;

    setGame(prev => {
      if (!prev.card || prev.status !== 'playing') return prev;

      const newSquares = prev.card.squares.map(r => r.map(s => ({ ...s })));
      let found = false;

      for (const row of newSquares) {
        for (const sq of row) {
          if (sq.word.toLowerCase() === word.toLowerCase() && !sq.isFilled) {
            sq.isFilled = true;
            sq.isAutoFilled = true;
            sq.filledAt = Date.now();
            found = true;
          }
        }
      }

      if (!found) return prev;

      const newCard = { ...prev.card, squares: newSquares };
      winLine = checkForBingo(newCard);

      if (winLine) {
        won = true;
        return {
          ...prev,
          card: newCard,
          status: 'won',
          completedAt: Date.now(),
          winningLine: winLine,
          winningWord: word,
          filledCount: countFilled(newCard),
        };
      }

      return { ...prev, card: newCard, filledCount: countFilled(newCard) };
    });

    if (!won) {
      addToast(`"${word}" detected!`, 'success');
    }

    return { won, winLine };
  }, [addToast]);

  const setListening = useCallback((listening: boolean) => {
    setGame(prev => ({ ...prev, isListening: listening }));
  }, []);

  const resetGame = useCallback(() => {
    setGame(INITIAL_STATE);
  }, []);

  return {
    game,
    toasts,
    dismissToast,
    startGame,
    toggleSquare,
    fillByWord,
    setListening,
    resetGame,
  };
}
