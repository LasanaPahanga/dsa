import { Link } from 'react-router-dom';
import { getAllAlgorithms } from '@/algorithms/registry';
import { HeroPrefixAnimation } from '@/components/lab/HeroPrefixAnimation';

const difficultyStyle = {
  beginner: 'text-lab-success bg-lab-success/10 border-lab-success/30',
  intermediate: 'text-lab-warning bg-lab-warning/10 border-lab-warning/30',
  advanced: 'text-lab-error bg-lab-error/10 border-lab-error/30',
};

export function HomePage() {
  const algorithms = getAllAlgorithms();
  const firstSlug = algorithms[0]?.slug;

  return (
    <div className="space-y-16 pb-12">
      <section className="text-center pt-8 pb-4">
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs text-lab-muted mb-6">
          <span className="w-2 h-2 rounded-full bg-lab-success animate-pulse" />
          Interactive learning laboratory
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-4">
          Learn DSA{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-lab-primary to-viz-purple">
            Visually
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-lab-muted max-w-2xl mx-auto mb-8">
          Understand algorithms step-by-step. Watch them come alive, not just read code.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {firstSlug ? (
            <Link
              to={`/algorithms/${firstSlug}`}
              className="px-8 py-3 rounded-xl bg-lab-primary text-white font-medium hover:bg-blue-500 transition-all shadow-lg shadow-lab-primary/30 hover:shadow-lab-primary/50 hover:scale-105"
            >
              Start Learning
            </Link>
          ) : (
            <span className="px-8 py-3 rounded-xl glass text-lab-muted">Coming soon</span>
          )}
          {algorithms.length > 0 && (
            <a
              href="#explore"
              className="px-8 py-3 rounded-xl glass font-medium text-lab-text hover:bg-white/10 transition-all"
            >
              Explore Algorithms
            </a>
          )}
        </div>

        <div className="glass-strong rounded-3xl max-w-2xl mx-auto glow-primary">
          <HeroPrefixAnimation />
        </div>
      </section>

      {algorithms.length > 0 && (
        <section id="explore">
          <h2 className="text-xl font-semibold mb-6 text-center">Algorithms</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {algorithms.map((algo) => (
              <Link
                key={algo.id}
                to={`/algorithms/${algo.slug}`}
                className="glass-strong rounded-2xl p-6 hover:border-lab-primary/40 hover:glow-primary transition-all group"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-lg group-hover:text-lab-primary transition-colors">
                    {algo.title}
                  </h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border capitalize shrink-0 ${difficultyStyle[algo.difficulty]}`}
                  >
                    {algo.difficulty}
                  </span>
                </div>
                <p className="text-sm text-lab-muted leading-relaxed">{algo.shortDescription}</p>
                {algo.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {algo.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-full border border-lab-border text-lab-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-2xl mx-auto">
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-semibold mb-4">How the lab works</h3>
          <ol className="space-y-4 text-sm text-lab-muted">
            {[
              'Watch the brute-force approach and see why it is slow',
              'Build the optimized solution step-by-step',
              'Play with range queries in the playground',
              'Study code with live line highlighting',
            ].map((text, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-7 h-7 rounded-lg bg-lab-primary/20 text-lab-primary flex items-center justify-center text-xs font-mono shrink-0">
                  {i + 1}
                </span>
                {text}
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
