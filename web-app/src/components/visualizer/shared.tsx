import { useState, type ReactNode } from 'react';

export const VIZ = {
  blue: 'viz-blue',
  green: 'viz-green',
  red: 'viz-red',
  yellow: 'viz-yellow',
  purple: 'viz-purple',
  empty: 'viz-empty',
  base: 'border-lab-border bg-lab-card/50',
  muted: 'border-lab-border bg-lab-card/30 text-lab-muted',
} as const;

type Props = {
  children: ReactNode;
  label?: string;
};

export function FormulaBox({ children, label = 'Formula' }: Props) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">{label}</p>
      <div className="font-mono text-sm leading-relaxed text-slate-200">{children}</div>
    </div>
  );
}

type ExplanationProps = {
  children: ReactNode;
  step?: number;
  total?: number;
};

export function StepExplanation({ children, step, total }: ExplanationProps) {
  return (
    <div className="rounded-xl border border-accent/30 bg-accent-soft/40 p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">Current step</p>
        {step !== undefined && total !== undefined && (
          <span className="text-xs text-slate-400">
            {step + 1} / {total}
          </span>
        )}
      </div>
      <div className="text-sm leading-relaxed text-slate-200">{children}</div>
    </div>
  );
}

type ControlsProps = {
  onPrev: () => void;
  onNext: () => void;
  onPlay: () => void;
  onReset: () => void;
  playing: boolean;
  canPrev: boolean;
  canNext: boolean;
  speed: number;
  onSpeedChange: (speed: number) => void;
  playLabel?: string;
  speedPresets?: boolean;
};

