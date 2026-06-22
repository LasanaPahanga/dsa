import { useState } from 'react';
import type { CodeSnippet } from '@/algorithms/types';

type Props = {
  snippets: CodeSnippet[];
};

export function CodePanel({ snippets }: Props) {
  const [active, setActive] = useState(0);
  const snippet = snippets[active];

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="flex overflow-x-auto border-b border-border bg-surface-raised">
        {snippets.map((s, i) => (
          <button
            key={s.label}
            onClick={() => setActive(i)}
            className={`px-4 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
              i === active
                ? 'text-accent border-b-2 border-accent bg-surface'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed bg-surface text-slate-300">
        <code>{snippet.code}</code>
      </pre>
    </div>
  );
}
