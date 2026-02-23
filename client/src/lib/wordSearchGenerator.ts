export interface PlacedWord {
  word: string;
  cells: { row: number; col: number }[];
}

export interface GridData {
  grid: string[][];
  placedWords: PlacedWord[];
}

type Direction = [number, number];

const DIRECTIONS: Direction[] = [
  [0, 1],   // horizontal right
  [1, 0],   // vertical down
  [1, 1],   // diagonal down-right
  [-1, 1],  // diagonal up-right
  [0, -1],  // horizontal left
  [-1, 0],  // vertical up
  [-1, -1], // diagonal up-left
  [1, -1],  // diagonal down-left
];

const FILLER_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function canPlace(
  grid: string[][],
  word: string,
  row: number,
  col: number,
  dir: Direction,
  size: number
): boolean {
  for (let i = 0; i < word.length; i++) {
    const r = row + dir[0] * i;
    const c = col + dir[1] * i;
    if (r < 0 || r >= size || c < 0 || c >= size) return false;
    if (grid[r][c] !== '' && grid[r][c] !== word[i]) return false;
  }
  return true;
}

function placeWord(
  grid: string[][],
  word: string,
  row: number,
  col: number,
  dir: Direction
): PlacedWord {
  const cells: { row: number; col: number }[] = [];
  for (let i = 0; i < word.length; i++) {
    const r = row + dir[0] * i;
    const c = col + dir[1] * i;
    grid[r][c] = word[i];
    cells.push({ row: r, col: c });
  }
  return { word, cells };
}

export function generateWordSearch(
  words: string[],
  size: number = 12
): GridData {
  const grid: string[][] = Array.from({ length: size }, () =>
    Array(size).fill('')
  );
  const placedWords: PlacedWord[] = [];
  const sortedWords = [...words].sort((a, b) => b.length - a.length);

  for (const rawWord of sortedWords) {
    const word = rawWord.toUpperCase();
    let placed = false;
    const dirs = shuffle(DIRECTIONS);

    for (let attempt = 0; attempt < 200 && !placed; attempt++) {
      const dir = dirs[attempt % dirs.length];
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);

      if (canPlace(grid, word, row, col, dir, size)) {
        placedWords.push(placeWord(grid, word, row, col, dir));
        placed = true;
      }
    }

    if (!placed) {
      // Try every position systematically
      for (let r = 0; r < size && !placed; r++) {
        for (let c = 0; c < size && !placed; c++) {
          for (const dir of dirs) {
            if (canPlace(grid, word, r, c, dir, size)) {
              placedWords.push(placeWord(grid, word, r, c, dir));
              placed = true;
            }
          }
        }
      }
    }
  }

  // Fill empty cells
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = FILLER_LETTERS[Math.floor(Math.random() * FILLER_LETTERS.length)];
      }
    }
  }

  return { grid, placedWords };
}

export function cellKey(row: number, col: number): string {
  return `${row}-${col}`;
}

export function checkSelection(
  selectedCells: { row: number; col: number }[],
  placedWords: PlacedWord[],
  foundWords: Set<string>
): string | null {
  for (const pw of placedWords) {
    if (foundWords.has(pw.word)) continue;
    if (pw.cells.length !== selectedCells.length) continue;

    // Check forward match
    const forwardMatch = pw.cells.every(
      (c, i) => c.row === selectedCells[i].row && c.col === selectedCells[i].col
    );
    // Check reverse match
    const reverseMatch = pw.cells.every(
      (c, i) =>
        c.row === selectedCells[selectedCells.length - 1 - i].row &&
        c.col === selectedCells[selectedCells.length - 1 - i].col
    );

    if (forwardMatch || reverseMatch) return pw.word;
  }
  return null;
}

export function isLineSelection(cells: { row: number; col: number }[]): boolean {
  if (cells.length <= 1) return true;
  const dr = cells[1].row - cells[0].row;
  const dc = cells[1].col - cells[0].col;
  for (let i = 2; i < cells.length; i++) {
    if (
      cells[i].row - cells[i - 1].row !== dr ||
      cells[i].col - cells[i - 1].col !== dc
    ) {
      return false;
    }
  }
  return true;
}

export function getCellsBetween(
  start: { row: number; col: number },
  end: { row: number; col: number }
): { row: number; col: number }[] {
  const dr = Math.sign(end.row - start.row);
  const dc = Math.sign(end.col - start.col);
  const len = Math.max(Math.abs(end.row - start.row), Math.abs(end.col - start.col));
  
  // Must be a straight line
  const rowDiff = Math.abs(end.row - start.row);
  const colDiff = Math.abs(end.col - start.col);
  if (rowDiff !== 0 && colDiff !== 0 && rowDiff !== colDiff) return [];

  const cells: { row: number; col: number }[] = [];
  for (let i = 0; i <= len; i++) {
    cells.push({ row: start.row + dr * i, col: start.col + dc * i });
  }
  return cells;
}
