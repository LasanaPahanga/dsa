export function buildPrefix1D(arr: number[]): number[] {
  if (arr.length === 0) return [];
  const prefix = new Array<number>(arr.length);
  prefix[0] = arr[0];
  for (let i = 1; i < arr.length; i++) {
    prefix[i] = prefix[i - 1] + arr[i];
  }
  return prefix;
}

export function rangeSum1D(prefix: number[], left: number, right: number): number {
  if (left === 0) return prefix[right];
  return prefix[right] - prefix[left - 1];
}

export function buildPrefix2D(matrix: number[][]): number[][] {
  if (matrix.length === 0 || matrix[0].length === 0) return [];
  const rows = matrix.length;
  const cols = matrix[0].length;
  const prefix = Array.from({ length: rows }, () => new Array<number>(cols).fill(0));

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const top = i > 0 ? prefix[i - 1][j] : 0;
      const left = j > 0 ? prefix[i][j - 1] : 0;
      const overlap = i > 0 && j > 0 ? prefix[i - 1][j - 1] : 0;
      prefix[i][j] = matrix[i][j] + top + left - overlap;
    }
  }
  return prefix;
}

export function regionSum2D(
  prefix: number[][],
  r1: number,
  c1: number,
  r2: number,
  c2: number,
): number {
  let total = prefix[r2][c2];
  if (r1 > 0) total -= prefix[r1 - 1][c2];
  if (c1 > 0) total -= prefix[r2][c1 - 1];
  if (r1 > 0 && c1 > 0) total += prefix[r1 - 1][c1 - 1];
  return total;
}

export function parseArrayInput(input: string): number[] {
  return input
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map(Number)
    .filter((n) => !Number.isNaN(n));
}

export function randomArray(length: number, min = 1, max = 9): number[] {
  return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

export function randomMatrix(rows: number, cols: number, min = 1, max = 9): number[][] {
  return Array.from({ length: rows }, () => randomArray(cols, min, max));
}

/** Serialize matrix for the custom input field (one row per line). */
export function matrixToInputString(matrix: number[][]): string {
  return matrix.map((row) => row.join(', ')).join('\n');
}

/**
 * Parse user matrix input. Rows separated by newlines or semicolons;
 * values in each row separated by commas or spaces. All rows must have equal length.
 */
export function parseMatrixInput(input: string): number[][] | null {
  const lines = input
    .split(/\n|;/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return null;

  const matrix = lines.map((line) => parseArrayInput(line));
  if (matrix.some((row) => row.length === 0)) return null;

  const cols = matrix[0].length;
  if (!matrix.every((row) => row.length === cols)) return null;

  return matrix;
}

export function defaultRegionForMatrix(matrix: number[][]): {
  r1: number;
  c1: number;
  r2: number;
  c2: number;
} {
  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 0;
  if (rows === 0 || cols === 0) return { r1: 0, c1: 0, r2: 0, c2: 0 };

  return {
    r1: rows > 1 ? 1 : 0,
    c1: cols > 1 ? 1 : 0,
    r2: Math.min(rows > 1 ? 2 : 0, rows - 1),
    c2: Math.min(cols > 1 ? 2 : 0, cols - 1),
  };
}
