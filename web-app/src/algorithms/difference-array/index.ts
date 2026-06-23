import type { AlgorithmModule } from '../types';
import { DifferenceArrayVisualizer } from './DifferenceArrayVisualizer';
import { diffArrayBruteForce, diffArrayConcept, diffArrayOptimized } from './content';

const PYTHON = `def build_diff(arr):
    diff = [0] * len(arr)
    if not arr:
        return diff
    diff[0] = arr[0]
    for i in range(1, len(arr)):
        diff[i] = arr[i] - arr[i - 1]
    return diff

def range_update(diff, l, r, value):
    diff[l] += value
    if r + 1 < len(diff):
        diff[r + 1] -= value

def rebuild_from_diff(diff):
    arr = [0] * len(diff)
    if not diff:
        return arr
    arr[0] = diff[0]
    for i in range(1, len(diff)):
        arr[i] = arr[i - 1] + diff[i]
    return arr`;

const CPP = `void rangeUpdate(vector<int>& diff, int l, int r, int val) {
    diff[l] += val;
    if (r + 1 < (int)diff.size())
        diff[r + 1] -= val;
}

vector<int> rebuildFromDiff(const vector<int>& diff) {
    vector<int> arr(diff.size(), 0);
    if (diff.empty()) return arr;
    arr[0] = diff[0];
    for (size_t i = 1; i < diff.size(); ++i)
        arr[i] = arr[i - 1] + diff[i];
    return arr;
}`;

const JAVA = `void rangeUpdate(int[] diff, int l, int r, int val) {
    diff[l] += val;
    if (r + 1 < diff.length)
        diff[r + 1] -= val;
}

int[] rebuildFromDiff(int[] diff) {
    int[] arr = new int[diff.length];
    arr[0] = diff[0];
    for (int i = 1; i < diff.length; i++)
        arr[i] = arr[i - 1] + diff[i];
    return arr;
}`;

const JS = `function rangeUpdate(diff, l, r, val) {
  diff[l] += val;
  if (r + 1 < diff.length) diff[r + 1] -= val;
}

function rebuildFromDiff(diff) {
  const arr = new Array(diff.length);
  arr[0] = diff[0];
  for (let i = 1; i < diff.length; i++)
    arr[i] = arr[i - 1] + diff[i];
  return arr;
}`;

export const differenceArrayModule: AlgorithmModule = {
  id: 'difference-array',
  slug: 'difference-array',
  title: 'Difference Array',
  shortDescription:
    'Mark range updates in O(1) on a diff array, then rebuild the final array with prefix sum.',
  tags: ['array', 'range-update', 'prefix-sum'],
  difficulty: 'beginner',
  complexity: {
    build: 'O(n) to build diff',
    query: 'O(1) per range update',
    space: 'O(n)',
  },
  sections: [{ id: '1d', title: 'Difference Array', component: DifferenceArrayVisualizer }],
  concept: diffArrayConcept,
  bruteForce: diffArrayBruteForce,
  optimized: diffArrayOptimized,
  codeSnippets: [
    { language: 'python', label: 'Python', code: PYTHON },
    { language: 'cpp', label: 'C++', code: CPP },
    { language: 'java', label: 'Java', code: JAVA },
    { language: 'javascript', label: 'JavaScript', code: JS },
  ],
  practiceProblems: [
    {
      title: 'Corporate Flight Bookings',
      description: 'Apply many range updates on an array using difference array.',
      difficulty: 'intermediate',
      link: 'https://leetcode.com/problems/corporate-flight-bookings/',
    },
    {
      title: 'Maximum Population Year',
      description: 'Range updates on a timeline, then find the peak.',
      difficulty: 'intermediate',
      link: 'https://leetcode.com/problems/maximum-population-year/',
    },
    {
      title: 'Range Addition',
      description: 'Classic: add value to every index in [l, r] many times.',
      difficulty: 'beginner',
    },
  ],
};
