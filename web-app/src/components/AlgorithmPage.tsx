import { useState } from 'react';
import type { AlgorithmModule } from '@/algorithms/types';
import { CodePanel } from './CodePanel';
import { ComplexityPanel } from './ComplexityPanel';
import { PracticeProblems } from './PracticeProblems';

const difficultyBadge = {
  beginner: 'bg-success/15 text-success',
  intermediate: 'bg-warning/15 text-warning',
  advanced: 'bg-red-400/15 text-red-400',
};

type Props = {
  algorithm: AlgorithmModule;
};

export function AlgorithmPage({ algorithm }: Props) {
  const [activeSection, setActiveSection] = useState(0);
  const SectionComponent = algorithm.sections[activeSection]?.component;

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${difficultyBadge[algorithm.difficulty]}`}
          >
            {algorithm.difficulty}
          </span>
          {algorithm.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full border border-border text-slate-400"
            >
              {tag}
            </span>
          ))}
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{algorithm.title}</h1>
        <p className="text-lg text-slate-400 max-w-2xl">{algorithm.shortDescription}</p>
      </header>

      <section className="grid md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-border bg-surface-raised p-5">
          <h2 className="text-sm font-semibold text-accent mb-3">Concept</h2>
          <div className="text-sm text-slate-300 leading-relaxed">{algorithm.concept}</div>
        </div>
        <div className="rounded-xl border border-border bg-surface-raised p-5">
          <h2 className="text-sm font-semibold text-red-400 mb-3">Brute force</h2>
          <div className="text-sm text-slate-300 leading-relaxed">{algorithm.bruteForce}</div>
        </div>
        <div className="rounded-xl border border-border bg-surface-raised p-5">
          <h2 className="text-sm font-semibold text-success mb-3">Optimized</h2>
          <div className="text-sm text-slate-300 leading-relaxed">{algorithm.optimized}</div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Interactive visualization</h2>
          {algorithm.sections.length > 1 && (
            <div className="flex gap-1 rounded-lg border border-border p-1 bg-surface-raised">
              {algorithm.sections.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(i)}
                  className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                    i === activeSection
                      ? 'bg-accent text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="rounded-xl border border-border bg-surface-raised p-6">
          {SectionComponent && <SectionComponent />}
        </div>
      </section>

      <section className="grid lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Code</h2>
          <CodePanel snippets={algorithm.codeSnippets} />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Complexity</h2>
          <ComplexityPanel complexity={algorithm.complexity} />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Practice problems</h2>
        <PracticeProblems problems={algorithm.practiceProblems} />
      </section>
    </div>
  );
}
