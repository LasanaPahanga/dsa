import { useState } from 'react';
import type { CodeSnippet } from '@/algorithms/types';
import { useLabVisualizer } from './LabVisualizerContext';

const LANG_TABS = ['Python', 'C++', 'Java', 'JavaScript'] as const;

type Props = {
  snippets: CodeSnippet[];
};

function mapSnippetToLang(snippets: CodeSnippet[], lang: string): CodeSnippet | undefined {
  const lower = lang.toLowerCase();
  return snippets.find((s) => s.label.toLowerCase().includes(lower));
}

export function LabCodePanel({ snippets }: Props) {
  const lab = useLabVisualizer();
  const [activeLang, setActiveLang] = useState(0);

  const lang = LANG_TABS[activeLang];
  const snippet =
    mapSnippetToLang(snippets, lang) ??
    snippets[lab?.codeTabIndex ?? 0] ??
    snippets[0];

  const lines = snippet?.code.split('\n') ?? [];
  const highlightLine = lab?.highlightedCodeLine;

  return (
    <div className="glass-strong rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between border-b border-lab-border px-4 py-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-lab-muted">Code</p>
        <div className="flex gap-1">
          {LANG_TABS.map((tab, i) => {
            const available = mapSnippetToLang(snippets, tab);
            return (
              <button
                key={tab}
                onClick={() => setActiveLang(i)}
                disabled={!available && tab !== 'Python' && tab !== 'C++'}
                className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                  i === activeLang
                    ? 'bg-lab-primary text-white'
                    : available
                      ? 'text-lab-muted hover:text-lab-text hover:bg-white/5'
                      : 'text-lab-muted/40 cursor-not-allowed'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>
      <pre className="p-4 text-sm font-mono leading-7 bg-lab-bg/50">
        {lines.map((line, i) => (
          <div
            key={i}
            className={`px-2 -mx-2 rounded ${
              highlightLine === i + 1 ? 'code-line-highlight' : ''
            }`}
          >
            <span className="text-lab-muted/50 select-none mr-4 w-6 inline-block text-right">
              {i + 1}
            </span>
            <code className="text-slate-300">{line || ' '}</code>
          </div>
        ))}
      </pre>
    </div>
  );
}
