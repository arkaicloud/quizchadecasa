import { useState, useCallback, useRef } from 'react';
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
  const gridRef = useRef<HTMLDivElement>(null);

  const selectedCells = dragStart && dragEnd
    ? getCellsBetween(dragStart, dragEnd)
    : [];

  const selectedKeys = new Set(selectedCells.map(c => cellKey(c.row, c.col)));

  const getCellFromPoint = useCallback((x: number, y: number): { row: number; col: number } | null => {
    const el = document.elementFromPoint(x, y);
    if (!el) return null;
    const row = el.getAttribute('data-row');
    const col = el.getAttribute('data-col');
    if (row === null || col === null) return null;
    return { row: parseInt(row), col: parseInt(col) };
  }, []);

  const handlePointerDown = useCallback((row: number, col: number, e: React.PointerEvent) => {
    if (disabled) return;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setDragStart({ row, col });
    setDragEnd({ row, col });
    setIsDragging(true);
  }, [disabled]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging || disabled) return;
    const cell = getCellFromPoint(e.clientX, e.clientY);
    if (cell) {
      setDragEnd(cell);
    }
  }, [isDragging, disabled, getCellFromPoint]);

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
      ref={gridRef}
      className="inline-grid gap-0.5 sm:gap-1 p-2 sm:p-3 rounded-xl bg-card border border-border glow-primary select-none"
      style={{
        gridTemplateColumns: `repeat(${grid[0]?.length || 12}, minmax(0, 1fr))`,
        touchAction: 'none',
      }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {grid.map((row, r) =>
        row.map((letter, c) => {
          const key = cellKey(r, c);
          const isFound = foundCells.has(key);
          const isSelected = selectedKeys.has(key);

          return (
            <div
              key={key}
              data-row={r}
              data-col={c}
              onPointerDown={(e) => handlePointerDown(r, c, e)}
              className={`
                w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11
                flex items-center justify-center
                rounded-md font-display font-bold text-xs sm:text-sm md:text-lg
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
