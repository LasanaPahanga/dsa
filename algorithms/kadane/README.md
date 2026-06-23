# Kadane's Algorithm — Maximum Subarray Sum

Kadane's algorithm finds the **maximum sum of a continuous subarray** in one pass.

## Main idea

At each index, ask:

> Is it better to **continue** the previous subarray, or **start fresh** from here?

```
current_sum = max(arr[i], current_sum + arr[i])
best_sum    = max(best_sum, current_sum)
```

## Example

```
arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
```

Best subarray: `[4, -1, 2, 1]` with sum **6**.

| Index | arr[i] | continue | start new | current_sum | best_sum |
|-------|--------|----------|-----------|-------------|----------|
| 0 | -2 | — | — | -2 | -2 |
| 1 | 1 | -1 | 1 | 1 | 1 |
| 2 | -3 | -2 | -3 | -2 | 1 |
| 3 | 4 | 2 | 4 | 4 | 4 |
| 4 | -1 | 3 | -1 | 3 | 4 |
| 5 | 2 | 5 | 2 | 5 | 5 |
| 6 | 1 | 6 | 1 | 6 | **6** |
| 7 | -5 | 1 | -5 | 1 | 6 |
| 8 | 4 | 5 | 4 | 5 | 6 |

At index 3: previous `current_sum` was -2. Continue gives 2, start new gives 4. We restart at 4.

## Complexity

| | Brute force | Kadane |
|---|---|---|
| Time | O(n²) | **O(n)** |
| Space | O(1) | **O(1)** |

## Practice problems

1. [Maximum Subarray (LeetCode 53)](https://leetcode.com/problems/maximum-subarray/)
2. Maximum subarray with start and end index (track indices while scanning)
3. [Maximum Sum Circular Subarray (LeetCode 918)](https://leetcode.com/problems/maximum-sum-circular-subarray/)
4. [Maximum Product Subarray (LeetCode 152)](https://leetcode.com/problems/maximum-product-subarray/)
5. [Maximum Subarray Sum with One Deletion (LeetCode 1186)](https://leetcode.com/problems/maximum-subarray-sum-with-one-deletion/)

See [examples.md](./examples.md) for worked examples.
