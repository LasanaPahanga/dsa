# Difference Array — Fast Range Updates

Difference array is the **inverse idea** of prefix sum:

| Technique | Optimizes |
|-----------|-----------|
| Prefix Sum | Range **queries** (read) |
| Difference Array | Range **updates** (write) |

## Main idea

Instead of adding `value` to every index from `l` to `r`, mark only two spots on the difference array:

```
diff[l] += value
diff[r + 1] -= value   (if r + 1 < n)
```

Then rebuild the final array with a **prefix sum** on `diff`.

## Build difference array

```
diff[0] = arr[0]
diff[i] = arr[i] - arr[i - 1]
```

**Example:** `arr = [10, 10, 10, 10, 10]` → `diff = [10, 0, 0, 0, 0]`

## Range update

Add `+5` from index `1` to `3`:

```
diff[1] += 5   →  start adding +5 here
diff[4] -= 5   →  stop after index 3
```

`diff = [10, 5, 0, 0, -5]`

## Rebuild final array

```
arr[0] = diff[0]
arr[i] = arr[i - 1] + diff[i]
```

| Step | Calculation | Result |
|------|-------------|--------|
| 0 | 10 | 10 |
| 1 | 10 + 5 | 15 |
| 2 | 15 + 0 | 15 |
| 3 | 15 + 0 | 15 |
| 4 | 15 + (-5) | 10 |

**Final:** `[10, 15, 15, 15, 10]`

Key insight: **+5 starts at index 1. -5 at index 4 cancels the effect after index 3.**

## Complexity

| | Brute force | Difference array |
|---|---|---|
| One range update | O(n) | O(1) |
| Q updates | O(Q × n) | O(Q) |
| Rebuild final array | — | O(n) |
| **Total (Q updates + rebuild)** | **O(Q × n)** | **O(Q + n)** |

## Practice problems

1. [Corporate Flight Bookings (LeetCode 1109)](https://leetcode.com/problems/corporate-flight-bookings/)
2. [Maximum Population Year (LeetCode 1854)](https://leetcode.com/problems/maximum-population-year/)
3. Range addition on an array (classic)

See [examples.md](./examples.md) for worked examples.
