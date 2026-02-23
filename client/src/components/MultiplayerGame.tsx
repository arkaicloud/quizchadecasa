import { useState, useCallback, useMemo, useEffect } from 'react';
import { apiRequest } from '@/lib/api';
import { cellKey, PlacedWord } from '@/lib/wordSearchGenerator';
import WordGrid from '@/components/WordGrid';
import WordList from '@/components/WordList';
import GameTimer from '@/components/GameTimer';
import { Search, Trophy, Clock, RotateCcw, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GAME_DURATION = 180;

interface MultiplayerGameProps {
  roomId: string;
  playerId: string;
  playerName: string;
  isAdmin: boolean;
  onBackToLobby: () => void;
}

interface PlayerProgress {
  id: string;
  name: string;
  wordsFound: string[];
  isAdmin: boolean;
}

const MultiplayerGame: React.FC<MultiplayerGameProps> = ({
  roomId,
  playerId,
  playerName,
  isAdmin,
  onBackToLobby,
}) => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [placedWords, setPlacedWords] = useState<PlacedWord[]>([]);
  const [words, setWords] = useState<string[]>([]);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [gameOver, setGameOver] = useState(false);
  const [winnerName, setWinnerName] = useState<string | null>(null);
  const [players, setPlayers] = useState<PlayerProgress[]>([]);
  const [timerKey, setTimerKey] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const room = await apiRequest('GET', `/api/rooms/${roomId}`);
        setGrid(room.grid as any);
        setPlacedWords(room.placedWords as any);
        setWords(room.words as string[]);
        if (room.status === 'finished') {
          setGameOver(true);
          setWinnerName(room.winnerName);
        }

        const playerData = await apiRequest('GET', `/api/rooms/${roomId}/players`);
        setPlayers(playerData);

        const me = playerData?.find((p: any) => p.id === playerId);
        if (me) setFoundWords(new Set(me.wordsFound || []));
      } catch {}
    };
    load();
  }, [roomId, playerId]);

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(async () => {
      try {
        const playerData = await apiRequest('GET', `/api/rooms/${roomId}/players`);
        setPlayers(playerData);

        const room = await apiRequest('GET', `/api/rooms/${roomId}`);
        if (room.status === 'finished') {
          setGameOver(true);
          setWinnerName(room.winnerName);
        }
      } catch {}
    }, 2000);

    return () => clearInterval(interval);
  }, [roomId, gameOver]);

  const foundCells = useMemo(() => {
    const cells = new Set<string>();
    for (const pw of placedWords) {
      if (foundWords.has(pw.word)) {
        pw.cells.forEach(c => cells.add(cellKey(c.row, c.col)));
      }
    }
    return cells;
  }, [foundWords, placedWords]);

  const handleWordFound = useCallback(async (word: string) => {
    if (gameOver) return;
    setFoundWords(prev => {
      const next = new Set(prev);
      next.add(word);

      const newArr = Array.from(next);
      apiRequest('PATCH', `/api/players/${playerId}`, { wordsFound: newArr });

      if (next.size === words.length) {
        apiRequest('PATCH', `/api/rooms/${roomId}`, { status: 'finished', winnerName: playerName });
      }

      return next;
    });
  }, [gameOver, playerId, playerName, roomId, words.length]);

  const handleTimeUp = useCallback(async () => {
    if (gameOver) return;
    setGameOver(true);
    if (isAdmin) {
      await apiRequest('PATCH', `/api/rooms/${roomId}`, { status: 'finished', winnerName: null });
    }
  }, [gameOver, isAdmin, roomId]);

  if (!grid.length) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground font-display">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Search className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h1 className="font-display font-bold text-xl text-foreground leading-tight">
              Caça-Palavras
            </h1>
            <p className="text-xs text-muted-foreground font-body">
              Sala: <span className="text-primary font-semibold">{roomId}</span> · {playerName}
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 container max-w-5xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="flex-1 flex justify-center">
            <WordGrid
              grid={grid}
              placedWords={placedWords}
              foundWords={foundWords}
              foundCells={foundCells}
              onWordFound={handleWordFound}
              disabled={gameOver}
            />
          </div>

          <div className="w-full lg:w-64 flex flex-col gap-4">
            <GameTimer
              key={timerKey}
              duration={GAME_DURATION}
              onTimeUp={handleTimeUp}
              running={!gameOver}
            />
            <WordList words={words} foundWords={foundWords} />

            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-primary" />
                <h2 className="font-display font-bold text-lg text-foreground">Placar</h2>
              </div>
              <ul className="space-y-2">
                {players
                  .sort((a, b) => (b.wordsFound?.length || 0) - (a.wordsFound?.length || 0))
                  .map((p) => (
                    <li key={p.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50" data-testid={`row-player-${p.id}`}>
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="font-display font-bold text-primary text-xs">
                          {p.name[0]?.toUpperCase()}
                        </span>
                      </div>
                      <span className="font-body text-sm text-foreground flex-1">
                        {p.name}
                        {p.id === playerId && <span className="text-muted-foreground text-xs"> (você)</span>}
                      </span>
                      <span className="font-display font-bold text-primary text-sm">
                        {p.wordsFound?.length || 0}/{words.length}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      {gameOver && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 animate-pop-in">
          <div className={`bg-card border-2 rounded-2xl p-8 max-w-sm w-full mx-4 text-center ${
            winnerName ? 'border-success glow-success' : 'border-destructive'
          }`}>
            <div className="mb-4">
              {winnerName ? (
                <Trophy className="w-16 h-16 text-primary mx-auto animate-pop-in" />
              ) : (
                <Clock className="w-16 h-16 text-destructive mx-auto" />
              )}
            </div>
            <h2 className="font-display font-bold text-3xl text-foreground mb-2">
              {winnerName ? 'Fim de Jogo!' : 'Tempo Esgotado!'}
            </h2>
            <p className="text-muted-foreground font-body mb-1">
              {winnerName
                ? winnerName === playerName
                  ? 'Você venceu! Parabéns!'
                  : `${winnerName} encontrou todas as palavras!`
                : 'Ninguém encontrou todas as palavras a tempo.'}
            </p>
            <p className="font-display font-bold text-xl text-primary mb-6">
              Você: {foundWords.size}/{words.length} palavras
            </p>
            <Button
              data-testid="button-back-lobby"
              onClick={onBackToLobby}
              className="w-full gap-2 font-display font-bold text-lg py-6"
            >
              <RotateCcw className="w-5 h-5" />
              Voltar ao Lobby
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiplayerGame;
