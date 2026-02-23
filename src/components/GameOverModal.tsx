import React from 'react';
import { Trophy, Clock, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GameOverModalProps {
  won: boolean;
  wordsFound: number;
  totalWords: number;
  onRestart: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({
  won,
  wordsFound,
  totalWords,
  onRestart,
}) => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 animate-pop-in">
      <div
        className={`bg-card border-2 rounded-2xl p-8 max-w-sm w-full mx-4 text-center ${
          won ? 'border-success glow-success' : 'border-destructive'
        }`}
      >
        <div className="mb-4">
          {won ? (
            <Trophy className="w-16 h-16 text-primary mx-auto animate-pop-in" />
          ) : (
            <Clock className="w-16 h-16 text-destructive mx-auto" />
          )}
        </div>
        <h2 className="font-display font-bold text-3xl text-foreground mb-2">
          {won ? '🎉 Parabéns!' : '⏰ Tempo Esgotado!'}
        </h2>
        <p className="text-muted-foreground font-body mb-1">
          {won
            ? 'Você encontrou todas as palavras!'
            : 'Não foi desta vez...'}
        </p>
        <p className="font-display font-bold text-xl text-primary mb-6">
          {wordsFound}/{totalWords} palavras
        </p>
        <Button
          onClick={onRestart}
          className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-display font-bold text-lg py-6"
        >
          <RotateCcw className="w-5 h-5" />
          Jogar Novamente
        </Button>
      </div>
    </div>
  );
};

export default GameOverModal;
