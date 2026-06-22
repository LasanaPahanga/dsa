import type { LabExplanation } from '@/components/lab/LabVisualizerContext';

type BuildStep = { index: number; arrVal: number; prev: number; result: number };

export function build1DLabExplanation(
  phase: string,
  subStep: number,
  maxSubStep: number,
  arr: number[],
  prefix: number[],
  left: number,
  right: number,
  buildSteps: BuildStep[],
  bruteRunningSum: number,
  bruteCurrentIdx: number,
  queryResult: number,
): LabExplanation | null {
  const total = maxSubStep + 1;
  const stepNum = subStep + 1;

  switch (phase) {
    case 'brute':
      if (subStep === 0)
        return {
          stepNumber: stepNum,
          totalSteps: total,
          title: 'Brute force range sum',
          fields: [
            { label: 'Range', value: `l = ${left}, r = ${right}` },
            { label: 'Method', value: 'Loop and add each element' },
          ],
          meaning: 'We visit every element in the range one by one.',
          formula: 'sum(l, r) = arr[l] + arr[l+1] + … + arr[r]',
        };
      if (subStep <= right - left + 1 && bruteCurrentIdx >= 0)
        return {
          stepNumber: stepNum,
          totalSteps: total,
          title: `Visiting arr[${bruteCurrentIdx}]`,
          fields: [
            { label: 'Current value', value: String(arr[bruteCurrentIdx]), accent: 'primary' },
            { label: 'Running sum', value: String(bruteRunningSum), accent: 'success' },
          ],
          meaning: `Adding arr[${bruteCurrentIdx}] to our running total.`,
        };
      return {
        stepNumber: stepNum,
        totalSteps: total,
        title: 'Brute force complete',
        fields: [
          { label: 'Answer', value: String(bruteRunningSum), accent: 'purple' },
          { label: 'Complexity', value: 'O(n) per query', accent: 'error' },
        ],
        meaning: 'Every query requires looping through the range.',
      };

    case 'why-slow':
      return {
        stepNumber: stepNum,
        totalSteps: total,
        title: subStep === 0 ? 'Many queries hurt' : subStep === 1 ? 'Cost multiplies' : 'Time for prefix sum',
        fields: [
          { label: 'Problem', value: 'q queries × O(n) each' },
          { label: 'Total', value: 'O(n × q)', accent: 'error' },
        ],
        meaning:
          subStep === 2
            ? 'Preprocess once, answer each query in O(1).'
            : 'Repeated brute force does not scale.',
      };

    case 'build': {
      if (subStep === 0)
        return {
          stepNumber: stepNum,
          totalSteps: total,
          title: 'Build prefix array',
          fields: [{ label: 'Goal', value: 'Store running totals' }],
          formula: 'prefix[i] = prefix[i-1] + arr[i]',
          meaning: 'Empty prefix array. Fill left to right.',
        };
      const s = buildSteps[subStep - 1];
      if (!s) return null;
      if (s.index === 0)
        return {
          stepNumber: stepNum,
          totalSteps: total,
          title: 'Computing prefix[0]',
          fields: [
            { label: 'Current value', value: String(s.arrVal), accent: 'primary' },
            { label: 'New prefix sum', value: String(s.result), accent: 'success' },
          ],
          formula: 'prefix[0] = arr[0]',
          meaning: 'Sum of first 1 element.',
        };
      return {
        stepNumber: stepNum,
        totalSteps: total,
        title: `Computing prefix[${s.index}]`,
        fields: [
          { label: 'Previous prefix sum', value: String(s.prev), accent: 'success' },
          { label: 'Current value', value: String(s.arrVal), accent: 'primary' },
          { label: 'New prefix sum', value: String(s.result), accent: 'success' },
        ],
        formula: `prefix[${s.index}] = prefix[${s.index - 1}] + arr[${s.index}]`,
        meaning: `Sum of first ${s.index + 1} elements.`,
      };
    }

    case 'query':
      if (subStep === 0)
        return {
          stepNumber: stepNum,
          totalSteps: total,
          title: 'Select range',
          fields: [
            { label: 'L', value: String(left) },
            { label: 'R', value: String(right) },
            { label: 'Elements', value: arr.slice(left, right + 1).join(' + ') },
          ],
          meaning: 'Highlighted cells are our target range.',
        };
      if (subStep === 1)
        return {
          stepNumber: stepNum,
          totalSteps: total,
          title: `prefix[${right}] covers 0..${right}`,
          fields: [{ label: 'prefix[r]', value: String(prefix[right]), accent: 'success' }],
          formula: `prefix[${right}] = sum of arr[0..${right}]`,
        };
      if (subStep === 2 && left > 0)
        return {
          stepNumber: stepNum,
          totalSteps: total,
          title: 'Remove part before L',
          fields: [
            { label: 'prefix[l-1]', value: String(prefix[left - 1]), accent: 'error' },
          ],
          meaning: `Subtract indices 0..${left - 1}, the unwanted prefix.`,
        };
      return {
        stepNumber: stepNum,
        totalSteps: total,
        title: 'Final answer',
        fields: [{ label: 'Answer', value: String(queryResult), accent: 'purple' }],
        formula:
          left === 0
            ? `sum = prefix[${right}]`
            : `prefix[${right}] - prefix[${left - 1}] = ${queryResult}`,
        meaning: `Remaining: [${arr.slice(left, right + 1).join(', ')}]`,
      };

    case 'compare':
      return {
        stepNumber: 1,
        totalSteps: 1,
        title: 'Before vs After',
        fields: [
          { label: 'Brute force', value: 'O(n × q)', accent: 'error' },
          { label: 'Prefix sum', value: 'O(n + q)', accent: 'success' },
        ],
        meaning: 'Preprocessing pays off when you have many queries.',
      };

    case 'quiz':
      return {
        stepNumber: 1,
        totalSteps: 1,
        title: 'Quiz time',
        fields: [{ label: 'Goal', value: 'Test your understanding' }],
      };

    default:
      return null;
  }
}

export function get1DCodeLine(phase: string, subStep: number, buildSteps: BuildStep[]): number | null {
  if (phase === 'build' && subStep > 0) {
    const s = buildSteps[subStep - 1];
    return s?.index === 0 ? 5 : 7;
  }
  if (phase === 'query') return 13;
  return null;
}
