# Kadane's Algorithm — Worked Examples

## Example 1: Classic array

```
arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
```

**Answer:** sum = 6, subarray = `[4, -1, 2, 1]` (indices 3–6)

Key moment at index 3:

```
previous current_sum = -2
continue = -2 + 4 = 2
start new = 4
→ choose 4 (restart)
```

## Example 2: All negative

```
arr = [-5, -2, -8, -1]
```

**Answer:** sum = -1, subarray = `[-1]` (single element at index 3)

Kadane still works: `best_sum` tracks the least bad option.

## Example 3: All positive

```
arr = [2, 3, 1, 4]
```

**Answer:** sum = 10, subarray = entire array

When all values are positive, the best subarray is always the whole array.

## Example 4: Tracking indices

While scanning, also track:

- `current_start` — where the current subarray began
- When `best_sum` improves, save `best_start` and `best_end`

```python
current_sum = arr[0]
best_sum = arr[0]
best_start = best_end = current_start = 0

for i in range(1, len(arr)):
    if current_sum + arr[i] < arr[i]:
        current_sum = arr[i]
        current_start = i
    else:
        current_sum += arr[i]

    if current_sum > best_sum:
        best_sum = current_sum
        best_start = current_start
        best_end = i
```

For Example 1: `best_start = 3`, `best_end = 6`.
