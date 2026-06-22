import type { ComplexityInfo } from '@/algorithms/types';

type Props = {
  complexity: ComplexityInfo;
};

export function ComplexityPanel({ complexity }: Props) {
  const rows = [
    { label: 'Build / Preprocess', value: complexity.build },
    { label: 'Query', value: complexity.query },
    { label: 'Space', value: complexity.space },
  ];

  return (
    <div className="rounded-xl border border-border bg-surface-raised overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold">Complexity</h3>
      </div>
      <dl className="divide-y divide-border">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between px-4 py-3 text-sm">
            <dt className="text-slate-400">{row.label}</dt>
            <dd className="font-mono text-accent">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
