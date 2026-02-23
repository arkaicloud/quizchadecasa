import React from 'react';
import { Check } from 'lucide-react';

interface WordListProps {
  words: string[];
  foundWords: Set<string>;
}

const WordList: React.FC<WordListProps> = ({ words, foundWords }) => {
  const total = words.length;
  const found = foundWords.size;

  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-bold text-lg text-foreground">Palavras</h2>
        <span className="font-display font-bold text-primary text-lg">
          {found}/{total}
        </span>
      </div>
      <div className="w-full bg-muted rounded-full h-2 mb-4">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-500"
          style={{ width: `${(found / total) * 100}%` }}
        />
      </div>
      <ul className="space-y-2">
        {words.map((word) => {
          const isFound = foundWords.has(word.toUpperCase());
          return (
            <li
              key={word}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                isFound
                  ? 'bg-success/10 text-success'
                  : 'text-foreground/70'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  isFound ? 'bg-success' : 'border-2 border-muted-foreground/30'
                }`}
              >
                {isFound && <Check className="w-3 h-3 text-success-foreground" />}
              </div>
              <span
                className={`font-display font-semibold tracking-wide ${
                  isFound ? 'line-through opacity-70' : ''
                }`}
              >
                {word.toUpperCase()}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default WordList;
