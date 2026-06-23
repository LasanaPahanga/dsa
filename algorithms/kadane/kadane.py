"""Kadane's Algorithm — maximum subarray sum in O(n)."""


def kadane_max_sum(arr: list[int]) -> int:
    """Return maximum sum of any contiguous subarray."""
    if not arr:
        return 0
    current_sum = best_sum = arr[0]
    for i in range(1, len(arr)):
        current_sum = max(arr[i], current_sum + arr[i])
        best_sum = max(best_sum, current_sum)
    return best_sum


def kadane_with_indices(arr: list[int]) -> tuple[int, int, int]:
    """Return (max_sum, start_index, end_index)."""
    if not arr:
        return 0, -1, -1
    current_sum = best_sum = arr[0]
    current_start = 0
    best_start = best_end = 0

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

    return best_sum, best_start, best_end


def brute_max_sum(arr: list[int]) -> int:
    """O(n²) brute force for comparison."""
    if not arr:
        return 0
    best = arr[0]
    for i in range(len(arr)):
        total = 0
        for j in range(i, len(arr)):
            total += arr[j]
            best = max(best, total)
    return best


if __name__ == "__main__":
    arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
    print("array:", arr)
    print("kadane sum:", kadane_max_sum(arr))
    s, lo, hi = kadane_with_indices(arr)
    print(f"best subarray [{lo}, {hi}]:", arr[lo : hi + 1], "sum =", s)
    print("brute force:", brute_max_sum(arr))