export function StepControls({
  onPrev,
  onNext,
  onPlay,
  onReset,
  playing,
  canPrev,
  canNext,
  speed,
  onSpeedChange,
  playLabel,
  speedPresets = false,
}: ControlsProps) {
  const preset = speed >= 1100 ? 'slow' : speed >= 700 ? 'medium' : 'fast';

  return (
    <div className="flex flex-wrap gap-2 items-center glass rounded-xl p-3">
      <button
        onClick={onPrev}
        disabled={!canPrev}
        className="rounded-lg border border-lab-border px-3 py-1.5 text-sm disabled:opacity-40 hover:bg-white/5 transition-colors"
      >
        ◀ Prev
      </button>
      <button
        onClick={onNext}
        disabled={!canNext}
        className="rounded-lg border border-lab-border px-3 py-1.5 text-sm disabled:opacity-40 hover:bg-white/5 transition-colors"
      >
        Next ▶
      </button>
      <button
        onClick={onPlay}
        className="rounded-lg bg-lab-primary px-4 py-1.5 text-sm font-medium hover:bg-blue-500 transition-colors"
      >
        {playLabel ?? (playing ? '⏸ Pause' : '▶▶ Auto Play')}
      </button>
      <button
        onClick={onReset}
        className="rounded-lg border border-lab-border px-3 py-1.5 text-sm hover:bg-white/5 transition-colors"
      >
        Reset
      </button>
      {speedPresets ? (
        <div className="flex gap-1 ml-auto">
          {(['slow', 'medium', 'fast'] as const).map((p) => (
            <button
              key={p}
              onClick={() =>
                onSpeedChange(p === 'slow' ? 1200 : p === 'medium' ? 800 : 400)
              }
              className={`px-3 py-1 text-xs rounded-lg capitalize transition-colors ${
                preset === p
                  ? 'bg-lab-primary text-white'
                  : 'text-lab-muted hover:text-lab-text border border-lab-border'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      ) : (
        <label className="flex items-center gap-2 ml-auto text-sm text-lab-muted">
          Speed
          <input
            type="range"
            min={200}
            max={1500}
            step={100}
            value={1600 - speed}
            onChange={(e) => onSpeedChange(1600 - Number(e.target.value))}
            className="accent-lab-primary w-24"
          />
        </label>
      )}
    </div>
  );
}

type Phase = { id: string; label: string };

type StoryNavProps = {
  phases: Phase[];
  current: string;
  onSelect: (id: string) => void;
};

export function StoryPhaseNav({ phases, current, onSelect }: StoryNavProps) {
  const currentIdx = phases.findIndex((p) => p.id === current);

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Teaching flow</p>
      <div className="flex flex-wrap gap-1">
        {phases.map((phase, i) => {
          const isActive = phase.id === current;
          const isDone = i < currentIdx;
          return (
            <button
              key={phase.id}
              onClick={() => onSelect(phase.id)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-accent text-white'
                  : isDone
                    ? 'bg-viz-green/20 text-viz-green border border-viz-green/40'
                    : 'border border-border text-slate-400 hover:text-white'
              }`}
            >
              {i + 1}. {phase.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

type LegendItem = { color: keyof typeof VIZ; label: string };

export function ColorLegend({ items }: { items: LegendItem[] }) {
  return (
    <div className="flex flex-wrap gap-3 text-xs text-slate-400">
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-1.5">
          <span className={`w-3 h-3 rounded-sm border ${VIZ[item.color]}`} />
          {item.label}
        </span>
      ))}
    </div>
  );
}

type QuizQuestion = {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

type QuizProps = {
  questions: QuizQuestion[];
};

export function MiniQuiz({ questions }: QuizProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = questions.filter((q, i) => answers[i] === q.correct).length;
  const allAnswered = questions.every((_, i) => answers[i] !== undefined);

  const selectAnswer = (questionIndex: number, optionIndex: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  return (
    <div className="relative z-20 space-y-4 pointer-events-auto">
      {questions.map((q, qi) => (
        <div
          key={qi}
          className="glass rounded-xl border border-lab-border p-4 space-y-3"
        >
          <p className="font-medium text-sm text-lab-text">
            {qi + 1}. {q.question}
          </p>
          <div className="grid sm:grid-cols-2 gap-2" role="radiogroup" aria-label={`Question ${qi + 1}`}>
            {q.options.map((opt, oi) => {
              const selected = answers[qi] === oi;
              const showResult = submitted;
              const isCorrect = oi === q.correct;

              let cls =
                'border-lab-border bg-lab-card/40 text-lab-text hover:border-lab-primary/60 hover:bg-lab-primary/10 cursor-pointer';
              if (showResult && selected && isCorrect) {
                cls = 'border-viz-green bg-viz-green/15 text-lab-text ring-2 ring-viz-green/40';
              } else if (showResult && selected && !isCorrect) {
                cls = 'border-viz-red bg-viz-red/15 text-lab-text ring-2 ring-viz-red/40';
              } else if (showResult && isCorrect) {
                cls = 'border-viz-green/60 bg-viz-green/10 text-lab-text';
              } else if (selected) {
                cls =
                  'border-lab-primary bg-lab-primary/20 text-lab-text ring-2 ring-lab-primary/50';
              }

              return (
                <label
                  key={oi}
                  className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm text-left transition-all select-none ${cls} ${
                    submitted ? 'cursor-default' : 'cursor-pointer'
                  }`}
                >
                  <input
                    type="radio"
                    name={`quiz-q-${qi}`}
                    value={oi}
                    checked={selected}
                    disabled={submitted}
                    onChange={() => selectAnswer(qi, oi)}
                    className="accent-lab-primary shrink-0"
                  />
                  <span>{opt}</span>
                </label>
              );
            })}
          </div>
          {submitted && (
            <p className="text-xs text-lab-muted">{q.explanation}</p>
          )}
        </div>
      ))}
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => setSubmitted(true)}
          disabled={submitted || !allAnswered}
          className="rounded-lg bg-lab-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-40 hover:bg-blue-500 transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          Check answers
        </button>
        {submitted && (
          <p className="text-sm text-lab-text">
            Score: <span className="font-bold text-viz-green">{score}</span> / {questions.length}
          </p>
        )}
        {submitted && (
          <button
            type="button"
            onClick={() => {
              setAnswers({});
              setSubmitted(false);
            }}
            className="rounded-lg glass px-4 py-2 text-sm hover:bg-white/10 transition-colors cursor-pointer"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
export function ArrayInputBar({
  input,
  onInputChange,
  onApply,
  onRandom,
  placeholder,
}: {
  input: string;
  onInputChange: (v: string) => void;
  onApply: () => void;
  onRandom: () => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-wrap gap-3 items-end">
      <label className="flex-1 min-w-[200px]">
        <span className="text-xs text-slate-400 uppercase tracking-wide">Custom input</span>
        <input
          className="mt-1 w-full rounded-lg border border-border bg-surface-raised px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onApply()}
          placeholder={placeholder}
        />
      </label>
      <button
        onClick={onApply}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium hover:bg-blue-500 transition-colors"
      >
        Apply
      </button>
      <button
        onClick={onRandom}
        className="rounded-lg border border-border bg-surface-raised px-4 py-2 text-sm hover:bg-surface-overlay transition-colors"
      >
        Random
      </button>
    </div>
  );
}

export function MatrixInputBar({
  input,
  onInputChange,
  onApply,
  onRandom,
  error,
}: {
  input: string;
  onInputChange: (v: string) => void;
  onApply: () => void;
  onRandom: () => void;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-3 items-end">
        <label className="flex-1 min-w-[200px]">
          <span className="text-xs text-lab-muted uppercase tracking-wide">Matrix input</span>
          <textarea
            className="mt-1 w-full rounded-lg border border-lab-border bg-lab-card/50 px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-lab-primary min-h-[72px] resize-y"
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={'1, 2, 3\n4, 5, 6\n7, 8, 9'}
            rows={3}
          />
        </label>
        <div className="flex gap-2">
          <button
            onClick={onApply}
            className="rounded-lg bg-lab-primary px-4 py-2 text-sm font-medium hover:bg-blue-500 transition-colors"
          >
            Apply
          </button>
          <button
            onClick={onRandom}
            className="rounded-lg glass px-4 py-2 text-sm hover:bg-white/10 transition-colors"
          >
            Random
          </button>
        </div>
      </div>
      <p className="text-xs text-lab-muted">One row per line. Separate values with commas or spaces.</p>
      {error && <p className="text-xs text-lab-error">{error}</p>}
    </div>
  );
}

export function Cell({
  value,
  label,
  highlight,
  title,
  empty = false,
}: {
  value: number | string;
  label?: string;
  highlight?: keyof typeof VIZ;
  title?: string;
  empty?: boolean;
}) {
  const base =
    'flex items-center justify-center rounded-lg border font-mono text-sm min-w-[52px] h-14 transition-all duration-300';
  const cls = highlight ? VIZ[highlight] : empty ? VIZ.empty : VIZ.base;

  return (
    <div className="flex flex-col items-center gap-1" title={title}>
      <div className={`${base} ${cls}`}>{empty ? ' ' : value}</div>
      {label && <span className="text-[10px] text-slate-500">{label}</span>}
    </div>
  );
}

export function RangeBracket({ from, to, total }: { from: number; to: number; total: number }) {
  const cellW = 52 + 8; // min-w + gap
  const left = from * cellW + 26;
  const width = (to - from + 1) * cellW - 8;

  return (
    <div className="relative h-4 mt-1" style={{ width: total * cellW }}>
      <div
        className="absolute top-0 border-b-2 border-viz-purple"
        style={{ left, width }}
      />
      <div
        className="absolute -bottom-1 text-viz-purple text-lg leading-none"
        style={{ left: left - 4 }}
      >
        └
      </div>
      <div
        className="absolute -bottom-1 text-viz-purple text-lg leading-none"
        style={{ left: left + width - 8 }}
      >
        ┘
      </div>
    </div>
  );
}
