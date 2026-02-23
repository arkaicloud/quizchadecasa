import React, { useState, useCallback, useMemo } from 'react';
import { generateWordSearch, cellKey, PlacedWord } from '@/lib/wordSearchGenerator';
import WordGrid from '@/components/WordGrid';
import WordList from '@/components/WordList';
import GameTimer from '@/components/GameTimer';
import GameOverModal from '@/components/GameOverModal';
import { Search } from 'lucide-react';

const WORDS = ['SUZANO', 'TATUI', 'FAMILIA', 'MEMORIAS', 'GRATIDAO', 'FUTURO', 'SETEANOS'];
const GRID_SIZE = 12;
const GAME_DURATION = 180; // 3 minutes

function createGame() {
  return generateWordSearch(WORDS, GRID_SIZE);
}

const Index = () => {
  const [gameData, setGameData] = useState<ReturnType<typeof generateWordSearch>>(createGame);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [gameKey, setGameKey] = useState(0);

  const foundCells = useMemo(() => {
    const cells = new Set<string>();
    for (const pw of gameData.placedWords) {
      if (foundWords.has(pw.word)) {
        pw.cells.forEach(c => cells.add(cellKey(c.row, c.col)));
      }
    }
    return cells;
  }, [foundWords, gameData.placedWords]);

  const handleWordFound = useCallback((word: string) => {
    setFoundWords(prev => {
      const next = new Set(prev);
      next.add(word);
      if (next.size === WORDS.length) {
        setWon(true);
        setGameOver(true);
      }
      return next;
    });
  }, []);

  const handleTimeUp = useCallback(() => {
    setGameOver(true);
    setWon(false);
  }, []);

  const handleRestart = useCallback(() => {
    setGameData(createGame());
    setFoundWords(new Set());
    setGameOver(false);
    setWon(false);
    setGameKey(k => k + 1);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Search className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-foreground leading-tight">
              Caça-Palavras
            </h1>
            <p className="text-xs text-muted-foreground font-body">
              Encontre as 7 palavras escondidas!
            </p>
          </div>
        </div>
      </header>

      {/* Game Area */}
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Grid */}
          <div className="flex-1 flex justify-center animate-slide-up">
            <WordGrid
              grid={gameData.grid}
              placedWords={gameData.placedWords}
              foundWords={foundWords}
              foundCells={foundCells}
              onWordFound={handleWordFound}
              disabled={gameOver}
            />
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-64 flex flex-col gap-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <GameTimer
              key={gameKey}
              duration={GAME_DURATION}
              onTimeUp={handleTimeUp}
              running={!gameOver}
            />
            <WordList words={WORDS} foundWords={foundWords} />
          </div>
        </div>
      </main>

      {/* Game Over Modal */}
      {gameOver && (
        <GameOverModal
          won={won}
          wordsFound={foundWords.size}
          totalWords={WORDS.length}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};

export default Index;
