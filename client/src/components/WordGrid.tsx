import React, { useState, useCallback } from 'react';
import { cellKey, getCellsBetween, checkSelection, PlacedWord } from '@/lib/wordSearchGenerator';

interface WordGridProps {
  grid: string[][];
  placedWords: PlacedWord[];
  foundWords: Set<string>;
  foundCells: Set<string>;
  onWordFound: (word: string) => void;
  disabled: boolean;
}

const WordGrid: React.FC<WordGridProps> = ({
  grid,
  placedWords,
  foundWords,
  foundCells,
  onWordFound,
  disabled,
}) => {
  const [dragStart, setDragStart] = useState<{ row: number; col: number } | null>(null);
  const [dragEnd, setDragEnd] = useState<{ row: number; col: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const selectedCells = dragStart && dragEnd
    ? getCellsBetween(dragStart, dragEnd)
    : [];

  const selectedKeys = new Set(selectedCells.map(c => cellKey(c.row, c.col)));

  const handlePointerDown = useCallback((row: number, col: number) => {
    if (disabled) return;
    setDragStart({ row, col });
    setDragEnd({ row, col });
    setIsDragging(true);
  }, [disabled]);

  const handlePointerEnter = useCallback((row: number, col: number) => {
    if (!isDragging || disabled) return;
    setDragEnd({ row, col });
  }, [isDragging, disabled]);

  const handlePointerUp = useCallback(() => {
    if (!isDragging || disabled) return;
    setIsDragging(false);

    if (selectedCells.length > 1) {
      const word = checkSelection(selectedCells, placedWords, foundWords);
      if (word) {
        onWordFound(word);
      }
    }

    setDragStart(null);
    setDragEnd(null);
  }, [isDragging, disabled, selectedCells, placedWords, foundWords, onWordFound]);

  return (
    <div
      className="inline-grid gap-1 p-3 rounded-xl bg-card border border-border glow-primary select-none touch-none"
      style={{
        gridTemplateColumns: `repeat(${grid[0]?.length || 12}, minmax(0, 1fr))`,
      }}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {grid.map((row, r) =>
        row.map((letter, c) => {
          const key = cellKey(r, c);
          const isFound = foundCells.has(key);
          const isSelected = selectedKeys.has(key);

          return (
            <div
              key={key}
              onPointerDown={() => handlePointerDown(r, c)}
              onPointerEnter={() => handlePointerEnter(r, c)}
              className={`
                w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11
                flex items-center justify-center
                rounded-md font-display font-bold text-sm sm:text-base md:text-lg
                transition-all duration-150
                ${isFound
                  ? 'grid-cell-found'
                  : isSelected
                    ? 'grid-cell-selected'
                    : 'grid-cell'
                }
              `}
            >
              {letter}
            </div>
          );
        })
      )}
    </div>
  );
};

export default WordGrid;
