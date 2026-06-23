import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_ARR,
  buildBestRow,
  buildCurrentRow,
  computeKadaneSteps,
  parseArrayInput,
  randomArray,
} from '@/lib/kadane';
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
import { buildKadaneLabExplanation, getKadaneCodeLine } from './lab-explanations';

const PHASES = [
  { id: 'brute', label: 'Brute force' },
  { id: 'why-slow', label: 'Why slow?' },
  { id: 'idea', label: 'Key idea' },
  { id: 'scan', label: 'Step by step' },
  { id: 'result', label: 'Result' },
  { id: 'compare', label: 'Compare' },
  { id: 'quiz', label: 'Quiz' },
] as const;

type PhaseId = (typeof PHASES)[number]['id'];

const QUIZ = [
  {
    question: 'At each index, Kadane compares…',
    options: [
      'arr[i] with arr[i-1]',
      'arr[i] with current_sum + arr[i]',
      'best_sum with arr[i]',
      'Two random elements',
    ],
    correct: 1,
    explanation: 'current_sum = max(arr[i], current_sum + arr[i]) is the core decision.',
  },
  {
    question: 'When current_sum + arr[i] < arr[i], we should…',
    options: [
      'Stop the algorithm',
      'Start a new subarray at i',
      'Reset best_sum to 0',
      'Skip arr[i]',
    ],
    correct: 1,
    explanation: 'The old prefix hurts us. Starting fresh at arr[i] gives a better sum.',
  },
  {
    question: "Kadane's algorithm runs in…",
    options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(1)'],
    correct: 2,
    explanation: 'One pass through the array, constant extra space.',
  },
];

