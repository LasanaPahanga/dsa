export type KadaneStep = {
  index: number;
  arrVal: number;
  prevCurrentSum: number;
  continueVal: number;
  startNewVal: number;
  currentSum: number;
  bestSum: number;
  choseRestart: boolean;
  currentStart: number;
  bestStart: number;
  bestEnd: number;
};

export const DEFAULT_ARR = [-2, 1, -3, 4, -1, 2, 1, -5, 4];

export function computeKadaneSteps(arr: number[]): KadaneStep[] {
  if (arr.length === 0) return [];

  const steps: KadaneStep[] = [];
  let currentSum = arr[0];
  let bestSum = arr[0];
  let currentStart = 0;
  let bestStart = 0;
  let bestEnd = 0;

  steps.push({
    index: 0,
    arrVal: arr[0],
    prevCurrentSum: arr[0],
    continueVal: arr[0],
    startNewVal: arr[0],
    currentSum: arr[0],
    bestSum: arr[0],
    choseRestart: true,
    currentStart: 0,
    bestStart: 0,
    bestEnd: 0,
  });

  for (let i = 1; i < arr.length; i++) {
    const prevCurrentSum = currentSum;
    const continueVal = prevCurrentSum + arr[i];
    const startNewVal = arr[i];
    const choseRestart = startNewVal > continueVal;
    currentSum = Math.max(startNewVal, continueVal);

    if (choseRestart) currentStart = i;

    if (currentSum > bestSum) {
      bestSum = currentSum;
      bestStart = currentStart;
      bestEnd = i;
    }

    steps.push({
      index: i,
      arrVal: arr[i],
      prevCurrentSum,
      continueVal,
      startNewVal,
      currentSum,
      bestSum,
      choseRestart,
      currentStart,
      bestStart,
      bestEnd,
    });
  }

  return steps;
}

export function buildCurrentRow(steps: KadaneStep[], upTo: number): (number | null)[] {
  if (steps.length === 0) return [];
  return steps.map((s, i) => (i <= upTo ? s.currentSum : null));
}

export function buildBestRow(steps: KadaneStep[], upTo: number): (number | null)[] {
  if (steps.length === 0) return [];
  return steps.map((s, i) => (i <= upTo ? s.bestSum : null));
}

export function bruteMaxSum(arr: number[]): number {
  if (arr.length === 0) return 0;
  let best = arr[0];
  for (let i = 0; i < arr.length; i++) {
    let total = 0;
    for (let j = i; j < arr.length; j++) {
      total += arr[j];
      best = Math.max(best, total);
    }
  }
  return best;
}

export function parseArrayInput(input: string): number[] {
  return input
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map(Number)
    .filter((n) => !Number.isNaN(n));
}

export function randomArray(length: number, min = -9, max = 9): number[] {
  return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}
