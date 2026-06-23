export const diffArrayConcept = (
  <>
    <p>
      <strong>Difference array</strong> is the opposite of prefix sum. Instead of answering range
      sum queries fast, it applies range <em>updates</em> in O(1).
    </p>
    <p className="mt-3">
      Mark <code className="text-lab-primary">diff[l] += value</code> and{' '}
      <code className="text-lab-primary">diff[r+1] -= value</code>, then rebuild with prefix sum.
    </p>
  </>
);

export const diffArrayBruteForce = (
  <>
    <p>
      For each update, loop from <code className="text-lab-primary">l</code> to{' '}
      <code className="text-lab-primary">r</code> and add the value to every element.
    </p>
    <p className="mt-2 text-lab-muted">
      With <em>Q</em> updates: <strong>O(Q × n)</strong>.
    </p>
  </>
);

export const diffArrayOptimized = (
  <>
    <p>
      Each range update touches only 2 indices on the diff array in <strong>O(1)</strong>.
      Rebuild the final array once in <strong>O(n)</strong> using prefix sum.
    </p>
    <p className="mt-2 text-lab-muted">
      Total: <strong>O(Q + n)</strong> for Q updates plus one rebuild.
    </p>
  </>
);
