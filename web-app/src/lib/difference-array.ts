export function buildDiffFromArray(arr: number[]): number[] {
  if (arr.length === 0) return [];
  const diff = new Array<number>(arr.length);
  diff[0] = arr[0];
  for (let i = 1; i < arr.length; i++) {
    diff[i] = arr[i] - arr[i - 1];
  }
  return diff;
}

export function applyRangeUpdate(
  diff: number[],
  l: number,
  r: number,
  value: number,
): number[] {
  const next = [...diff];
  next[l] += value;
  if (r + 1 < next.length) next[r + 1] -= value;
  return next;
}

export function rebuildFromDiff(diff: number[]): number[] {
  if (diff.length === 0) return [];
  const arr = new Array<number>(diff.length);
  arr[0] = diff[0];
  for (let i = 1; i < diff.length; i++) {
    arr[i] = arr[i - 1] + diff[i];
  }
  return arr;
}

export function bruteRangeUpdate(
  arr: number[],
  l: number,
  r: number,
  value: number,
): number[] {
  const result = [...arr];
  for (let i = l; i <= r; i++) result[i] += value;
  return result;
}

export type RangeUpdateOp = { l: number; r: number; value: number };

export const DEFAULT_ARR = [10, 10, 10, 10, 10];
export const DEFAULT_UPDATE: RangeUpdateOp = { l: 1, r: 3, value: 5 };

export const MULTI_UPDATES: RangeUpdateOp[] = [
  { l: 0, r: 2, value: 3 },
  { l: 1, r: 4, value: 2 },
  { l: 3, r: 4, value: -1 },
];

/** Clamp demo multi-updates to fit array length n. */
export function clampMultiUpdates(n: number): RangeUpdateOp[] {
  return MULTI_UPDATES.filter((op) => op.l < n).map((op) => ({
    l: op.l,
    r: Math.min(op.r, n - 1),
    value: op.value,
  }));
}

export function buildMultiDiffSteps(arr: number[]): number[][] {
  const ops = clampMultiUpdates(arr.length);
  const startDiff = buildDiffFromArray(arr);
  const steps = [startDiff];
  let d = [...startDiff];
  for (const op of ops) {
    d = applyRangeUpdate(d, op.l, op.r, op.value);
    steps.push([...d]);
  }
  return steps;
}

export function applyAllUpdates(baseDiff: number[], ops: RangeUpdateOp[]): number[] {
  let diff = [...baseDiff];
  for (const op of ops) {
    diff = applyRangeUpdate(diff, op.l, op.r, op.value);
  }
  return diff;
}

export function parseArrayInput(input: string): number[] {
  return input
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map(Number)
    .filter((n) => !Number.isNaN(n));
}

export function randomArray(length: number, min = 1, max = 15): number[] {
  return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

export function formatDiffValue(v: number): string {
  if (v > 0) return `+${v}`;
  return String(v);
}
