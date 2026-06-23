import type { LabExplanation } from '@/components/lab/LabVisualizerContext';
import type { RangeUpdateOp } from '@/lib/difference-array';

export function buildDiffLabExplanation(
  phase: string,
  subStep: number,
  maxSubStep: number,
  arr: number[],
  diff: number[],
  final: number[],
  l: number,
  r: number,
  value: number,
  bruteIdx: number,
  rebuildIdx: number,
  multiUpdates: RangeUpdateOp[],
): LabExplanation | null {
  const total = maxSubStep + 1;
  const stepNum = subStep + 1;

  switch (phase) {
    case 'brute':
      if (subStep === 0)
        return {
          stepNumber: stepNum,
          totalSteps: total,
          title: 'Normal range update',
          fields: [
            { label: 'Range', value: `[${l}, ${r}]` },
            { label: 'Add', value: String(value), accent: 'primary' },
          ],
          meaning: 'Loop through each index and add the value. O(n) per update.',
        };
      if (bruteIdx >= l && bruteIdx <= r)
        return {
          stepNumber: stepNum,
          totalSteps: total,
          title: `Updating arr[${bruteIdx}]`,
          fields: [
            { label: 'Index', value: String(bruteIdx), accent: 'primary' },
            { label: 'New value', value: String(arr[bruteIdx] + value), accent: 'success' },
          ],
        };
      return {
        stepNumber: stepNum,
        totalSteps: total,
        title: 'Brute force done',
        fields: [{ label: 'Result', value: arr.slice(l, r + 1).map((v) => v + value).join(', ') }],
        meaning: 'Visited every index in the range.',
      };

    case 'why-slow':
      return {
        stepNumber: stepNum,
        totalSteps: total,
        title: subStep === 0 ? 'Many updates?' : 'Cost adds up',
        fields: [{ label: 'Cost', value: 'O(n) per update', accent: 'error' }],
        meaning:
          subStep >= 1
            ? 'Q updates × O(n) = O(Q × n). Difference array marks only 2 spots per update.'
            : 'Each range update touches every cell in the range.',
      };

    case 'build-diff':
      if (subStep === 0)
        return {
          stepNumber: stepNum,
          totalSteps: total,
          title: 'Build difference array',
          fields: [{ label: 'Formula', value: 'diff[i] = arr[i] - arr[i-1]' }],
          meaning: 'diff[i] = how much the value changes at index i.',
          formula: 'diff[0] = arr[0]',
        };
      if (subStep <= arr.length) {
        const i = subStep - 1;
        return {
          stepNumber: stepNum,
          totalSteps: total,
          title: i === 0 ? 'diff[0]' : `diff[${i}]`,
          fields: [
            { label: 'arr[i]', value: String(arr[i]), accent: 'primary' },
            ...(i > 0
              ? [{ label: 'arr[i-1]', value: String(arr[i - 1]), accent: 'success' as const }]
              : []),
            { label: 'diff[i]', value: String(diff[i]), accent: 'success' },
          ],
          formula: i === 0 ? 'diff[0] = arr[0]' : `diff[${i}] = arr[${i}] - arr[${i - 1}]`,
        };
      }
      return null;

    case 'update':
      if (subStep === 0)
        return {
          stepNumber: stepNum,
          totalSteps: total,
          title: 'Range update on diff',
          fields: [
            { label: 'Add', value: `+${value} at [${l}, ${r}]`, accent: 'purple' },
          ],
          meaning: 'Mark where the effect starts and stops. Do not touch every cell.',
        };
      if (subStep === 1)
        return {
          stepNumber: stepNum,
          totalSteps: total,
          title: `diff[${l}] += ${value}`,
          fields: [{ label: 'Start here', value: `+${value} begins at index ${l}`, accent: 'success' }],
          formula: `diff[${l}] += ${value}`,
          meaning: '+5 starts at index l.',
        };
      if (subStep === 2 && r + 1 < arr.length)
        return {
          stepNumber: stepNum,
          totalSteps: total,
          title: `diff[${r + 1}] -= ${value}`,
          fields: [
            { label: 'Stop here', value: `-${value} at index ${r + 1}`, accent: 'error' },
          ],
          formula: `diff[${r + 1}] -= ${value}`,
          meaning: '-5 cancels the effect after index r.',
        };
      return {
        stepNumber: stepNum,
        totalSteps: total,
        title: 'Diff ready to rebuild',
        fields: [{ label: 'diff', value: diff.map((d) => (d >= 0 ? `+${d}` : String(d))).join(', ') }],
      };

    case 'multi': {
      const titles = [
        'Base diff from your array',
        ...multiUpdates.map(
          (op, i) =>
            `Update ${i + 1}: ${op.value > 0 ? '+' : ''}${op.value} on [${op.l}, ${op.r}]`,
        ),
      ];
      return {
        stepNumber: stepNum,
        totalSteps: total,
        title: titles[subStep] ?? 'Multiple updates',
        fields: [{ label: 'Power', value: 'Each update is O(1) on diff', accent: 'success' }],
        meaning:
          subStep === 0
            ? 'Start from the difference array of your current array, then stack range updates.'
            : 'Many range updates, only touching diff[l] and diff[r+1] each time.',
      };
    }

    case 'rebuild':
      if (subStep === 0)
        return {
          stepNumber: stepNum,
          totalSteps: total,
          title: 'Rebuild with prefix sum',
          fields: [{ label: 'Idea', value: 'Prefix sum on diff' }],
          meaning: 'Same as prefix sum: arr[i] = arr[i-1] + diff[i]',
          formula: 'arr[0] = diff[0]',
        };
      if (rebuildIdx >= 0 && rebuildIdx < final.length)
        return {
          stepNumber: stepNum,
          totalSteps: total,
          title: rebuildIdx === 0 ? 'arr[0]' : `arr[${rebuildIdx}]`,
          fields: [
            ...(rebuildIdx > 0
              ? [{ label: 'Previous', value: String(final[rebuildIdx - 1]), accent: 'warning' as const }]
              : []),
            { label: 'diff[i]', value: String(diff[rebuildIdx]), accent: 'primary' },
            { label: 'arr[i]', value: String(final[rebuildIdx]), accent: 'success' },
          ],
          formula:
            rebuildIdx === 0
              ? `arr[0] = diff[0] = ${final[0]}`
              : `arr[${rebuildIdx}] = ${final[rebuildIdx - 1]} + ${diff[rebuildIdx]} = ${final[rebuildIdx]}`,
        };
      return null;

    case 'compare':
      return {
        stepNumber: 1,
        totalSteps: 1,
        title: 'Complexity comparison',
        fields: [
          { label: 'Brute force', value: 'O(Q × n)', accent: 'error' },
          { label: 'Difference array', value: 'O(Q + n)', accent: 'success' },
        ],
        meaning: 'Prefix sum reads ranges fast. Difference array writes ranges fast.',
      };

    case 'quiz':
      return {
        stepNumber: 1,
        totalSteps: 1,
        title: 'Quiz',
        fields: [{ label: 'Topic', value: 'Difference array' }],
      };

    default:
      return null;
  }
}

export function getDiffCodeLine(phase: string, subStep: number): number | null {
  if (phase === 'build-diff' && subStep > 0) return subStep === 1 ? 5 : 7;
  if (phase === 'update') {
    if (subStep === 1) return 11;
    if (subStep === 2) return 12;
  }
  if (phase === 'rebuild' && subStep > 0) return 17;
  return null;
}
