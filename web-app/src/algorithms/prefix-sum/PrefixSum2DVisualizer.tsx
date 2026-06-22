import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  buildPrefix2D,
  defaultRegionForMatrix,
  matrixToInputString,
  parseMatrixInput,
  randomMatrix,
  regionSum2D,
} from '@/lib/prefix-sum';
import {
  ColorLegend,
  FormulaBox,
  MatrixInputBar,
  MiniQuiz,
  StepControls,
  StepExplanation,
  StoryPhaseNav,
  VIZ,
} from '@/components/visualizer/shared';
import { useLabSyncEffect } from '@/components/lab/LabVisualizerContext';
import { build2DLabExplanation, get2DCodeLine } from './lab-explanations-2d';

const DEFAULT_MATRIX = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

const PHASES = [
  { id: 'brute', label: 'Brute force' },
  { id: 'why-slow', label: 'Why slow?' },
  { id: 'build', label: 'Build prefix' },
  { id: 'query', label: 'Region query' },
  { id: 'compare', label: 'Compare' },
  { id: 'quiz', label: 'Quiz' },
] as const;

type PhaseId = (typeof PHASES)[number]['id'];

const QUIZ = [
  {
    question: 'Why subtract prefix[i−1][j−1] when building prefix[i][j]?',
    options: [
      'To sort the matrix',
      'Top + left double-count the overlap',
      'It is always zero',
      'To find the maximum',
    ],
    correct: 1,
    explanation: 'The top rectangle and left rectangle share a corner. We subtract the overlap once.',
  },
  {
    question: 'A 2D prefix sum query on an n×m matrix after preprocessing takes…',
    options: ['O(n×m)', 'O(1)', 'O(n+m)', 'O(log n)'],
    correct: 1,
    explanation: 'After O(n·m) preprocessing, each rectangular region sum is O(1).',
  },
  {
    question: 'In the 2D query formula, why do we ADD prefix[r1−1][c1−1] back?',
    options: [
      'It was never removed',
      'Top and left strips both removed it. Add back once',
      'To double the answer',
      'It is the final answer',
    ],
    correct: 1,
    explanation: 'The top-left corner cell is subtracted twice (once with top strip, once with left). We add it back once.',
  },
];

type BuildStep = {
  row: number;
  col: number;
  value: number;
  top: number;
  left: number;
  overlap: number;
  result: number;
};

function GridCell({
  value,
  highlight,
  empty,
  title,
  size = 'w-12 h-12',
  onMouseDown,
  onMouseEnter,
  selectable = false,
}: {
  value: number | string;
  highlight?: keyof typeof VIZ;
  empty?: boolean;
  title?: string;
  size?: string;
  onMouseDown?: () => void;
  onMouseEnter?: () => void;
  selectable?: boolean;
}) {
  const base = `flex items-center justify-center rounded-md border font-mono text-sm transition-all duration-200 ${size} ${
    selectable ? 'cursor-crosshair select-none' : ''
  }`;
  const cls = highlight ? VIZ[highlight] : empty ? VIZ.empty : VIZ.base;
  return (
    <div
      className={`${base} ${cls}`}
      title={title}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
    >
      {empty ? ' ' : value}
    </div>
  );
}

