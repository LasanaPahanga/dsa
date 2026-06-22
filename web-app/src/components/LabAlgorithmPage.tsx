import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { AlgorithmModule } from '@/algorithms/types';
import { LabVisualizerProvider } from '@/components/lab/LabVisualizerContext';
import { LabSidebar } from '@/components/lab/LabSidebar';
import { ExplanationPanel } from '@/components/lab/ExplanationPanel';
import { LabCodePanel } from '@/components/lab/LabCodePanel';
import { CompetitiveProblems } from '@/components/lab/CompetitiveProblems';

type Props = {
  algorithm: AlgorithmModule;
};

export function LabAlgorithmPage({ algorithm }: Props) {
  const [activeSection, setActiveSection] = useState(0);
  const SectionComponent = algorithm.sections[activeSection]?.component;

  return (
    <LabVisualizerProvider>
      <div className="space-y-4 animate-slide-up">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link
              to="/"
              className="text-xs text-lab-muted hover:text-lab-primary transition-colors mb-2 inline-block"
            >
              ← DSA Visual Lab
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">{algorithm.title}</h1>
            <p className="text-sm text-lab-muted mt-1 max-w-xl">{algorithm.shortDescription}</p>
          </div>
          {algorithm.sections.length > 1 && (
            <div className="flex gap-1 glass rounded-xl p-1">
              {algorithm.sections.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(i)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    i === activeSection
                      ? 'bg-lab-primary text-white shadow-lg shadow-lab-primary/25'
                      : 'text-lab-muted hover:text-lab-text'
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[520px]">
          <div className="lg:col-span-2 hidden lg:block">
            <LabSidebar />
          </div>

          <div className="lg:col-span-7 glass-strong rounded-2xl p-5 glow-primary">
            <p className="text-xs font-semibold uppercase tracking-wider text-lab-muted mb-4">
              Visualization
            </p>
            {SectionComponent && <SectionComponent />}
          </div>

          <div className="lg:col-span-3 min-h-[320px]">
            <ExplanationPanel />
          </div>
        </div>

        <LabCodePanel snippets={algorithm.codeSnippets} />

        <CompetitiveProblems problems={algorithm.practiceProblems} />
      </div>
    </LabVisualizerProvider>
  );
}
