import type { PracticeProblem } from '@/algorithms/types';

const difficultyColor = {
  beginner: 'text-success bg-success/10 border-success/30',
  intermediate: 'text-warning bg-warning/10 border-warning/30',
  advanced: 'text-red-400 bg-red-400/10 border-red-400/30',
};

type Props = {
  problems: PracticeProblem[];
};

export function PracticeProblems({ problems }: Props) {
  return (
    <div className="space-y-3">
      {problems.map((p) => (
        <div
          key={p.title}
          className="rounded-lg border border-border bg-surface-raised p-4 flex flex-col sm:flex-row sm:items-center gap-3"
        >
          <div className="flex-1">
            {p.link ? (
              <a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:text-accent transition-colors"
              >
                {p.title} ↗
              </a>
            ) : (
              <p className="font-medium">{p.title}</p>
            )}
            <p className="text-sm text-slate-400 mt-1">{p.description}</p>
          </div>
          <span
            className={`self-start text-xs px-2 py-1 rounded-full border capitalize ${difficultyColor[p.difficulty]}`}
          >
            {p.difficulty}
          </span>
        </div>
      ))}
    </div>
  );
}
