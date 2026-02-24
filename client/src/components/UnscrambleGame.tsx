import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { apiRequest } from '@/lib/api';
import Confetti from '@/components/Confetti';
import { Shuffle, Trophy, Clock, RotateCcw, Users, Medal, Crown, Check, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const GAME_DURATION = 300;

interface WordPair {
  scrambled: string;
  original: string;
}

interface UnscrambleGameProps {
  roomId: string;
  playerId: string;
  playerName: string;
  isAdmin: boolean;
  onBackToLobby: () => void;
}

interface PlayerProgress {
  id: string;
  name: string;
  wordsGuessed: string[];
  score: number;
  isAdmin: boolean;
}

const UnscrambleGame: React.FC<UnscrambleGameProps> = ({
  roomId,
  playerId,
  playerName,
  isAdmin,
  onBackToLobby,
}) => {
  const [words, setWords] = useState<WordPair[]>([]);
  const [guessedWords, setGuessedWords] = useState<Set<string>>(new Set());
  const [gameOver, setGameOver] = useState(false);
  const [winnerName, setWinnerName] = useState<string | null>(null);
  const [players, setPlayers] = useState<PlayerProgress[]>([]);
  const [showRanking, setShowRanking] = useState(false);
  const [currentGuess, setCurrentGuess] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const room = await apiRequest('GET', `/api/unscramble/rooms/${roomId}`);
        setWords(room.words as WordPair[]);
        if (room.status === 'finished') {
          setGameOver(true);
          setWinnerName(room.winnerName);
        }

        const playerData = await apiRequest('GET', `/api/unscramble/rooms/${roomId}/players`);
        setPlayers(playerData);

        const me = playerData?.find((p: any) => p.id === playerId);
        if (me) {
          setGuessedWords(new Set(me.wordsGuessed || []));
        }
      } catch {}
    };
    load();
  }, [roomId, playerId]);

  useEffect(() => {
    if (gameOver || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          setGameOver(true);
          if (isAdmin) {
            apiRequest('PATCH', `/api/unscramble/rooms/${roomId}`, { status: 'finished', winnerName: null });
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameOver, timeLeft <= 0, isAdmin, roomId]);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(async () => {
      try {
        const playerData = await apiRequest('GET', `/api/unscramble/rooms/${roomId}/players`);
        setPlayers(playerData);

        const room = await apiRequest('GET', `/api/unscramble/rooms/${roomId}`);
        if (room.status === 'finished') {
          setGameOver(true);
          setWinnerName(room.winnerName);
        }
      } catch {}
    }, 2000);
    return () => clearInterval(interval);
  }, [roomId, gameOver]);

  const normalizeText = (text: string) => {
    return text.toUpperCase().trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Z]/g, '');
  };

  const handleGuess = useCallback(async () => {
    if (gameOver || !currentGuess.trim() || !words.length) return;

    const currentWord = words[currentWordIndex];
    const normalizedGuess = normalizeText(currentGuess);
    const normalizedOriginal = normalizeText(currentWord.original);

    if (normalizedGuess === normalizedOriginal) {
      setFeedback('correct');
      const newGuessed = new Set(guessedWords);
      newGuessed.add(currentWord.original);
      setGuessedWords(newGuessed);

      const guessedArr = Array.from(newGuessed);
      await apiRequest('PATCH', `/api/unscramble/players/${playerId}`, {
        wordsGuessed: guessedArr,
        score: guessedArr.length,
      });

      if (newGuessed.size === words.length) {
        await apiRequest('PATCH', `/api/unscramble/rooms/${roomId}`, {
          status: 'finished',
          winnerName: playerName,
        });
        setGameOver(true);
        setWinnerName(playerName);
      } else {
        setTimeout(() => {
          let nextIndex = currentWordIndex;
          for (let i = 1; i <= words.length; i++) {
            const idx = (currentWordIndex + i) % words.length;
            if (!newGuessed.has(words[idx].original)) {
              nextIndex = idx;
              break;
            }
          }
          setCurrentWordIndex(nextIndex);
          setCurrentGuess('');
          setFeedback(null);
          inputRef.current?.focus();
        }, 800);
      }
    } else {
      setFeedback('wrong');
      setTimeout(() => {
        setFeedback(null);
        setCurrentGuess('');
        inputRef.current?.focus();
      }, 1000);
    }
  }, [gameOver, currentGuess, words, currentWordIndex, guessedWords, playerId, roomId, playerName]);

  const handleSkip = useCallback(() => {
    if (gameOver) return;
    let nextIndex = currentWordIndex;
    for (let i = 1; i <= words.length; i++) {
      const idx = (currentWordIndex + i) % words.length;
      if (!guessedWords.has(words[idx].original)) {
        nextIndex = idx;
        break;
      }
    }
    setCurrentWordIndex(nextIndex);
    setCurrentGuess('');
    setFeedback(null);
    inputRef.current?.focus();
  }, [gameOver, currentWordIndex, words, guessedWords]);

  const rankedPlayers = useMemo(() => {
    return [...players].sort((a, b) => (b.score || 0) - (a.score || 0));
  }, [players]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isLow = timeLeft <= 30;
  const currentWord = words[currentWordIndex];

  if (!words.length) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground font-display">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Shuffle className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h1 className="font-display font-bold text-xl text-foreground leading-tight">
              Desembaralha
            </h1>
            <p className="text-xs text-muted-foreground font-body">
              Sala: <span className="text-primary font-semibold">{roomId}</span> · {playerName}
            </p>
          </div>
          <div className={`font-display font-bold text-2xl tabular-nums ${isLow ? 'text-destructive' : 'text-foreground'}`}>
            {minutes}:{seconds.toString().padStart(2, '0')}
          </div>
        </div>
      </header>

      <main className="flex-1 container max-w-5xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="flex-1 w-full">
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 mb-4">
              <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground font-body mb-2">
                  Palavra {Math.min(guessedWords.size + 1, words.length)} de {words.length}
                </p>
                <div className="bg-muted rounded-xl py-6 px-4 mb-6">
                  <p className="text-xs text-muted-foreground font-body mb-2">Desembaralhe esta palavra:</p>
                  <p className="font-display font-bold text-4xl sm:text-5xl text-primary tracking-widest" data-testid="text-scrambled-word">
                    {guessedWords.has(currentWord?.original) ? '✓' : currentWord?.scrambled}
                  </p>
                </div>

                <div className="flex gap-2 max-w-md mx-auto">
                  <Input
                    ref={inputRef}
                    data-testid="input-guess"
                    value={currentGuess}
                    onChange={(e) => setCurrentGuess(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
                    placeholder="Digite a palavra..."
                    disabled={gameOver || guessedWords.has(currentWord?.original)}
                    className={`bg-muted border-2 font-body text-lg text-center uppercase transition-colors ${
                      feedback === 'correct' ? 'border-green-500 bg-green-50' :
                      feedback === 'wrong' ? 'border-destructive bg-red-50' :
                      'border-border'
                    }`}
                    autoComplete="off"
                  />
                  <Button
                    data-testid="button-submit-guess"
                    onClick={handleGuess}
                    disabled={gameOver || !currentGuess.trim() || guessedWords.has(currentWord?.original)}
                    size="icon"
                    className="shrink-0 h-10 w-10"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>

                {feedback === 'correct' && (
                  <p className="text-green-600 font-display font-bold mt-3 animate-pop-in" data-testid="text-feedback-correct">
                    Correto!
                  </p>
                )}
                {feedback === 'wrong' && (
                  <p className="text-destructive font-display font-bold mt-3" data-testid="text-feedback-wrong">
                    Tente novamente!
                  </p>
                )}

                <Button
                  data-testid="button-skip"
                  onClick={handleSkip}
                  variant="ghost"
                  disabled={gameOver}
                  className="mt-3 text-muted-foreground font-body"
                >
                  Pular →
                </Button>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-display font-bold text-sm text-foreground mb-3">Progresso</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {words.map((wp, i) => {
                  const isGuessed = guessedWords.has(wp.original);
                  const isCurrent = i === currentWordIndex && !isGuessed;
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        if (!isGuessed && !gameOver) {
                          setCurrentWordIndex(i);
                          setCurrentGuess('');
                          setFeedback(null);
                          inputRef.current?.focus();
                        }
                      }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all text-sm ${
                        isGuessed
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : isCurrent
                            ? 'bg-primary/10 text-primary border border-primary/30'
                            : 'bg-muted/50 text-foreground/70 hover:bg-muted'
                      }`}
                      data-testid={`button-word-${i}`}
                    >
                      {isGuessed ? (
                        <Check className="w-4 h-4 text-green-600 shrink-0" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border-2 border-current shrink-0 opacity-40" />
                      )}
                      <span className={`font-display font-semibold truncate ${isGuessed ? 'line-through opacity-70' : ''}`}>
                        {isGuessed ? wp.original : wp.scrambled}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="w-full bg-muted rounded-full h-2 mt-3">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(guessedWords.size / words.length) * 100}%` }}
                />
              </div>
              <p className="text-center font-display font-bold text-primary text-sm mt-2">
                {guessedWords.size}/{words.length}
              </p>
            </div>
          </div>

          <div className="w-full lg:w-64 flex flex-col gap-4">
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-primary" />
                <h2 className="font-display font-bold text-lg text-foreground">Placar</h2>
              </div>
              <ul className="space-y-2">
                {rankedPlayers.map((p) => (
                  <li key={p.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50" data-testid={`row-unscramble-player-${p.id}`}>
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
                      {p.score || 0}/{words.length}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      {gameOver && (
        <>
          {winnerName && <Confetti />}
          <div className="fixed inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-50 animate-pop-in">
            <div className={`bg-card border-2 rounded-2xl p-8 max-w-sm w-full mx-4 text-center ${
              winnerName ? 'border-primary glow-success' : 'border-destructive'
            }`}>

              {!showRanking ? (
                <>
                  <div className="mb-4">
                    {winnerName ? (
                      <div className="relative inline-block">
                        <Trophy className="w-20 h-20 text-primary mx-auto animate-pop-in" />
                        <Crown className="w-8 h-8 text-yellow-400 absolute -top-3 left-1/2 -translate-x-1/2 animate-pop-in" style={{ animationDelay: '0.2s' }} />
                      </div>
                    ) : (
                      <Clock className="w-20 h-20 text-destructive mx-auto" />
                    )}
                  </div>

                  {winnerName ? (
                    <>
                      <h2 className="font-display font-bold text-2xl text-foreground mb-3">
                        Fim de Jogo!
                      </h2>
                      <div className="bg-primary/10 border border-primary/30 rounded-xl py-4 px-6 mb-4">
                        <p className="text-sm text-primary/80 font-body mb-1">Vencedor</p>
                        <p className="font-display font-bold text-3xl text-primary winner-glow">
                          {winnerName}
                        </p>
                        {winnerName === playerName && (
                          <p className="text-sm text-primary font-body mt-1">Parabéns, você venceu!</p>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="font-display font-bold text-2xl text-foreground mb-2">
                        Tempo Esgotado!
                      </h2>
                      <p className="text-muted-foreground font-body mb-4">
                        Ninguém desembaralhou todas as palavras a tempo.
                      </p>
                    </>
                  )}

                  <p className="font-display font-bold text-lg text-primary mb-5">
                    Você: {guessedWords.size}/{words.length} palavras
                  </p>

                  <div className="space-y-2">
                    <Button
                      data-testid="button-unscramble-ranking"
                      onClick={() => setShowRanking(true)}
                      className="w-full gap-2 font-display font-bold text-lg py-6"
                    >
                      <Medal className="w-5 h-5" />
                      Ver Ranking
                    </Button>
                    <Button
                      data-testid="button-unscramble-back-lobby"
                      onClick={onBackToLobby}
                      variant="secondary"
                      className="w-full gap-2 font-display font-semibold py-5"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Voltar ao Menu
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center gap-2 mb-5">
                    <Medal className="w-7 h-7 text-primary" />
                    <h2 className="font-display font-bold text-2xl text-foreground">
                      Ranking Final
                    </h2>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {rankedPlayers.map((p, index) => {
                      const medalColors = ['text-yellow-400', 'text-gray-400', 'text-amber-600'];
                      return (
                        <li
                          key={p.id}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                            index === 0 ? 'bg-primary/15 border border-primary/30' : 'bg-muted/50'
                          }`}
                          data-testid={`ranking-unscramble-player-${p.id}`}
                        >
                          <span className={`font-display font-bold text-xl w-7 text-center ${
                            index < 3 ? medalColors[index] : 'text-muted-foreground'
                          }`}>
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`}
                          </span>
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="font-display font-bold text-primary text-sm">
                              {p.name[0]?.toUpperCase()}
                            </span>
                          </div>
                          <span className={`font-body flex-1 text-left ${
                            index === 0 ? 'font-bold text-primary' : 'text-foreground'
                          }`}>
                            {p.name}
                            {p.id === playerId && <span className="text-muted-foreground text-xs"> (você)</span>}
                          </span>
                          <span className={`font-display font-bold text-sm ${
                            index === 0 ? 'text-primary' : 'text-muted-foreground'
                          }`}>
                            {p.score || 0}/{words.length}
                          </span>
                        </li>
                      );
                    })}
                  </ul>

                  <Button
                    data-testid="button-unscramble-back-lobby-2"
                    onClick={onBackToLobby}
                    className="w-full gap-2 font-display font-bold text-lg py-6"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Voltar ao Menu
                  </Button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UnscrambleGame;
