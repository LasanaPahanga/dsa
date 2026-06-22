import type { PracticeProblem } from '@/algorithms/types';

const difficultyStyle = {
  beginner: 'text-lab-success border-lab-success/30 bg-lab-success/10',
  intermediate: 'text-lab-warning border-lab-warning/30 bg-lab-warning/10',
  advanced: 'text-lab-error border-lab-error/30 bg-lab-error/10',
};

const difficultyLabel = {
  beginner: 'Easy',
  intermediate: 'Medium',
  advanced: 'Hard',
};

type Props = {
  problems: PracticeProblem[];
};

export function CompetitiveProblems({ problems }: Props) {
  const grouped = {
    beginner: problems.filter((p) => p.difficulty === 'beginner'),
    intermediate: problems.filter((p) => p.difficulty === 'intermediate'),
    advanced: problems.filter((p) => p.difficulty === 'advanced'),
  };

  return (
    <div className="glass-strong rounded-2xl p-5">
      <h3 className="font-semibold mb-1">Related Problems</h3>
      <p className="text-xs text-lab-muted mb-4">Practice on competitive programming platforms</p>
      <div className="space-y-4">
        {(['beginner', 'intermediate', 'advanced'] as const).map((diff) => {
          const items = grouped[diff];
          if (items.length === 0) return null;
          return (
            <div key={diff}>
              <p
                className={`text-xs font-semibold uppercase tracking-wider mb-2 px-2 py-0.5 inline-block rounded border ${difficultyStyle[diff]}`}
              >
                {difficultyLabel[diff]}
              </p>
              <ul className="space-y-2">
                {items.map((p) => (
                  <li key={p.title}>
                    {p.link ? (
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-lab-muted hover:text-lab-primary transition-colors group"
                      >
                        <span className="text-lab-success opacity-0 group-hover:opacity-100">✓</span>
                        {p.title}
                        <span className="text-xs opacity-50">↗</span>
                      </a>
                    ) : (
                      <span className="text-sm text-lab-muted">{p.title}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
