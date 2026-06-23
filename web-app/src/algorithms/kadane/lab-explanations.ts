import type { LabExplanation } from '@/components/lab/LabVisualizerContext';
import type { KadaneStep } from '@/lib/kadane';

export function buildKadaneLabExplanation(
  phase: string,
  subStep: number,
  maxSubStep: number,
  step: KadaneStep | null,
  bestSum: number,
  bestStart: number,
  bestEnd: number,
  arr: number[],
): LabExplanation | null {
  const total = maxSubStep + 1;
  const stepNum = subStep + 1;

  switch (phase) {
    case 'brute':
      if (subStep === 0)
        return {
          stepNumber: stepNum,
          totalSteps: total,
          title: 'Check every subarray',
          fields: [{ label: 'Approach', value: 'Nested loops i → j', accent: 'primary' }],
          meaning: 'Try every start and end index. Correct, but visits O(n²) subarrays.',
        };
      return {
        stepNumber: stepNum,
        totalSteps: total,
        title: 'Brute force cost',
        fields: [{ label: 'Time', value: 'O(n²)', accent: 'error' }],
        meaning: 'For n = 10⁵, that is billions of operations.',
      };

    case 'why-slow':
      return {
        stepNumber: stepNum,
        totalSteps: total,
        title: subStep === 0 ? 'We need a smarter scan' : 'One pass is enough',
        fields: [{ label: 'Goal', value: 'Max subarray sum', accent: 'primary' }],
        meaning:
          subStep >= 1
            ? 'Kadane keeps running totals and drops bad prefixes instantly.'
            : 'Repeating work on overlapping subarrays wastes time.',
      };

    case 'idea':
      if (subStep === 0)
        return {
          stepNumber: stepNum,
          totalSteps: total,
          title: 'The key question',
          fields: [{ label: 'At each i', value: 'Continue or restart?', accent: 'purple' }],
          meaning:
            'Is it better to continue the old subarray, or start fresh from arr[i]?',
          formula: 'current_sum = max(arr[i], current_sum + arr[i])',
        };
      return {
        stepNumber: stepNum,
        totalSteps: total,
        title: 'Track the best',
        fields: [{ label: 'Update', value: 'best_sum = max(best_sum, current_sum)', accent: 'success' }],
        meaning: 'current_sum is the best ending at i. best_sum is the global champion.',
      };

    case 'scan':
      if (!step) return null;
      if (step.index === 0)
        return {
          stepNumber: stepNum,
          totalSteps: total,
          title: 'Start at index 0',
          fields: [
            { label: 'arr[0]', value: String(step.arrVal), accent: 'primary' },
            { label: 'current_sum', value: String(step.currentSum), accent: 'warning' },
            { label: 'best_sum', value: String(step.bestSum), accent: 'success' },
          ],
          meaning: 'Initialize both current_sum and best_sum to arr[0].',
        };
      return {
        stepNumber: stepNum,
        totalSteps: total,
        title: `Step at index ${step.index}`,
        fields: [
          { label: 'arr[i]', value: String(step.arrVal), accent: 'primary' },
          { label: 'Continue', value: String(step.continueVal), accent: 'warning' },
          { label: 'Start new', value: String(step.startNewVal), accent: step.choseRestart ? 'success' : 'warning' },
          { label: 'Choose', value: String(step.currentSum), accent: 'purple' },
        ],
        meaning: step.choseRestart
          ? 'Previous sum hurts us, so we restart from arr[i].'
          : 'Continuing the previous subarray is still better.',
        formula: `max(${step.continueVal}, ${step.startNewVal}) = ${step.currentSum}`,
      };

    case 'result':
      return {
        stepNumber: 1,
        totalSteps: 1,
        title: 'Maximum subarray found',
        fields: [
          { label: 'Best sum', value: String(bestSum), accent: 'purple' },
          { label: 'Range', value: `[${bestStart}, ${bestEnd}]`, accent: 'success' },
          { label: 'Subarray', value: arr.slice(bestStart, bestEnd + 1).join(', '), accent: 'primary' },
        ],
        meaning: 'Scan complete. The best continuous subarray is highlighted in green.',
      };

    case 'compare':
      return {
        stepNumber: 1,
        totalSteps: 1,
        title: 'Complexity comparison',
        fields: [
          { label: 'Brute force', value: 'O(n²)', accent: 'error' },
          { label: 'Kadane', value: 'O(n)', accent: 'success' },
        ],
        meaning: 'Prefix sum optimizes range reads. Kadane optimizes finding the best subarray sum.',
      };

    case 'quiz':
      return {
        stepNumber: 1,
        totalSteps: 1,
        title: 'Quiz',
        fields: [{ label: 'Topic', value: "Kadane's algorithm" }],
      };

    default:
      return null;
  }
}

export function getKadaneCodeLine(phase: string, subStep: number): number | null {
  if (phase === 'scan' && subStep > 0) return 6;
  if (phase === 'scan' && subStep === 0) return 4;
  if (phase === 'idea' && subStep === 1) return 7;
  return null;
}
