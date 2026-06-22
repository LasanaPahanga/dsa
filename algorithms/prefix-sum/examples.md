# Worked Examples — Prefix Sum

## 1D: Range Sum Query

**Input:** `arr = [2, 4, 1, 5, 3]`, query `(l=1, r=3)`

1. Build prefix: `[2, 6, 7, 12, 15]`
2. `sum(1, 3) = prefix[3] - prefix[0] = 12 - 2 = 10`

---

## 1D: Max Subarray Sum of Size k=3

**Input:** `arr = [2, 1, 5, 1, 3, 2]`, `k = 3`

| Window | Sum |
|--------|-----|
| [2, 1, 5] | 8 |
| [1, 5, 1] | 7 |
| [5, 1, 3] | **9** ← max |
| [1, 3, 2] | 6 |

---

## 2D: Region Sum

**Matrix:**
```
1  2  3
4  5  6
7  8  9
```

**Prefix matrix:**
```
 1   3   6
 5  12  21
12  27  45
```

**Query:** region `(r1=0, c1=1)` to `(r2=1, c2=2)` → cells `2, 3, 5, 6`

```
sum = prefix[1][2] - prefix[1][0] = 21 - 5 = 16
```

Manual check: `2 + 3 + 5 + 6 = 16` ✓
