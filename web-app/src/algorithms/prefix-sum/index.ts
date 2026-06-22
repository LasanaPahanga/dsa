import type { AlgorithmModule } from '../types';
import { PrefixSum1DVisualizer } from './PrefixSum1DVisualizer';
import { PrefixSum2DVisualizer } from './PrefixSum2DVisualizer';
import { prefixSumBruteForce, prefixSumConcept, prefixSumOptimized } from './content';

const PYTHON_1D = `def build_prefix(arr):
    prefix = [0] * len(arr)
    if not arr:
        return prefix
    prefix[0] = arr[0]
    for i in range(1, len(arr)):
        prefix[i] = prefix[i - 1] + arr[i]
    return prefix

def range_sum(prefix, left, right):
    if left == 0:
        return prefix[right]
    return prefix[right] - prefix[left - 1]`;

const CPP_1D = `vector<int> buildPrefix(const vector<int>& arr) {
    vector<int> prefix(arr.size(), 0);
    if (arr.empty()) return prefix;
    prefix[0] = arr[0];
    for (size_t i = 1; i < arr.size(); ++i)
        prefix[i] = prefix[i - 1] + arr[i];
    return prefix;
}

int rangeSum(const vector<int>& prefix, int l, int r) {
    if (l == 0) return prefix[r];
    return prefix[r] - prefix[l - 1];
}`;

const PYTHON_2D = `def build_prefix_2d(matrix):
    rows, cols = len(matrix), len(matrix[0])
    prefix = [[0] * cols for _ in range(rows)]
    for i in range(rows):
        for j in range(cols):
            top = prefix[i-1][j] if i > 0 else 0
            left = prefix[i][j-1] if j > 0 else 0
            overlap = prefix[i-1][j-1] if i > 0 and j > 0 else 0
            prefix[i][j] = matrix[i][j] + top + left - overlap
    return prefix`;

const CPP_2D = `int regionSum(const vector<vector<int>>& p,
              int r1, int c1, int r2, int c2) {
    int total = p[r2][c2];
    if (r1 > 0) total -= p[r1 - 1][c2];
    if (c1 > 0) total -= p[r2][c1 - 1];
    if (r1 > 0 && c1 > 0) total += p[r1 - 1][c1 - 1];
    return total;
}`;

const JAVA_1D = `int[] buildPrefix(int[] arr) {
    int[] prefix = new int[arr.length];
    if (arr.length == 0) return prefix;
    prefix[0] = arr[0];
    for (int i = 1; i < arr.length; i++)
        prefix[i] = prefix[i - 1] + arr[i];
    return prefix;
}

int rangeSum(int[] prefix, int l, int r) {
    if (l == 0) return prefix[r];
    return prefix[r] - prefix[l - 1];
}`;

const JS_1D = `function buildPrefix(arr) {
  const prefix = new Array(arr.length);
  if (!arr.length) return prefix;
  prefix[0] = arr[0];
  for (let i = 1; i < arr.length; i++)
    prefix[i] = prefix[i - 1] + arr[i];
  return prefix;
}

function rangeSum(prefix, l, r) {
  return l === 0 ? prefix[r] : prefix[r] - prefix[l - 1];
}`;

export const prefixSumModule: AlgorithmModule = {
  id: 'prefix-sum',
  slug: 'prefix-sum',
  title: 'Prefix Sum',
  shortDescription:
    'Precompute cumulative sums to answer range queries in O(1) for 1D arrays and 2D matrices.',
  tags: ['array', 'matrix', 'preprocessing', 'range-query'],
  difficulty: 'beginner',
  complexity: {
    build: 'O(n) for 1D · O(n·m) for 2D',
    query: 'O(1)',
    space: 'O(n) for 1D · O(n·m) for 2D',
  },
  sections: [
    { id: '1d', title: '1D Prefix Sum', component: PrefixSum1DVisualizer },
    { id: '2d', title: '2D Prefix Sum', component: PrefixSum2DVisualizer },
  ],
  concept: prefixSumConcept,
  bruteForce: prefixSumBruteForce,
  optimized: prefixSumOptimized,
  codeSnippets: [
    { language: 'python', label: 'Python', code: PYTHON_1D },
    { language: 'cpp', label: 'C++', code: CPP_1D },
    { language: 'java', label: 'Java', code: JAVA_1D },
    { language: 'javascript', label: 'JavaScript', code: JS_1D },
    { language: 'python', label: '2D Python', code: PYTHON_2D },
    { language: 'cpp', label: '2D C++', code: CPP_2D },
  ],
  practiceProblems: [
    {
      title: 'Range Sum Query',
      description: 'Given an array, answer multiple sum(l, r) queries efficiently.',
      difficulty: 'beginner',
      link: 'https://leetcode.com/problems/range-sum-query-immutable/',
    },
    {
      title: 'Max Subarray Sum of Size K',
      description: 'Find the maximum sum among all contiguous subarrays of length k.',
      difficulty: 'beginner',
      link: 'https://leetcode.com/problems/maximum-sum-of-distinct-subarrays-with-length-k/description/',
    },
    {
      title: 'Subarray Sum Equals K',
      description: 'Count subarrays whose sum equals k (prefix sum + hash map).',
      difficulty: 'intermediate',
      link: 'https://leetcode.com/problems/subarray-sum-equals-k/',
    },
    {
      title: 'Range Sum Query 2D',
      description: 'Answer rectangular region sum queries on a matrix.',
      difficulty: 'intermediate',
      link: 'https://leetcode.com/problems/range-sum-query-2d-immutable/',
    },
  ],
};
