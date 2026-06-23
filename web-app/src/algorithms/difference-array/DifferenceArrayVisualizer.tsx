import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_ARR,
  DEFAULT_UPDATE,
  applyRangeUpdate,
  buildDiffFromArray,
  buildMultiDiffSteps,
  clampMultiUpdates,
  formatDiffValue,
  parseArrayInput,
  randomArray,
  rebuildFromDiff,
  bruteRangeUpdate,
} from '@/lib/difference-array';
import {
  ArrayInputBar,
  Cell,
  ColorLegend,
  FormulaBox,
  MiniQuiz,
  RangeBracket,
  StepControls,
  StepExplanation,
  StoryPhaseNav,
  VIZ,
} from '@/components/visualizer/shared';
import { useLabSyncEffect } from '@/components/lab/LabVisualizerContext';
import { buildDiffLabExplanation, getDiffCodeLine } from './lab-explanations';

const PHASES = [
  { id: 'brute', label: 'Brute force' },
  { id: 'why-slow', label: 'Why slow?' },
  { id: 'build-diff', label: 'Build diff' },
  { id: 'update', label: 'Range update' },
  { id: 'multi', label: 'Multi update' },
  { id: 'rebuild', label: 'Rebuild' },
  { id: 'compare', label: 'Compare' },
  { id: 'quiz', label: 'Quiz' },
] as const;

type PhaseId = (typeof PHASES)[number]['id'];

const QUIZ = [
  {
    question: 'What does diff[l] += value represent?',
    options: [
      'Delete index l',
      'Start applying the change at index l',
      'Sum of the array',
      'Sort the array',
    ],
    correct: 1,
    explanation: 'The +value at diff[l] marks where the increment begins when we rebuild.',
  },
  {
    question: 'Each range update on a difference array takes…',
    options: ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'],
    correct: 1,
    explanation: 'Only diff[l] and diff[r+1] are modified, regardless of range length.',
  },
  {
    question: 'How do you get the final array after Q updates?',
    options: [
      'Sort the diff array',
      'Prefix sum (rebuild) on diff',
      'Binary search on diff',
      'Multiply diff by Q',
    ],
    correct: 1,
    explanation: 'arr[i] = arr[i-1] + diff[i] is prefix sum on the diff array.',
  },
];

