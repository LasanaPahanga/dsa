export const prefixSumConcept = (
  <>
    <p>
      <strong>Prefix sum</strong> stores the running total up to each index. Once built,
      any range sum <code className="text-accent">sum(l, r)</code> is answered instantly
      without looping through the array again.
    </p>
    <p className="mt-3">
      In 2D, each cell stores the sum of the rectangle from the top-left corner to that
      cell, enabling O(1) sub-matrix queries.
    </p>
  </>
);

export const prefixSumBruteForce = (
  <>
    <p>
      For each query, loop from index <code className="text-accent">l</code> to{' '}
      <code className="text-accent">r</code> and add elements.
    </p>
    <p className="mt-2 text-slate-400">
      With <em>q</em> queries on an array of size <em>n</em>: <strong>O(n·q)</strong> total.
    </p>
  </>
);

export const prefixSumOptimized = (
  <>
    <p>
      Build the prefix array once in <strong>O(n)</strong>, then each query is{' '}
      <code className="text-accent">prefix[r] − prefix[l−1]</code> in <strong>O(1)</strong>.
    </p>
    <p className="mt-2 text-slate-400">
      With <em>q</em> queries: <strong>O(n + q)</strong>, a huge win when q is large.
    </p>
  </>
);
