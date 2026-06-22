import { useEffect, useState } from 'react';

const ARR = [1, 2, 3, 4, 5];
const PREFIX = [1, 3, 6, 10, 15];

export function HeroPrefixAnimation() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % (ARR.length + 2)), 1200);
    return () => clearInterval(id);
  }, []);

  const filled = Math.min(step, ARR.length);

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <div className="flex items-center gap-3">
        {ARR.map((v, i) => (
          <div
            key={i}
            className={`w-14 h-14 rounded-xl border font-mono font-semibold flex items-center justify-center transition-all duration-500 ${
              i < filled
                ? 'glass border-lab-primary/50 text-lab-text animate-pulse-glow'
                : 'border-lab-border text-lab-muted bg-lab-card/30'
            }`}
          >
            {v}
          </div>
        ))}
      </div>

      <div className="text-lab-primary text-2xl animate-float">↓</div>

      <div className="flex items-center gap-3">
        {PREFIX.map((v, i) => (
          <div
            key={i}
            className={`w-14 h-14 rounded-xl border font-mono font-semibold flex items-center justify-center transition-all duration-500 ${
              i < filled
                ? 'border-lab-success/50 bg-lab-success/15 text-lab-success scale-105'
                : 'border-lab-border text-lab-muted/40 bg-lab-card/20'
            }`}
          >
            {i < filled ? v : '·'}
          </div>
        ))}
      </div>

      <p className="text-sm text-lab-muted">Prefix sum building live…</p>
    </div>
  );
}