export function DifferenceArrayVisualizer() {
  const [input, setInput] = useState(DEFAULT_ARR.join(', '));
  const [arr, setArr] = useState<number[]>(DEFAULT_ARR);
  const [l, setL] = useState(DEFAULT_UPDATE.l);
  const [r, setR] = useState(DEFAULT_UPDATE.r);
  const [value, setValue] = useState(DEFAULT_UPDATE.value);
  const [phase, setPhase] = useState<PhaseId>('brute');
  const [subStep, setSubStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);

  const n = arr.length;
  const baseDiff = useMemo(() => buildDiffFromArray(arr), [arr]);
  const updatedDiff = useMemo(
    () => applyRangeUpdate(baseDiff, l, r, value),
    [baseDiff, l, r, value],
  );
  const finalArr = useMemo(() => rebuildFromDiff(updatedDiff), [updatedDiff]);
  const bruteResult = useMemo(() => bruteRangeUpdate(arr, l, r, value), [arr, l, r, value]);

  const multiUpdates = useMemo(() => clampMultiUpdates(n), [n]);
  const multiDiffSteps = useMemo(() => buildMultiDiffSteps(arr), [arr]);

  const resetStory = () => {
    setPhase('brute');
    setSubStep(0);
    setPlaying(false);
  };

  const applyInput = () => {
    const parsed = parseArrayInput(input);
    if (parsed.length > 0) {
      setArr(parsed);
      resetStory();
      setL(Math.min(1, parsed.length - 1));
      setR(Math.min(3, parsed.length - 1));
    }
  };

  const randomize = () => {
    const next = randomArray(5, 5, 15);
    setInput(next.join(', '));
    setArr(next);
    resetStory();
    setL(1);
    setR(Math.min(3, next.length - 1));
    setValue(5);
  };

  const bruteLoopLen = r - l + 1;
  const bruteMax = 1 + bruteLoopLen;
  const buildMax = arr.length;
  const updateMax = r + 1 < n ? 3 : 2;
  const multiMax = multiUpdates.length;
  const rebuildMax = arr.length;

  const maxSubStep = useMemo(() => {
    switch (phase) {
      case 'brute':
        return bruteMax;
      case 'why-slow':
        return 2;
      case 'build-diff':
        return buildMax;
      case 'update':
        return updateMax;
      case 'multi':
        return multiMax;
      case 'rebuild':
        return rebuildMax;
      case 'compare':
        return 0;
      case 'quiz':
        return 0;
      default:
        return 0;
    }
  }, [phase, bruteMax, buildMax, updateMax, multiMax, rebuildMax]);

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
        const prev = PHASES[idx - 1].id;
        setPhase(prev);
        const prevMax =
          prev === 'brute'
            ? bruteMax
            : prev === 'why-slow'
              ? 2
              : prev === 'build-diff'
                ? buildMax
                : prev === 'update'
                  ? updateMax
                  : prev === 'multi'
                    ? multiMax
                    : prev === 'rebuild'
                      ? rebuildMax
                      : 0;
        setSubStep(prevMax);
      }
    }
  }, [subStep, phase, bruteMax, buildMax, updateMax, multiMax, rebuildMax]);

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

  const bruteCurrentIdx = subStep > 0 && subStep <= bruteLoopLen ? l + subStep - 1 : -1;

  const diffForPhase = useMemo(() => {
    if (phase === 'build-diff') {
      if (subStep === 0) return new Array(n).fill(null);
      return baseDiff.map((v, i) => (i < subStep ? v : null));
    }
    if (phase === 'update') {
      if (subStep === 0) return baseDiff;
      if (subStep === 1) {
        const d = [...baseDiff];
        d[l] += value;
        return d;
      }
      return updatedDiff;
    }
    if (phase === 'multi') return multiDiffSteps[subStep] ?? multiDiffSteps[0];
    if (phase === 'rebuild' || phase === 'compare') return updatedDiff;
    return baseDiff;
  }, [phase, subStep, baseDiff, updatedDiff, multiDiffSteps, multiUpdates, n, l, value]);

  const finalForPhase = useMemo(() => {
    if (phase !== 'rebuild' && phase !== 'compare') return null;
    if (phase === 'rebuild' && subStep === 0) return null;
    if (phase === 'rebuild') {
      return finalArr.map((v, i) => (i < subStep ? v : null));
    }
    return finalArr;
  }, [phase, subStep, finalArr]);

  const rebuildIdx = phase === 'rebuild' && subStep > 0 ? subStep - 1 : -1;

  const arrDisplay = useMemo(() => {
    if (phase !== 'brute' || subStep === 0) return arr;
    if (subStep >= bruteMax) return bruteResult;
    const copy = [...arr];
    for (let i = l; i < l + subStep && i <= r; i++) copy[i] += value;
    return copy;
  }, [phase, subStep, arr, bruteResult, bruteMax, l, r, value]);

  const arrHighlight = (i: number): keyof typeof VIZ | undefined => {
    if (phase === 'brute' && i >= l && i <= r) {
      if (i === bruteCurrentIdx) return 'blue';
      if (subStep > 0 && i < bruteCurrentIdx) return 'green';
      return 'purple';
    }
    if ((phase === 'update' || phase === 'rebuild') && i >= l && i <= r) return 'purple';
    if (phase === 'rebuild' && finalForPhase && i === rebuildIdx) return 'yellow';
    return undefined;
  };

  const diffHighlight = (i: number): keyof typeof VIZ | undefined => {
    if (phase === 'build-diff' && subStep > 0 && i === subStep - 1) return 'blue';
    if (phase === 'update') {
      if (subStep === 1 && i === l) return 'green';
      if (subStep >= 2 && i === l) return 'green';
      if (subStep >= 2 && r + 1 < n && i === r + 1) return 'red';
    }
    if (phase === 'multi' && subStep > 0) {
      const op = multiUpdates[subStep - 1];
      if (op) {
        if (i === op.l) return 'green';
        if (op.r + 1 < n && i === op.r + 1) return 'red';
      }
    }
    if (phase === 'rebuild' && i === rebuildIdx) return 'yellow';
    return undefined;
  };

  const labExplanation = useMemo(
    () =>
      buildDiffLabExplanation(
        phase,
        subStep,
        maxSubStep,
        arr,
        updatedDiff,
        finalArr,
        l,
        r,
        value,
        bruteCurrentIdx,
        rebuildIdx,
        multiUpdates,
      ),
    [
      phase,
      subStep,
      maxSubStep,
      arr,
      updatedDiff,
      finalArr,
      l,
      r,
      value,
      bruteCurrentIdx,
      rebuildIdx,
      multiUpdates,
    ],
  );

  const codeLine = useMemo(() => getDiffCodeLine(phase, subStep), [phase, subStep]);
  const isLab = useLabSyncEffect(labExplanation, codeLine, 0);

  const renderFormula = () => {
    switch (phase) {
      case 'brute':
        return <>for i in [l, r]: arr[i] += value</>;
      case 'why-slow':
        return <>Q updates × O(n) = <span className="text-viz-red">O(Q × n)</span></>;
      case 'build-diff':
        return subStep <= 1 ? (
          <>diff[0] = arr[0]</>
        ) : (
          <>diff[i] = arr[i] − arr[i−1]</>
        );
      case 'update':
        return (
          <>
            diff[{l}] += <span className="text-viz-green">{value}</span>
            {r + 1 < n && (
              <>
                <br />
                diff[{r + 1}] -= <span className="text-viz-red">{value}</span>
              </>
            )}
          </>
        );
      case 'multi':
        return <>Each update: O(1) on diff → total O(Q) for Q updates</>;
      case 'rebuild':
        return (
          <>
            arr[0] = diff[0]
            <br />
            arr[i] = arr[i−1] + diff[i]
          </>
        );
      case 'compare':
        return (
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="rounded-lg border border-viz-red/40 bg-viz-red/10 p-3">
              <p className="text-viz-red font-semibold">Brute force</p>
              <p>O(Q × n)</p>
            </div>
            <div className="rounded-lg border border-viz-green/40 bg-viz-green/10 p-3">
              <p className="text-viz-green font-semibold">Difference array</p>
              <p>O(Q + n)</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <ArrayInputBar
        input={input}
        onInputChange={setInput}
        onApply={applyInput}
        onRandom={randomize}
        placeholder="10, 10, 10, 10, 10"
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
          { color: 'purple', label: 'Selected range' },
          { color: 'green', label: 'diff[l] += value' },
          { color: 'red', label: 'diff[r+1] -= value' },
          { color: 'yellow', label: 'Prefix rebuild step' },
          { color: 'blue', label: 'Current index' },
        ]}
      />

      {n > 0 && (
        <>
          <div>
            <p className="text-xs text-lab-muted uppercase tracking-wide mb-2">Original array</p>
            <div className="flex flex-wrap gap-2">
              {(phase === 'brute' ? arrDisplay : arr).map((v, i) => (
                <Cell
                  key={i}
                  value={v}
                  label={`i=${i}`}
                  highlight={
                    phase !== 'rebuild' && phase !== 'compare' ? arrHighlight(i) : undefined
                  }
                />
              ))}
            </div>
            {(phase === 'brute' || phase === 'update') && (
              <RangeBracket from={l} to={r} total={n} />
            )}
          </div>

          {(phase === 'build-diff' ||
            phase === 'update' ||
            phase === 'multi' ||
            phase === 'rebuild' ||
            phase === 'compare') && (
            <div>
              <p className="text-xs text-lab-muted uppercase tracking-wide mb-2">
                Difference array
              </p>
              <div className="flex flex-wrap gap-2">
                {diffForPhase.map((v, i) => (
                  <Cell
                    key={i}
                    value={v === null ? '' : formatDiffValue(v as number)}
                    label={`d[${i}]`}
                    highlight={diffHighlight(i)}
                    empty={v === null}
                  />
                ))}
              </div>
            </div>
          )}

          {(phase === 'rebuild' || phase === 'compare') && (
            <div>
              <p className="text-xs text-lab-muted uppercase tracking-wide mb-2">
                Final array after prefix sum
              </p>
              <div className="flex flex-wrap gap-2">
                {finalArr.map((v, i) => (
                  <Cell
                    key={i}
                    value={phase === 'rebuild' && subStep > 0 && i >= subStep ? '' : v}
                    label={`i=${i}`}
                    highlight={arrHighlight(i)}
                    empty={phase === 'rebuild' && subStep > 0 && i >= subStep}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {(phase === 'update' || phase === 'rebuild') && (
        <div className="glass rounded-xl p-4 space-y-3">
          <p className="text-xs text-lab-muted uppercase tracking-wide">Update operation</p>
          <div className="grid sm:grid-cols-3 gap-4">
            <label>
              <span className="text-xs text-lab-muted">l = {l}</span>
              <input
                type="range"
                min={0}
                max={n - 1}
                value={l}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setL(v);
                  if (v > r) setR(v);
                }}
                className="w-full accent-viz-purple"
              />
            </label>
            <label>
              <span className="text-xs text-lab-muted">r = {r}</span>
              <input
                type="range"
                min={0}
                max={n - 1}
                value={r}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setR(v);
                  if (v < l) setL(v);
                }}
                className="w-full accent-viz-purple"
              />
            </label>
            <label>
              <span className="text-xs text-lab-muted">value = {value}</span>
              <input
                type="range"
                min={-10}
                max={10}
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full accent-viz-green"
              />
            </label>
          </div>
        </div>
      )}

      {phase === 'multi' && (
        <div className="glass rounded-xl p-4 overflow-x-auto">
          <p className="text-xs text-lab-muted uppercase tracking-wide mb-3">Update table</p>
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="text-lab-muted text-left border-b border-lab-border">
                <th className="pb-2 pr-4">#</th>
                <th className="pb-2 pr-4">l</th>
                <th className="pb-2 pr-4">r</th>
                <th className="pb-2">value</th>
              </tr>
            </thead>
            <tbody>
              {multiUpdates.map((op, i) => (
                <tr
                  key={i}
                  className={`border-b border-lab-border/50 ${
                    subStep === i + 1 ? 'text-viz-green' : ''
                  }`}
                >
                  <td className="py-2 pr-4">{i + 1}</td>
                  <td className="py-2 pr-4">{op.l}</td>
                  <td className="py-2 pr-4">{op.r}</td>
                  <td className="py-2">{op.value > 0 ? `+${op.value}` : op.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {subStep === multiMax && (
            <p className="mt-3 text-sm">
              Rebuild:{' '}
              <span className="text-viz-purple font-bold">
                [{rebuildFromDiff(multiDiffSteps[multiMax]).join(', ')}]
              </span>
            </p>
          )}
        </div>
      )}

      {!isLab && <FormulaBox>{renderFormula()}</FormulaBox>}

      {!isLab && (
        <StepExplanation step={subStep} total={maxSubStep + 1}>
          {phase === 'compare' ? (
            <>
              Prefix sum optimizes reads. Difference array optimizes writes. Together they cover
              range queries and range updates.
            </>
          ) : (
            labExplanation?.meaning ?? 'Press Next to continue.'
          )}
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