export function KadaneVisualizer() {
  const [input, setInput] = useState(DEFAULT_ARR.join(', '));
  const [arr, setArr] = useState<number[]>(DEFAULT_ARR);
  const [phase, setPhase] = useState<PhaseId>('brute');
  const [subStep, setSubStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);

  const n = arr.length;
  const steps = useMemo(() => computeKadaneSteps(arr), [arr]);
  const lastStep = steps[steps.length - 1];
  const bestSum = lastStep?.bestSum ?? 0;
  const bestStart = lastStep?.bestStart ?? 0;
  const bestEnd = lastStep?.bestEnd ?? 0;

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
    }
  };

  const randomize = () => {
    const next = randomArray(9, -9, 9);
    setInput(next.join(', '));
    setArr(next);
    resetStory();
  };

  const scanMax = Math.max(0, n - 1);

  const maxSubStep = useMemo(() => {
    switch (phase) {
      case 'brute':
        return 1;
      case 'why-slow':
        return 1;
      case 'idea':
        return 1;
      case 'scan':
        return scanMax;
      case 'result':
        return 0;
      case 'compare':
        return 0;
      case 'quiz':
        return 0;
      default:
        return 0;
    }
  }, [phase, scanMax]);

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
          prev === 'brute' || prev === 'why-slow' || prev === 'idea'
            ? 1
            : prev === 'scan'
              ? scanMax
              : 0;
        setSubStep(prevMax);
      }
    }
  }, [subStep, phase, scanMax]);

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

  const scanIdx = phase === 'scan' ? subStep : phase === 'result' ? n - 1 : -1;
  const currentStep = scanIdx >= 0 ? steps[scanIdx] : null;

  const currentRow = useMemo(() => {
    if (phase !== 'scan' && phase !== 'result') return null;
    return buildCurrentRow(steps, scanIdx);
  }, [phase, steps, scanIdx]);

  const bestRow = useMemo(() => {
    if (phase !== 'scan' && phase !== 'result') return null;
    return buildBestRow(steps, scanIdx);
  }, [phase, steps, scanIdx]);

  const arrHighlight = (i: number): keyof typeof VIZ | undefined => {
    if (phase === 'scan' && currentStep) {
      if (i === currentStep.index) return 'blue';
      if (currentStep.choseRestart && i < currentStep.index && i >= 0) return 'red';
      if (i >= currentStep.currentStart && i <= currentStep.index) return 'yellow';
    }
    if ((phase === 'result' || phase === 'compare') && i >= bestStart && i <= bestEnd) {
      return 'green';
    }
    return undefined;
  };

  const rowHighlight = (
    i: number,
    row: 'current' | 'best',
  ): keyof typeof VIZ | undefined => {
    if (phase !== 'scan' && phase !== 'result') return undefined;
    if (row === 'current' && scanIdx >= 0 && i === scanIdx) return 'yellow';
    if (row === 'best' && scanIdx >= 0 && i === scanIdx) return 'purple';
    return undefined;
  };

  const labExplanation = useMemo(
    () =>
      buildKadaneLabExplanation(
        phase,
        subStep,
        maxSubStep,
        currentStep,
        bestSum,
        bestStart,
        bestEnd,
        arr,
      ),
    [phase, subStep, maxSubStep, currentStep, bestSum, bestStart, bestEnd, arr],
  );

  const codeLine = useMemo(() => getKadaneCodeLine(phase, subStep), [phase, subStep]);
  const isLab = useLabSyncEffect(labExplanation, codeLine, 0);

  const renderFormula = () => {
    switch (phase) {
      case 'brute':
        return (
          <>
            for i in 0..n:
            <br />
            &nbsp;&nbsp;for j in i..n: check sum(i, j)
          </>
        );
      case 'why-slow':
        return <>O(n²) subarrays to check</>;
      case 'idea':
        return (
          <>
            current_sum = max(arr[i], current_sum + arr[i])
            <br />
            best_sum = max(best_sum, current_sum)
          </>
        );
      case 'scan':
        if (!currentStep) return null;
        if (currentStep.index === 0) {
          return (
            <>
              current_sum = arr[0] = <span className="text-viz-yellow">{currentStep.currentSum}</span>
              <br />
              best_sum = <span className="text-viz-purple">{currentStep.bestSum}</span>
            </>
          );
        }
        return (
          <>
            continue = {currentStep.prevCurrentSum} + {currentStep.arrVal} ={' '}
            <span className={currentStep.choseRestart ? 'text-lab-muted' : 'text-viz-yellow'}>
              {currentStep.continueVal}
            </span>
            <br />
            start new = <span className={currentStep.choseRestart ? 'text-viz-green' : 'text-lab-muted'}>
              {currentStep.startNewVal}
            </span>
            <br />
            current_sum = max(...) ={' '}
            <span className="text-viz-yellow">{currentStep.currentSum}</span>
          </>
        );
      case 'result':
        return (
          <>
            Best sum = <span className="text-viz-purple">{bestSum}</span>
            <br />
            Subarray = [{arr.slice(bestStart, bestEnd + 1).join(', ')}]
          </>
        );
      case 'compare':
        return (
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="rounded-lg border border-viz-red/40 bg-viz-red/10 p-3">
              <p className="text-viz-red font-semibold">Brute force</p>
              <p>O(n²)</p>
            </div>
            <div className="rounded-lg border border-viz-green/40 bg-viz-green/10 p-3">
              <p className="text-viz-green font-semibold">Kadane</p>
              <p>O(n) time · O(1) space</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const showRows = phase === 'scan' || phase === 'result';
  const showDecision =
    phase === 'scan' && currentStep && currentStep.index > 0;
  const showSummary = phase === 'scan' || phase === 'result';

  return (
    <div className="space-y-6">
      <ArrayInputBar
        input={input}
        onInputChange={setInput}
        onApply={applyInput}
        onRandom={randomize}
        placeholder="-2, 1, -3, 4, -1, 2, 1, -5, 4"
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
          { color: 'blue', label: 'Current element' },
          { color: 'yellow', label: 'Current subarray' },
          { color: 'green', label: 'Best subarray' },
          { color: 'red', label: 'Dropped prefix' },
          { color: 'purple', label: 'Best sum value' },
        ]}
      />

      {n > 0 && (
        <>
          <div>
            <p className="text-xs text-lab-muted uppercase tracking-wide mb-2">Array</p>
            <div className="flex flex-wrap gap-2">
              {arr.map((v, i) => (
                <Cell key={i} value={v} label={`i=${i}`} highlight={arrHighlight(i)} />
              ))}
            </div>
            {showSummary && currentStep && phase === 'scan' && (
              <RangeBracket
                from={currentStep.currentStart}
                to={currentStep.index}
                total={n}
              />
            )}
            {phase === 'result' && (
              <RangeBracket from={bestStart} to={bestEnd} total={n} />
            )}
          </div>

          {showRows && currentRow && (
            <div>
              <p className="text-xs text-lab-muted uppercase tracking-wide mb-2">Current sum</p>
              <div className="flex flex-wrap gap-2">
                {currentRow.map((v, i) => (
                  <Cell
                    key={i}
                    value={v === null ? '' : v}
                    label={`i=${i}`}
                    highlight={rowHighlight(i, 'current')}
                    empty={v === null}
                  />
                ))}
              </div>
            </div>
          )}

          {showRows && bestRow && (
            <div>
              <p className="text-xs text-lab-muted uppercase tracking-wide mb-2">Best sum</p>
              <div className="flex flex-wrap gap-2">
                {bestRow.map((v, i) => (
                  <Cell
                    key={i}
                    value={v === null ? '' : v}
                    label={`i=${i}`}
                    highlight={rowHighlight(i, 'best')}
                    empty={v === null}
                  />
                ))}
              </div>
            </div>
          )}

          {showSummary && (
            <div className="glass rounded-xl p-4 grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-lab-muted uppercase tracking-wide mb-1">
                  Current subarray
                </p>
                <p className="font-mono text-viz-yellow">
                  {currentStep
                    ? `[${arr.slice(currentStep.currentStart, currentStep.index + 1).join(', ')}]`
                    : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-lab-muted uppercase tracking-wide mb-1">Sums</p>
                <p className="font-mono">
                  Current:{' '}
                  <span className="text-viz-yellow">{currentStep?.currentSum ?? '—'}</span>
                  {' · '}
                  Best: <span className="text-viz-purple">{currentStep?.bestSum ?? bestSum}</span>
                </p>
              </div>
            </div>
          )}

          {showDecision && currentStep && (
            <div className="glass rounded-xl p-4 space-y-3 border border-lab-border">
              <p className="text-xs text-lab-muted uppercase tracking-wide">Decision box</p>
              <div className="grid sm:grid-cols-2 gap-4 text-sm font-mono">
                <div
                  className={`rounded-lg p-3 border ${
                    !currentStep.choseRestart
                      ? 'border-viz-yellow/50 bg-viz-yellow/10'
                      : 'border-lab-border opacity-60'
                  }`}
                >
                  <p className="text-lab-muted text-xs mb-1">Continue previous subarray?</p>
                  <p>
                    current_sum + arr[i] = {currentStep.prevCurrentSum} + {currentStep.arrVal} ={' '}
                    {currentStep.continueVal}
                  </p>
                </div>
                <div
                  className={`rounded-lg p-3 border ${
                    currentStep.choseRestart
                      ? 'border-viz-green/50 bg-viz-green/10'
                      : 'border-lab-border opacity-60'
                  }`}
                >
                  <p className="text-lab-muted text-xs mb-1">Start new subarray?</p>
                  <p>arr[i] = {currentStep.startNewVal}</p>
                </div>
              </div>
              <p className="text-sm">
                Choose max ={' '}
                <span className="text-viz-purple font-bold">{currentStep.currentSum}</span>
                {currentStep.choseRestart && (
                  <span className="text-lab-muted ml-2">
                    (previous prefix faded in red)
                  </span>
                )}
              </p>
            </div>
          )}
        </>
      )}

      {!isLab && <FormulaBox>{renderFormula()}</FormulaBox>}

      {!isLab && (
        <StepExplanation step={subStep} total={maxSubStep + 1}>
          {phase === 'compare' ? (
            <>
              Kadane works by asking at every position: is it better to continue the old subarray,
              or start fresh from here?
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
