import type { AlgorithmModule } from '../types';
import { KadaneVisualizer } from './KadaneVisualizer';
import { kadaneBruteForce, kadaneConcept, kadaneOptimized } from './content';

const PYTHON = `arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4]

current_sum = arr[0]
best_sum = arr[0]

for i in range(1, len(arr)):
    current_sum = max(arr[i], current_sum + arr[i])
    best_sum = max(best_sum, current_sum)

print(best_sum)  # 6`;

const CPP = `int kadane(const vector<int>& arr) {
    int current = arr[0], best = arr[0];
    for (size_t i = 1; i < arr.size(); ++i) {
        current = max(arr[i], current + arr[i]);
        best = max(best, current);
    }
    return best;
}`;

const JAVA = `int kadane(int[] arr) {
    int current = arr[0], best = arr[0];
    for (int i = 1; i < arr.length; i++) {
        current = Math.max(arr[i], current + arr[i]);
        best = Math.max(best, current);
    }
    return best;
}`;

const JS = `function kadane(arr) {
  let current = arr[0], best = arr[0];
  for (let i = 1; i < arr.length; i++) {
    current = Math.max(arr[i], current + arr[i]);
    best = Math.max(best, current);
  }
  return best;
}`;

export const kadaneModule: AlgorithmModule = {
  id: 'kadane',
  slug: 'kadane',
  title: "Kadane's Algorithm",
  shortDescription:
    'Find the maximum subarray sum in O(n) by choosing at each index: continue or start fresh.',
  tags: ['array', 'dynamic-programming', 'prefix-sum'],
  difficulty: 'beginner',
  complexity: {
    build: 'O(n) single pass',
    query: 'O(1) after scan',
    space: 'O(1)',
  },
  sections: [{ id: '1d', title: 'Maximum Subarray', component: KadaneVisualizer }],
  concept: kadaneConcept,
  bruteForce: kadaneBruteForce,
  optimized: kadaneOptimized,
  codeSnippets: [
    { language: 'python', label: 'Python', code: PYTHON },
    { language: 'cpp', label: 'C++', code: CPP },
    { language: 'java', label: 'Java', code: JAVA },
    { language: 'javascript', label: 'JavaScript', code: JS },
  ],
  practiceProblems: [
    {
      title: 'Maximum Subarray',
      description: 'Classic Kadane problem: return the maximum subarray sum.',
      difficulty: 'beginner',
      link: 'https://leetcode.com/problems/maximum-subarray/',
    },
    {
      title: 'Maximum Subarray with Indices',
      description: 'Track start and end indices while scanning to report the actual subarray.',
      difficulty: 'beginner',
    },
    {
      title: 'Maximum Sum Circular Subarray',
      description: 'Wrap-around array: combine Kadane with total sum trick.',
      difficulty: 'intermediate',
      link: 'https://leetcode.com/problems/maximum-sum-circular-subarray/',
    },
    {
      title: 'Maximum Product Subarray',
      description: 'Track both max and min products because negatives flip signs.',
      difficulty: 'intermediate',
      link: 'https://leetcode.com/problems/maximum-product-subarray/',
    },
    {
      title: 'Maximum Subarray Sum with One Deletion',
      description: 'Allow removing at most one element from the subarray.',
      difficulty: 'intermediate',
      link: 'https://leetcode.com/problems/maximum-subarray-sum-with-one-deletion/',
    },
  ],
};
