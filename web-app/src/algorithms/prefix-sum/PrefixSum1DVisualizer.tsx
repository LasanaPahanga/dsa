import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  buildPrefix1D,
  parseArrayInput,
  randomArray,
  rangeSum1D,
} from '@/lib/prefix-sum';
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
import { build1DLabExplanation, get1DCodeLine } from './lab-explanations-1d';

const DEFAULT_ARR = [2, 4, 1, 5, 3];
const QUERY_L = 1;
const QUERY_R = 3;

const PHASES = [
  { id: 'brute', label: 'Brute force' },
  { id: 'why-slow', label: 'Why slow?' },
  { id: 'build', label: 'Build prefix' },
  { id: 'query', label: 'Range query' },
  { id: 'compare', label: 'Compare' },
  { id: 'quiz', label: 'Quiz' },
] as const;

type PhaseId = (typeof PHASES)[number]['id'];

const QUIZ = [
  {
    question: 'After building a prefix array of size n, each range sum query takes…',
    options: ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'],
    correct: 1,
    explanation: 'Once prefix is built, sum(l,r) = prefix[r] − prefix[l−1] is a single subtraction, O(1).',
  },
  {
    question: 'prefix[i] stores the sum of elements from index…',
    options: ['0 to i−1', '0 to i', '1 to i', 'l to r'],
    correct: 1,
    explanation: 'prefix[i] = arr[0] + arr[1] + … + arr[i] (inclusive).',
  },
  {
    question: 'Why do we subtract prefix[l−1] in sum(l, r)?',
    options: [
      'It adds extra values',
      'It removes the part before index l',
      'It doubles the sum',
      'It sorts the array',
    ],
    correct: 1,
    explanation: 'prefix[r] includes indices 0..r. Subtracting prefix[l−1] removes indices 0..l−1, leaving l..r.',
  },
];

