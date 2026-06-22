import type { LabExplanation } from '@/components/lab/LabVisualizerContext';

type BuildStep = {
  row: number;
  col: number;
  value: number;
  top: number;
  left: number;
  overlap: number;
  result: number;
};

export function build2DLabExplanation(
  phase: string,
  subStep: number,
  maxSubStep: number,
  r1: number,
  c1: number,
  r2: number,
  c2: number,
  currentBuild: BuildStep | null,
  queryResult: number,
  prefix: number[][],
): LabExplanation | null {
  const total = maxSubStep + 1;
  const stepNum = subStep + 1;

  switch (phase) {
    case 'brute':
      return {
        stepNumber: stepNum,
        totalSteps: total,
        title: subStep === 0 ? 'Brute force region sum' : 'Looping cells',
        fields: [
          { label: 'Region', value: `(${r1},${c1}) → (${r2},${c2})` },
          { label: 'Complexity', value: 'O(area) per query', accent: 'error' },
        ],
        meaning: 'Visit every cell in the rectangle and add values.',
      };

    case 'why-slow':
      return {
        stepNumber: stepNum,
        totalSteps: total,
        title: 'Many region queries',
        fields: [{ label: 'Cost', value: 'O(n·m × q)', accent: 'error' }],
        meaning: '2D prefix sum preprocesses once for O(1) queries.',
      };

    case 'build':
      if (subStep === 0)
        return {
          stepNumber: stepNum,
          totalSteps: total,
          title: 'Build prefix matrix',
          fields: [{ label: 'Strategy', value: 'val + top + left − overlap' }],
          formula: 'prefix[i][j] = val + top + left − overlap',
          meaning: 'Each cell stores sum of rectangle from (0,0).',
        };
      if (!currentBuild) return null;
      return {
        stepNumber: stepNum,
        totalSteps: total,
        title: `Cell (${currentBuild.row}, ${currentBuild.col})`,
        fields: [
          { label: 'Value', value: String(currentBuild.value), accent: 'primary' },
          { label: 'Top area', value: String(currentBuild.top), accent: 'success' },
          { label: 'Left area', value: String(currentBuild.left), accent: 'success' },
          { label: 'Overlap', value: String(currentBuild.overlap), accent: 'warning' },
          { label: 'Result', value: String(currentBuild.result), accent: 'success' },
        ],
        formula: `${currentBuild.value} + ${currentBuild.top} + ${currentBuild.left} − ${currentBuild.overlap} = ${currentBuild.result}`,
        meaning: 'Top + left double-count overlap. Subtract once.',
      };

    case 'query':
      if (subStep === 0)
        return {
          stepNumber: stepNum,
          totalSteps: total,
          title: 'Select rectangle',
          fields: [
            { label: 'Top-left', value: `(${r1}, ${c1})` },
            { label: 'Bottom-right', value: `(${r2}, ${c2})` },
          ],
          meaning: 'Drag on the matrix or use sliders to select a region.',
        };
      if (subStep === 1)
        return {
          stepNumber: stepNum,
          totalSteps: total,
          title: 'Whole area',
          fields: [
            { label: 'prefix[r2][c2]', value: String(prefix[r2][c2]), accent: 'success' },
          ],
          formula: `Sum from (0,0) to (${r2},${c2})`,
        };
      if (subStep === 2 && r1 > 0)
        return {
          stepNumber: stepNum,
          totalSteps: total,
          title: 'Remove top strip',
          fields: [
            { label: 'Subtract', value: `prefix[${r1 - 1}][${c2}] = ${prefix[r1 - 1][c2]}`, accent: 'error' },
          ],
        };
      if (subStep === 3 && c1 > 0)
        return {
          stepNumber: stepNum,
          totalSteps: total,
          title: 'Remove left strip',
          fields: [
            { label: 'Subtract', value: `prefix[${r2}][${c1 - 1}] = ${prefix[r2][c1 - 1]}`, accent: 'error' },
          ],
        };
      if (subStep === 4 && r1 > 0 && c1 > 0)
        return {
          stepNumber: stepNum,
          totalSteps: total,
          title: 'Add overlap back',
          fields: [
            {
              label: 'Add once',
              value: `prefix[${r1 - 1}][${c1 - 1}] = ${prefix[r1 - 1][c1 - 1]}`,
              accent: 'warning',
            },
          ],
          meaning: 'Corner was subtracted twice. Add back once.',
        };
      return {
        stepNumber: stepNum,
        totalSteps: total,
        title: 'Region sum',
        fields: [{ label: 'Answer', value: String(queryResult), accent: 'purple' }],
        formula: `= ${queryResult}`,
      };

    case 'compare':
      return {
        stepNumber: 1,
        totalSteps: 1,
        title: '2D complexity',
        fields: [
          { label: 'Brute', value: 'O(n·m × q)', accent: 'error' },
          { label: 'Prefix', value: 'O(n·m + q)', accent: 'success' },
        ],
      };

    case 'quiz':
      return {
        stepNumber: 1,
        totalSteps: 1,
        title: 'Quiz',
        fields: [{ label: 'Topic', value: '2D prefix sum' }],
      };

    default:
      return null;
  }
}

export function get2DCodeLine(phase: string, subStep: number): number | null {
  if (phase === 'build' && subStep > 0) return 8;
  if (phase === 'query') return 3;
  return null;
}
