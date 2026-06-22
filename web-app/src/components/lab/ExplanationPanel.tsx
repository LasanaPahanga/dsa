import { useLabVisualizer } from './LabVisualizerContext';

const accentClass = {
  primary: 'text-lab-primary',
  success: 'text-lab-success',
  warning: 'text-lab-warning',
  error: 'text-lab-error',
  purple: 'text-viz-purple',
};

export function ExplanationPanel() {
  const lab = useLabVisualizer();
  const exp = lab?.explanation;

  if (!exp) {
    return (
      <aside className="glass-strong rounded-2xl p-5 h-full flex flex-col">
        <p className="text-xs font-semibold uppercase tracking-wider text-lab-muted mb-4">
          Step-by-step
        </p>
        <div className="flex-1 flex items-center justify-center text-center text-sm text-lab-muted">
          Press <span className="text-lab-primary mx-1">Next</span> to begin the lesson
        </div>
      </aside>
    );
  }

  return (
    <aside className="glass-strong rounded-2xl p-5 h-full animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-lab-muted">
          Explanation
        </p>
        <span className="text-xs font-mono text-lab-primary bg-lab-primary/10 px-2 py-0.5 rounded-full">
          Step {exp.stepNumber} / {exp.totalSteps}
        </span>
      </div>

      <h3 className="text-lg font-semibold mb-4 text-lab-text">{exp.title}</h3>

      <dl className="space-y-4">
        {exp.fields.map((field) => (
          <div key={field.label} className="glass rounded-xl p-3">
            <dt className="text-xs text-lab-muted mb-1">{field.label}</dt>
            <dd
              className={`font-mono text-sm font-medium ${
                field.accent ? accentClass[field.accent] : 'text-lab-text'
              }`}
            >
              {field.value}
            </dd>
          </div>
        ))}
      </dl>

      {exp.meaning && (
        <div className="mt-4 pt-4 border-t border-lab-border">
          <p className="text-xs text-lab-muted mb-1">Meaning</p>
          <p className="text-sm text-lab-muted leading-relaxed">{exp.meaning}</p>
        </div>
      )}

      {exp.formula && (
        <div className="mt-4 glass rounded-xl p-3">
          <p className="text-xs text-lab-muted mb-2">Formula</p>
          <p className="font-mono text-sm text-lab-primary">{exp.formula}</p>
        </div>
      )}
    </aside>
  );
}
