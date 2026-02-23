import React, { useEffect, useState } from 'react';
import { Timer } from 'lucide-react';

interface GameTimerProps {
  duration: number; // seconds
  onTimeUp: () => void;
  running: boolean;
}

const GameTimer: React.FC<GameTimerProps> = ({ duration, onTimeUp, running }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!running || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running, timeLeft <= 0, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isLow = timeLeft <= 30;
  const progress = (timeLeft / duration) * 100;

  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-3">
        <Timer className={`w-5 h-5 ${isLow ? 'text-destructive animate-pulse-glow' : 'text-primary'}`} />
        <h2 className="font-display font-bold text-lg text-foreground">Tempo</h2>
      </div>
      <div
        className={`text-center font-display font-bold text-4xl tabular-nums ${
          isLow ? 'text-destructive' : 'text-foreground'
        }`}
      >
        {minutes}:{seconds.toString().padStart(2, '0')}
      </div>
      <div className="w-full bg-muted rounded-full h-2 mt-3">
        <div
          className={`h-2 rounded-full transition-all duration-1000 ${
            isLow ? 'bg-destructive' : 'bg-primary'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default GameTimer;
