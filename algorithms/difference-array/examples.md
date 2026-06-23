# Difference Array — Worked Examples

## Example 1: Single range update

**Input:** `arr = [10, 10, 10, 10, 10]`, add `+5` from index `1` to `3`

### Build diff

```
diff = [10, 0, 0, 0, 0]
```

### Apply update

```
diff[1] += 5  →  [10, 5, 0, 0, 0]
diff[4] -= 5  →  [10, 5, 0, 0, -5]
```

### Rebuild (prefix sum on diff)

```
final = [10, 15, 15, 15, 10]
```

---

## Example 2: Multiple range updates

**Input:** `arr = [0, 0, 0, 0, 0]`

| # | l | r | value |
|---|---|---|-------|
| 1 | 0 | 2 | +3 |
| 2 | 1 | 4 | +2 |
| 3 | 3 | 4 | -1 |

### After each update on diff

```
Start:     [0, 0, 0, 0, 0]
Update 1:  [3, 0, 0, -3, 0]
Update 2:  [3, 2, 0, -3, 0]
Update 3:  [3, 2, 0, -4, 0]
```

### Rebuild

```
final = [3, 5, 5, 1, 1]
```

Manual check: indices 0–2 get +3, indices 1–4 get +2, indices 3–4 get -1.
