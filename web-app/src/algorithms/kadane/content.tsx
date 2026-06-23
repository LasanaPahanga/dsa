export const kadaneConcept = (
  <>
    <p>
      <strong>Kadane&apos;s algorithm</strong> finds the maximum sum of a continuous subarray in one
      pass. After prefix sum teaches cumulative totals, Kadane teaches{' '}
      <em>keep the best answer while scanning</em>.
    </p>
    <p className="mt-3">
      At every index:{' '}
      <code className="text-lab-primary">current_sum = max(arr[i], current_sum + arr[i])</code>
    </p>
  </>
);

export const kadaneBruteForce = (
  <>
    <p>
      Check every subarray with nested loops: for each start <code className="text-lab-primary">i</code>,
      extend to every end <code className="text-lab-primary">j</code> and track the maximum sum.
    </p>
    <p className="mt-2 text-lab-muted">
      Time: <strong>O(n²)</strong>. Too slow for large arrays.
    </p>
  </>
);

export const kadaneOptimized = (
  <>
    <p>
      One pass: at each index, decide whether to continue the old subarray or start fresh. Track{' '}
      <code className="text-lab-primary">current_sum</code> and{' '}
      <code className="text-lab-primary">best_sum</code>.
    </p>
    <p className="mt-2 text-lab-muted">
      Time: <strong>O(n)</strong> · Space: <strong>O(1)</strong>
    </p>
  </>
);
