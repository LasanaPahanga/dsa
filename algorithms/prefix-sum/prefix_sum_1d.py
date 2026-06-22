"""1D Prefix Sum — build and range queries."""


def build_prefix(arr: list[int]) -> list[int]:
    """O(n) time, O(n) space."""
    prefix = [0] * len(arr)
    if not arr:
        return prefix
    prefix[0] = arr[0]
    for i in range(1, len(arr)):
        prefix[i] = prefix[i - 1] + arr[i]
    return prefix


def range_sum(prefix: list[int], left: int, right: int) -> int:
    """O(1) query. Assumes 0 <= left <= right < len(prefix)."""
    if left == 0:
        return prefix[right]
    return prefix[right] - prefix[left - 1]


def max_subarray_sum_fixed_k(arr: list[int], k: int) -> int:
    """Max sum of any contiguous subarray of length k."""
    if k <= 0 or k > len(arr):
        return 0
    prefix = build_prefix(arr)
    best = range_sum(prefix, 0, k - 1)
    for start in range(1, len(arr) - k + 1):
        best = max(best, range_sum(prefix, start, start + k - 1))
    return best


if __name__ == "__main__":
    arr = [2, 4, 1, 5, 3]
    prefix = build_prefix(arr)
    print("arr:   ", arr)
    print("prefix:", prefix)
    print("sum(1, 3):", range_sum(prefix, 1, 3))  # 10