export function PrefixSum1DVisualizer() {
  const [input, setInput] = useState(DEFAULT_ARR.join(', '));
  const [arr, setArr] = useState(DEFAULT_ARR);
  const [phase, setPhase] = useState<PhaseId>('brute');
  const [subStep, setSubStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [left, setLeft] = useState(QUERY_L);
  const [right, setRight] = useState(QUERY_R);

  const prefix = useMemo(() => buildPrefix1D(arr), [arr]);
  const n = arr.length;

  const applyInput = () => {
    const parsed = parseArrayInput(input);
    if (parsed.length > 0) {
      setArr(parsed);
      resetStory();
      setLeft(Math.min(QUERY_L, parsed.length - 1));
      setRight(Math.min(QUERY_R, parsed.length - 1));
    }
  };

  const randomize = () => {
    const next = randomArray(5, 1, 9);
    setInput(next.join(', '));
    setArr(next);
    resetStory();
    setLeft(1);
    setRight(Math.min(3, next.length - 1));
  };

  const resetStory = () => {
    setPhase('brute');
    setSubStep(0);
    setPlaying(false);
  };

  const buildSteps = useMemo(() => {
    const steps: { index: number; arrVal: number; prev: number; result: number }[] = [];
    let run = 0;
    for (let i = 0; i < arr.length; i++) {
      const prev = run;
      run += arr[i];
      steps.push({ index: i, arrVal: arr[i], prev, result: run });
    }
    return steps;
  }, [arr]);

  const bruteLoopSteps = right - left + 1;
  const bruteTotalSteps = 1 + bruteLoopSteps + 1;

  const querySubSteps = left > 0 ? 5 : 3;

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
  }, [phase, bruteTotalSteps, buildSteps.length, querySubSteps]);

  const goNext = useCallback(() => {
    if (subStep < maxSubStep) {
      setSubStep((s) => s + 1);
    } else {
      const idx = PHASES.findIndex((p) => p.id === phase);
      if (idx < PHASES.length - 1) {
        setPhase(PHASES[idx + 1].id);
        setSubStep(0);
      }
    }
  }, [subStep, maxSubStep, phase]);

  const goPrev = useCallback(() => {
    if (subStep > 0) {
      setSubStep((s) => s - 1);
    } else {
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
  }, [subStep, phase, bruteTotalSteps, buildSteps.length, querySubSteps]);

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

  const queryResult = rangeSum1D(prefix, left, right);

  const bruteRunningSum = useMemo(() => {
    if (phase !== 'brute' || subStep <= 0) return 0;
    const loopStep = subStep - 1;
    if (loopStep >= bruteLoopSteps) {
      return arr.slice(left, right + 1).reduce((a, b) => a + b, 0);
    }
    let s = 0;
    for (let i = left; i <= left + loopStep; i++) s += arr[i];
    return s;
  }, [phase, subStep, bruteLoopSteps, arr, left, right]);

  const bruteCurrentIdx = subStep > 0 && subStep <= bruteLoopSteps ? left + subStep - 1 : -1;

  const arrHighlight = (i: number): keyof typeof VIZ | undefined => {
    if (phase === 'brute') {
      if (i >= left && i <= right) {
        if (i === bruteCurrentIdx) return 'blue';
        if (subStep > 0 && i >= left && i < bruteCurrentIdx) return 'green';
        if (subStep > 0) return 'purple';
      }
      return undefined;
    }
    if (phase === 'query' && subStep >= 0) {
      if (i >= left && i <= right) return 'purple';
    }
    if (phase === 'build' && i === buildSteps[subStep - 1]?.index) return 'blue';
    return undefined;
  };

  const prefixHighlight = (i: number): keyof typeof VIZ | undefined => {
    if (phase === 'build') {
      if (subStep === 0) return undefined;
      const cur = buildSteps[subStep - 1];
      if (!cur) return undefined;
      if (i === cur.index) return 'blue';
      if (i === cur.index - 1 && cur.index > 0) return 'green';
      if (i < cur.index) return 'green';
      return undefined;
    }
    if (phase === 'query') {
      if (subStep >= 1 && i <= right) return 'green';
      if (subStep >= 2 && left > 0 && i <= left - 1) return 'red';
    }
    return undefined;
  };

  const prefixVisible = (i: number) => {
    if (phase === 'build') return i < subStep;
    if (phase === 'query' || phase === 'compare') return true;
    return false;
  };

  const renderExplanation = () => {
    switch (phase) {
      case 'brute':
        if (subStep === 0)
          return (
            <>
              <strong>Brute force:</strong> To find sum({left}, {right}), loop through each element
              from index {left} to {right} and add them one by one.
            </>
          );
        if (subStep <= bruteLoopSteps) {
          const idx = left + subStep - 1;
          return (
            <>
              Visit <span className="text-viz-blue font-mono">arr[{idx}] = {arr[idx]}</span>.
              Running sum = <span className="text-viz-green font-bold">{bruteRunningSum}</span>
            </>
          );
        }
        return (
          <>
            Done! sum({left}, {right}) = <span className="text-viz-purple font-bold">{bruteRunningSum}</span>.
            We visited <span className="font-mono">{bruteLoopSteps}</span> cells. That is{' '}
            <span className="text-viz-red font-bold">O(n)</span> per query.
          </>
        );

      case 'why-slow':
        if (subStep === 0)
          return (
            <>
              One query loops through the range. But what if we have <strong>many queries</strong>?
            </>
          );
        if (subStep === 1)
          return (
            <>
              <span className="text-viz-red font-bold">3 queries</span> × O(n) each ={' '}
              <span className="text-viz-red font-bold">O(n × q)</span>. With 1000 queries on a big
              array, that is painfully slow.
            </>
          );
        return (
          <>
            Can we preprocess once and answer each query instantly?{' '}
            <span className="text-viz-green font-bold">Yes, prefix sum!</span> → Next phase.
          </>
        );

      case 'build': {
        if (subStep === 0)
          return (
            <>
              Start with an empty prefix array. We will fill it left to right, storing the running
              total at each index.
            </>
          );
        const step = buildSteps[subStep - 1];
        if (!step) return null;
        if (step.index === 0)
          return (
            <>
              <span className="font-mono">prefix[0] = arr[0] = {step.arrVal}</span>
            </>
          );
        return (
          <>
            <span className="font-mono">
              prefix[{step.index}] = prefix[{step.index - 1}] + arr[{step.index}]
            </span>
            <br />
            <span className="font-mono text-viz-green">prefix[{step.index}]</span> ={' '}
            <span className="text-viz-green">{step.prev}</span> +{' '}
            <span className="text-viz-blue">{step.arrVal}</span> ={' '}
            <span className="text-viz-green font-bold">{step.result}</span>
          </>
        );
      }

      case 'query':
        if (subStep === 0)
          return (
            <>
              Select range l={left}, r={right}. Highlighted in{' '}
              <span className="text-viz-purple">purple</span>: arr[{left}] … arr[{right}] ={' '}
              {arr.slice(left, right + 1).join(' + ')} = {queryResult}
            </>
          );
        if (subStep === 1)
          return (
            <>
              <span className="font-mono text-viz-green">prefix[{right}] = {prefix[right]}</span>{' '}
              is the sum of <strong>all elements from index 0 to {right}</strong> (shown in green).
            </>
          );
        if (subStep === 2 && left > 0)
          return (
            <>
              But we only want indices {left}..{right}.{' '}
              <span className="font-mono text-viz-red">prefix[{left - 1}] = {prefix[left - 1]}</span>{' '}
              covers indices 0..{left - 1}, the part <strong>before l</strong> (shown in red).
              Subtract it!
            </>
          );
        if ((subStep === 3 && left > 0) || (subStep === 2 && left === 0))
          return (
            <>
              <span className="font-mono">
                sum({left}, {right}) = prefix[{right}]
                {left > 0 ? ` − prefix[${left - 1}]` : ''} = {prefix[right]}
                {left > 0 ? ` − ${prefix[left - 1]}` : ''} ={' '}
                <span className="text-viz-purple font-bold">{queryResult}</span>
              </span>
            </>
          );
        return (
          <>
            Remaining slice:{' '}
            <span className="text-viz-purple font-mono">
              [{arr.slice(left, right + 1).join(', ')}]
            </span>{' '}
            = <span className="font-bold">{queryResult}</span>. Subtraction removes exactly the
            unwanted prefix. That is why the formula works!
          </>
        );

      case 'compare':
        return (
          <>
            <strong>Before:</strong> each query loops O(n).{' '}
            <strong>After:</strong> build once O(n), then each query is O(1). For q queries:{' '}
            <span className="text-viz-red">O(n×q)</span> →{' '}
            <span className="text-viz-green">O(n + q)</span>.
          </>
        );

      case 'quiz':
        return <>Test your understanding with these quick questions.</>;

      default:
        return null;
    }
  };

  const renderFormula = () => {
    switch (phase) {
      case 'brute':
        return (
          <>
            sum(l, r) = arr[l] + arr[l+1] + … + arr[r]
            <br />
            <span className="text-slate-500">// loop: O(r − l + 1) per query</span>
          </>
        );
      case 'why-slow':
        return (
          <>
            total cost = q queries × O(n) = <span className="text-viz-red">O(n × q)</span>
          </>
        );
      case 'build':
        if (subStep === 0)
          return (
            <>
              prefix[i] = sum of arr[0] … arr[i]
            </>
          );
        const s = buildSteps[subStep - 1];
        if (!s) return null;
        return s.index === 0 ? (
          <>prefix[0] = arr[0]</>
        ) : (
          <>
            prefix[{s.index}] = <span className="text-viz-green">prefix[{s.index - 1}]</span> +{' '}
            <span className="text-viz-blue">arr[{s.index}]</span>
          </>
        );
      case 'query':
        return left === 0 ? (
          <>
            sum(0, r) = prefix[r] = <span className="text-viz-purple">{queryResult}</span>
          </>
        ) : (
          <>
            sum(l, r) = <span className="text-viz-green">prefix[r]</span> −{' '}
            <span className="text-viz-red">prefix[l − 1]</span>
            <br />
            sum({left}, {right}) = {prefix[right]} − {prefix[left - 1]} ={' '}
            <span className="text-viz-purple font-bold">{queryResult}</span>
          </>
        );
      case 'compare':
        return (
          <div className="grid sm:grid-cols-2 gap-4 not-font-mono">
            <div className="rounded-lg border border-viz-red/40 bg-viz-red/10 p-3">
              <p className="text-viz-red font-semibold mb-1">Brute force</p>
              <p>Per query: O(n)</p>
              <p>q queries: O(n × q)</p>
            </div>
            <div className="rounded-lg border border-viz-green/40 bg-viz-green/10 p-3">
              <p className="text-viz-green font-semibold mb-1">Prefix sum</p>
              <p>Build: O(n)</p>
              <p>Per query: O(1)</p>
              <p>q queries: O(n + q)</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const labExplanation = useMemo(
    () =>
      build1DLabExplanation(
        phase,
        subStep,
        maxSubStep,
        arr,
        prefix,
        left,
        right,
        buildSteps,
        bruteRunningSum,
        bruteCurrentIdx,
        queryResult,
      ),
    [
      phase,
      subStep,
      maxSubStep,
      arr,
      prefix,
      left,
      right,
      buildSteps,
      bruteRunningSum,
      bruteCurrentIdx,
      queryResult,
    ],
  );

  const codeLine = useMemo(
    () => get1DCodeLine(phase, subStep, buildSteps),
    [phase, subStep, buildSteps],
  );

  const isLab = useLabSyncEffect(labExplanation, codeLine, 0);

  return (
    <div className="space-y-6">
      <ArrayInputBar
        input={input}
        onInputChange={setInput}
        onApply={applyInput}
        onRandom={randomize}
        placeholder="2, 4, 1, 5, 3"
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
          { color: 'green', label: 'Prefix / accumulated' },
          { color: 'red', label: 'Removed part' },
          { color: 'purple', label: 'Selected range' },
        ]}
      />

      {n > 0 && (
        <>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Original array</p>
            <div className="flex flex-wrap gap-2">
              {arr.map((v, i) => (
                <Cell
                  key={i}
                  value={v}
                  label={`i=${i}`}
                  highlight={arrHighlight(i)}
                  title={`arr[${i}] = ${v}`}
                />
              ))}
            </div>
            {phase === 'brute' && subStep > 0 && (
              <RangeBracket from={left} to={right} total={n} />
            )}
            {phase === 'query' && subStep >= 0 && (
              <RangeBracket from={left} to={right} total={n} />
            )}
          </div>

          {(phase === 'build' || phase === 'query' || phase === 'compare') && (
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Prefix array</p>
              <div className="flex flex-wrap gap-2">
                {prefix.map((v, i) => (
                  <Cell
                    key={i}
                    value={prefixVisible(i) ? v : ''}
                    label={`p[${i}]`}
                    highlight={prefixHighlight(i)}
                    empty={!prefixVisible(i)}
                    title={
                      prefixVisible(i)
                        ? `prefix[${i}] = sum of arr[0..${i}] = ${v}`
                        : 'Not computed yet'
                    }
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {phase === 'why-slow' && (
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { q: 'sum(0, 2)', cost: 'O(n)' },
            { q: 'sum(1, 3)', cost: 'O(n)' },
            { q: 'sum(2, 4)', cost: 'O(n)' },
          ].map((item, i) => (
            <div
              key={item.q}
              className={`rounded-lg border p-3 text-center transition-all ${
                subStep >= 1 && i <= 2
                  ? 'border-viz-red/50 bg-viz-red/10'
                  : 'border-border bg-surface-raised'
              }`}
            >
              <p className="font-mono text-sm">{item.q}</p>
              <p className="text-viz-red text-xs mt-1">{item.cost}</p>
            </div>
          ))}
        </div>
      )}

      {phase === 'query' && (
        <div className="glass rounded-xl p-4 space-y-3">
          <p className="text-xs text-lab-muted uppercase tracking-wide">Range query playground</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <label>
              <span className="text-xs text-lab-muted">L = {left}</span>
              <input
                type="range"
                min={0}
                max={n - 1}
                value={left}
                onChange={(e) => {
                  const l = Number(e.target.value);
                  setLeft(l);
                  if (l > right) setRight(l);
                }}
                className="w-full accent-viz-purple"
              />
            </label>
            <label>
              <span className="text-xs text-lab-muted">R = {right}</span>
              <input
                type="range"
                min={0}
                max={n - 1}
                value={right}
                onChange={(e) => {
                  const r = Number(e.target.value);
                  setRight(r);
                  if (r < left) setLeft(r);
                }}
                className="w-full accent-viz-purple"
              />
            </label>
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
            if (subStep >= maxSubStep && phaseIdx >= PHASES.length - 1) {
              resetStory();
            } else {
              setPlaying((p) => !p);
            }
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