export function PrefixSum2DVisualizer() {
  const [matrix, setMatrix] = useState(DEFAULT_MATRIX);
  const [input, setInput] = useState(() => matrixToInputString(DEFAULT_MATRIX));
  const [inputError, setInputError] = useState('');
  const [phase, setPhase] = useState<PhaseId>('brute');
  const [subStep, setSubStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [r1, setR1] = useState(1);
  const [c1, setC1] = useState(1);
  const [r2, setR2] = useState(2);
  const [c2, setC2] = useState(2);
  const [dragging, setDragging] = useState(false);
  const [dragAnchor, setDragAnchor] = useState<[number, number] | null>(null);

  const applyRegion = (r1n: number, c1n: number, r2n: number, c2n: number) => {
    setR1(Math.min(r1n, r2n));
    setR2(Math.max(r1n, r2n));
    setC1(Math.min(c1n, c2n));
    setC2(Math.max(c1n, c2n));
  };

  const handleCellMouseDown = (i: number, j: number) => {
    if (phase !== 'query') return;
    setDragging(true);
    setDragAnchor([i, j]);
    applyRegion(i, j, i, j);
  };

  const handleCellMouseEnter = (i: number, j: number) => {
    if (!dragging || !dragAnchor || phase !== 'query') return;
    applyRegion(dragAnchor[0], dragAnchor[1], i, j);
  };

  useEffect(() => {
    const up = () => setDragging(false);
    window.addEventListener('mouseup', up);
    return () => window.removeEventListener('mouseup', up);
  }, []);

  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 0;
  const prefix = useMemo(() => buildPrefix2D(matrix), [matrix]);

  const buildSteps: BuildStep[] = useMemo(() => {
    const steps: BuildStep[] = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const top = i > 0 ? prefix[i - 1][j] : 0;
        const left = j > 0 ? prefix[i][j - 1] : 0;
        const overlap = i > 0 && j > 0 ? prefix[i - 1][j - 1] : 0;
        steps.push({
          row: i,
          col: j,
          value: matrix[i][j],
          top,
          left,
          overlap,
          result: prefix[i][j],
        });
      }
    }
    return steps;
  }, [matrix, prefix, rows, cols]);

  const regionCells = useMemo(() => {
    const cells: [number, number][] = [];
    for (let i = r1; i <= r2; i++)
      for (let j = c1; j <= c2; j++) cells.push([i, j]);
    return cells;
  }, [r1, c1, r2, c2]);

  const bruteTotalSteps = 1 + regionCells.length + 1;

  const querySubSteps = 5;

  const maxSubStep = useMemo(() => {
    switch (phase) {
      case 'brute':
        return bruteTotalSteps - 1;
      case 'why-slow':
        return 2;
      case 'build':
        return buildSteps.length;
      case 'query':
        return querySubSteps - 1;
      case 'compare':
        return 0;
      case 'quiz':
        return 0;
      default:
        return 0;
    }
  }, [phase, bruteTotalSteps, buildSteps.length]);

  const resetStory = () => {
    setPhase('brute');
    setSubStep(0);
    setPlaying(false);
  };

  const loadMatrix = (next: number[][]) => {
    setMatrix(next);
    setInput(matrixToInputString(next));
    setInputError('');
    resetStory();
    const region = defaultRegionForMatrix(next);
    setR1(region.r1);
    setC1(region.c1);
    setR2(region.r2);
    setC2(region.c2);
  };

  const applyInput = () => {
    const parsed = parseMatrixInput(input);
    if (!parsed) {
      setInputError('Enter a valid matrix: equal-length rows, numbers only.');
      return;
    }
    loadMatrix(parsed);
  };

  const randomize = () => {
    loadMatrix(randomMatrix(3, 3, 1, 9));
  };

  const goNext = useCallback(() => {
    if (subStep < maxSubStep) setSubStep((s) => s + 1);
    else {
      const idx = PHASES.findIndex((p) => p.id === phase);
      if (idx < PHASES.length - 1) {
        setPhase(PHASES[idx + 1].id);
        setSubStep(0);
      }
    }
  }, [subStep, maxSubStep, phase]);

  const goPrev = useCallback(() => {
    if (subStep > 0) setSubStep((s) => s - 1);
    else {
      const idx = PHASES.findIndex((p) => p.id === phase);
      if (idx > 0) {
        const prevPhase = PHASES[idx - 1].id;
        setPhase(prevPhase);
        const prevMax =
          prevPhase === 'brute'
            ? bruteTotalSteps - 1
            : prevPhase === 'why-slow'
              ? 2
              : prevPhase === 'build'
                ? buildSteps.length
                : prevPhase === 'query'
                  ? querySubSteps - 1
                  : 0;
        setSubStep(prevMax);
      }
    }
  }, [subStep, phase, bruteTotalSteps, buildSteps.length]);

  useEffect(() => {
    if (!playing || phase === 'quiz') return;
    const timer = setInterval(goNext, speed);
    return () => clearInterval(timer);
  }, [playing, speed, goNext, phase]);

  useEffect(() => {
    if (phase === 'quiz') setPlaying(false);
  }, [phase]);

  const phaseIdx = PHASES.findIndex((p) => p.id === phase);
  const canNext = phaseIdx < PHASES.length - 1 || subStep < maxSubStep;
  const canPrev = phaseIdx > 0 || subStep > 0;

  const queryResult = regionSum2D(prefix, r1, c1, r2, c2);

  const currentBuild = subStep > 0 ? buildSteps[subStep - 1] : null;
  const buildFilled = phase === 'build' ? subStep : phase === 'query' || phase === 'compare' ? rows * cols : 0;

  const isBuilt = (i: number, j: number) => {
    const flat = i * cols + j;
    return flat < buildFilled;
  };

  const bruteCurrent = subStep > 0 && subStep <= regionCells.length ? regionCells[subStep - 1] : null;
  const bruteSum = useMemo(() => {
    if (phase !== 'brute' || subStep <= 0) return 0;
    const count = Math.min(subStep, regionCells.length);
    let s = 0;
    for (let k = 0; k < count; k++) {
      const [ri, ci] = regionCells[k];
      s += matrix[ri][ci];
    }
    return s;
  }, [phase, subStep, regionCells, matrix]);

  const matrixHighlight = (i: number, j: number): keyof typeof VIZ | undefined => {
    if (phase === 'brute') {
      const inRegion = i >= r1 && i <= r2 && j >= c1 && j <= c2;
      if (!inRegion) return undefined;
      if (bruteCurrent && bruteCurrent[0] === i && bruteCurrent[1] === j) return 'blue';
      if (subStep > 0) {
        const idx = regionCells.findIndex(([ri, ci]) => ri === i && ci === j);
        if (idx >= 0 && idx < subStep - 1) return 'green';
        return 'purple';
      }
      return 'purple';
    }

    if (phase === 'build' && currentBuild) {
      const { row: cr, col: cc } = currentBuild;
      if (i === cr && j === cc) return 'blue';
      if (i < cr && j <= cc) return 'green';
      if (i <= cr && j < cc) return 'green';
      if (i < cr && j < cc) return 'yellow';
    }

    if (phase === 'query') {
      if (i >= r1 && i <= r2 && j >= c1 && j <= c2) return 'purple';
      if (subStep >= 1 && i <= r2 && j <= c2) return 'green';
      if (subStep >= 2 && r1 > 0 && i < r1 && j <= c2) return 'red';
      if (subStep >= 3 && c1 > 0 && i <= r2 && j < c1) return 'red';
      if (subStep >= 4 && r1 > 0 && c1 > 0 && i < r1 && j < c1) return 'yellow';
    }

    return undefined;
  };

  const prefixHighlight = (i: number, j: number): keyof typeof VIZ | undefined => {
    if (phase === 'build' && currentBuild) {
      const { row: cr, col: cc } = currentBuild;
      if (i === cr && j === cc) return 'blue';
      if (i < cr && j === cc) return 'green';
      if (i === cr && j < cc) return 'green';
      if (i < cr && j < cc) return 'yellow';
    }
    if (phase === 'query') {
      if (subStep >= 1 && i <= r2 && j <= c2) return 'green';
      if (subStep >= 2 && r1 > 0 && i === r1 - 1 && j === c2) return 'red';
      if (subStep >= 3 && c1 > 0 && i === r2 && j === c1 - 1) return 'red';
      if (subStep >= 4 && r1 > 0 && c1 > 0 && i === r1 - 1 && j === c1 - 1) return 'yellow';
    }
    return undefined;
  };

  const renderExplanation = () => {
    switch (phase) {
      case 'brute':
        if (subStep === 0)
          return (
            <>
              <strong>Brute force:</strong> Loop through every cell in the rectangle ({r1},{c1})→
              ({r2},{c2}) and add values.
            </>
          );
        if (subStep <= regionCells.length && bruteCurrent) {
          const [ri, ci] = bruteCurrent;
          return (
            <>
              Visit cell ({ri},{ci}) = <span className="text-viz-blue">{matrix[ri][ci]}</span>.
              Running sum = <span className="text-viz-green font-bold">{bruteSum}</span>
            </>
          );
        }
        return (
          <>
            Region sum = <span className="text-viz-purple font-bold">{queryResult}</span>. Visited{' '}
            {regionCells.length} cells. <span className="text-viz-red">O(rows × cols)</span> per
            query.
          </>
        );

      case 'why-slow':
        if (subStep === 0) return <>Many sub-matrix queries on a large grid? Brute force adds up fast.</>;
        if (subStep === 1)
          return (
            <>
              <span className="text-viz-red">q queries × O(n·m)</span> per query is too slow. We need
              preprocessing. Enter <span className="text-viz-green font-bold">2D prefix sum</span>.
            </>
          );
        return <>Build a prefix matrix where each cell stores the sum of the rectangle from (0,0) to that cell.</>;

      case 'build':
        if (subStep === 0)
          return <>Fill the prefix matrix cell by cell using: value + top + left − overlap.</>;
        if (!currentBuild) return null;
        return (
          <>
            Cell ({currentBuild.row},{currentBuild.col}):{' '}
            <span className="text-viz-blue">{currentBuild.value}</span> +{' '}
            <span className="text-viz-green">top {currentBuild.top}</span> +{' '}
            <span className="text-viz-green">left {currentBuild.left}</span> −{' '}
            <span className="text-viz-yellow">overlap {currentBuild.overlap}</span> ={' '}
            <span className="text-viz-green font-bold">{currentBuild.result}</span>
            <br />
            <span className="text-slate-400 text-xs">
              Green = top & left areas. Yellow = overlap counted twice. Subtract once.
            </span>
          </>
        );

      case 'query':
        if (subStep === 0)
          return (
            <>
              Selected region in <span className="text-viz-purple">purple</span>: cells ({r1},{c1})
              to ({r2},{c2}).
            </>
          );
        if (subStep === 1)
          return (
            <>
              <span className="font-mono text-viz-green">
                prefix[{r2}][{c2}] = {prefix[r2][c2]}
              </span>{' '}
              = sum of entire rectangle from (0,0) to ({r2},{c2}).
            </>
          );
        if (subStep === 2 && r1 > 0)
          return (
            <>
              Remove <span className="text-viz-red">top strip</span> above row {r1}: subtract{' '}
              <span className="font-mono">prefix[{r1 - 1}][{c2}] = {prefix[r1 - 1][c2]}</span>
            </>
          );
        if (subStep === 3 && c1 > 0)
          return (
            <>
              Remove <span className="text-viz-red">left strip</span> left of col {c1}: subtract{' '}
              <span className="font-mono">prefix[{r2}][{c1 - 1}] = {prefix[r2][c1 - 1]}</span>
            </>
          );
        if (subStep === 4 && r1 > 0 && c1 > 0)
          return (
            <>
              Top-left corner <span className="font-mono">({r1 - 1},{c1 - 1})</span> was removed{' '}
              <strong>twice</strong>. Add back once in{' '}
              <span className="text-viz-yellow">yellow</span>: +prefix[{r1 - 1}][{c1 - 1}] ={' '}
              {prefix[r1 - 1][c1 - 1]}
            </>
          );
        return (
          <>
            Remaining <span className="text-viz-purple">purple</span> cells sum to{' '}
            <span className="font-bold">{queryResult}</span>
          </>
        );

      case 'compare':
        return (
          <>
            Build once in O(n·m), answer any rectangle in O(1).{' '}
            <span className="text-viz-red">O(n·m × q)</span> →{' '}
            <span className="text-viz-green">O(n·m + q)</span>.
          </>
        );

      case 'quiz':
        return <>Quick check on 2D prefix sum concepts.</>;

      default:
        return null;
    }
  };

  const renderFormula = () => {
    switch (phase) {
      case 'brute':
        return <>sum = add every cell in region, O(area) per query</>;
      case 'why-slow':
        return <>total = q × O(n·m) = <span className="text-viz-red">O(n·m × q)</span></>;
      case 'build':
        return (
          <>
            prefix[i][j] = <span className="text-viz-blue">matrix[i][j]</span> +{' '}
            <span className="text-viz-green">prefix[i−1][j]</span> +{' '}
            <span className="text-viz-green">prefix[i][j−1]</span> −{' '}
            <span className="text-viz-yellow">prefix[i−1][j−1]</span>
          </>
        );
      case 'query':
        return (
          <>
            sum = <span className="text-viz-green">prefix[{r2}][{c2}]</span>
            {r1 > 0 && (
              <>
                {' '}
                − <span className="text-viz-red">prefix[{r1 - 1}][{c2}]</span>
              </>
            )}
            {c1 > 0 && (
              <>
                {' '}
                − <span className="text-viz-red">prefix[{r2}][{c1 - 1}]</span>
              </>
            )}
            {r1 > 0 && c1 > 0 && (
              <>
                {' '}
                + <span className="text-viz-yellow">prefix[{r1 - 1}][{c1 - 1}]</span>
              </>
            )}
            <br />= {prefix[r2][c2]}
            {r1 > 0 ? ` − ${prefix[r1 - 1][c2]}` : ''}
            {c1 > 0 ? ` − ${prefix[r2][c1 - 1]}` : ''}
            {r1 > 0 && c1 > 0 ? ` + ${prefix[r1 - 1][c1 - 1]}` : ''} ={' '}
            <span className="text-viz-purple font-bold">{queryResult}</span>
          </>
        );
      case 'compare':
        return (
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-viz-red/40 bg-viz-red/10 p-3 text-sm">
              <p className="text-viz-red font-semibold">Brute force</p>
              <p>Per query: O(n·m)</p>
            </div>
            <div className="rounded-lg border border-viz-green/40 bg-viz-green/10 p-3 text-sm">
              <p className="text-viz-green font-semibold">2D prefix sum</p>
              <p>Build: O(n·m)</p>
              <p>Per query: O(1)</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const labExplanation = useMemo(
    () =>
      build2DLabExplanation(
        phase,
        subStep,
        maxSubStep,
        r1,
        c1,
        r2,
        c2,
        currentBuild,
        queryResult,
        prefix,
      ),
    [phase, subStep, maxSubStep, r1, c1, r2, c2, currentBuild, queryResult, prefix],
  );

  const codeLine = useMemo(() => get2DCodeLine(phase, subStep), [phase, subStep]);
  const isLab = useLabSyncEffect(labExplanation, codeLine, 2);

  return (
    <div className="space-y-6">
      <MatrixInputBar
        input={input}
        onInputChange={(v) => {
          setInput(v);
          setInputError('');
        }}
        onApply={applyInput}
        onRandom={randomize}
        error={inputError}
      />

      <StoryPhaseNav
        phases={[...PHASES]}
        current={phase}
        onSelect={(id) => {
          setPhase(id as PhaseId);
          setSubStep(0);
          setPlaying(false);
        }}
      />

      <ColorLegend
        items={[
          { color: 'blue', label: 'Current cell' },
          { color: 'green', label: 'Included area' },
          { color: 'red', label: 'Removed strip' },
          { color: 'yellow', label: 'Overlap add back' },
          { color: 'purple', label: 'Query region' },
        ]}
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <p className="text-xs text-lab-muted uppercase tracking-wide mb-2">
            Original matrix {phase === 'query' && <span className="text-viz-purple">(drag to select)</span>}
          </p>
          <div className="inline-block space-y-1">
            {matrix.map((row, i) => (
              <div key={i} className="flex gap-1">
                {row.map((v, j) => (
                  <GridCell
                    key={j}
                    value={v}
                    highlight={matrixHighlight(i, j)}
                    title={`matrix[${i}][${j}] = ${v}`}
                    selectable={phase === 'query'}
                    onMouseDown={() => handleCellMouseDown(i, j)}
                    onMouseEnter={() => handleCellMouseEnter(i, j)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {(phase === 'build' || phase === 'query' || phase === 'compare') && (
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Prefix matrix</p>
            <div className="inline-block space-y-1">
              {prefix.map((row, i) => (
                <div key={i} className="flex gap-1">
                  {row.map((v, j) => (
                    <GridCell
                      key={j}
                      value={isBuilt(i, j) ? v : ''}
                      empty={!isBuilt(i, j)}
                      highlight={prefixHighlight(i, j)}
                      title={
                        isBuilt(i, j)
                          ? `prefix[${i}][${j}] = ${v}`
                          : 'Not computed yet'
                      }
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {phase === 'why-slow' && (
        <div className="grid sm:grid-cols-3 gap-3">
          {['region A', 'region B', 'region C'].map((label) => (
            <div
              key={label}
              className={`rounded-lg border p-3 text-center ${
                subStep >= 1 ? 'border-viz-red/50 bg-viz-red/10' : 'border-border bg-surface-raised'
              }`}
            >
              <p className="text-sm">{label}</p>
              <p className="text-viz-red text-xs mt-1">O(n·m)</p>
            </div>
          ))}
        </div>
      )}

      {phase === 'query' && (
        <div className="glass rounded-xl p-4 space-y-3">
          <p className="text-xs text-lab-muted uppercase tracking-wide">Submatrix query playground</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(
              [
                ['r1', r1, setR1, rows - 1],
                ['c1', c1, setC1, cols - 1],
                ['r2', r2, setR2, rows - 1],
                ['c2', c2, setC2, cols - 1],
              ] as const
            ).map(([label, val, setter, max]) => (
              <label key={label}>
                <span className="text-xs text-lab-muted">{label} = {val}</span>
                <input
                  type="range"
                  min={0}
                  max={max}
                  value={val}
                  onChange={(e) => setter(Number(e.target.value))}
                  className="w-full accent-viz-purple"
                />
              </label>
            ))}
          </div>
          <p className="font-mono text-sm">
            Answer = <span className="text-viz-purple font-bold text-lg">{queryResult}</span>
          </p>
        </div>
      )}

      {!isLab && <FormulaBox>{renderFormula()}</FormulaBox>}

      {!isLab && (
        <StepExplanation step={subStep} total={maxSubStep + 1}>
          {renderExplanation()}
        </StepExplanation>
      )}

      {phase !== 'quiz' && (
        <StepControls
          onPrev={goPrev}
          onNext={goNext}
          onPlay={() => {
            if (subStep >= maxSubStep && phaseIdx >= PHASES.length - 1) resetStory();
            else setPlaying((p) => !p);
          }}
          onReset={resetStory}
          playing={playing}
          canPrev={canPrev}
          canNext={canNext}
          speed={speed}
          onSpeedChange={setSpeed}
          speedPresets={isLab}
          playLabel={
            playing
              ? 'Pause'
              : subStep >= maxSubStep && phaseIdx >= PHASES.length - 1
                ? 'Replay story'
                : 'Auto Play'
          }
        />
      )}

      {phase === 'quiz' && <MiniQuiz questions={QUIZ} />}
    </div>
  );
}
