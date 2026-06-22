# Prefix Sum — 1D and 2D Range Sum Optimization

Prefix sum lets you answer **many range sum queries in O(1)** after O(n) or O(n·m) preprocessing.

## 1D Prefix Sum

### Concept

`prefix[i]` = sum of elements from index `0` to `i` (inclusive).

```
arr    = [2, 4, 1, 5, 3]
prefix = [2, 6, 7, 12, 15]
```

### Range sum formula

```
sum(l, r) = prefix[r] - prefix[l - 1]    (when l > 0)
sum(0, r) = prefix[r]
```

**Example:** `sum(1, 3)` = `arr[1] + arr[2] + arr[3]` = `4 + 1 + 5` = **10**  
= `prefix[3] - prefix[0]` = `12 - 2` = **10**

### Brute force

Loop from `l` to `r` for every query → **O(n)** per query.

### Optimized

Build prefix array once → **O(n)** preprocess, **O(1)** per query.

### Complexity

| | Time | Space |
|---|---|---|
| Build | O(n) | O(n) |
| Query | O(1) | — |

---

## 2D Prefix Sum

### Concept

For a matrix, `prefix[i][j]` = sum of all cells in the rectangle from `(0,0)` to `(i,j)`.

```
matrix:
1  2  3
4  5  6
7  8  9

prefix:
1   3   6
5  12  21
12 27  45
```

### Build formula

```
prefix[i][j] = matrix[i][j]
             + prefix[i-1][j]
             + prefix[i][j-1]
             - prefix[i-1][j-1]
```

The subtraction removes the overlapping top-left region counted twice.

### Range sum formula

```
sum(r1, c1, r2, c2) =
    prefix[r2][c2]
  - prefix[r1-1][c2]
  - prefix[r2][c1-1]
  + prefix[r1-1][c1-1]
```

### Complexity

| | Time | Space |
|---|---|---|
| Build | O(n·m) | O(n·m) |
| Query | O(1) | — |

---

## Practice Problems

1. Range sum query on an array (LeetCode 303)
2. [Maximum sum of distinct subarrays with length k](https://leetcode.com/problems/maximum-sum-of-distinct-subarrays-with-length-k/description/)
3. Subarray sum equals k (LeetCode 560)
4. Range sum query 2D (LeetCode 304)

See [examples.md](./examples.md) for worked examples.
