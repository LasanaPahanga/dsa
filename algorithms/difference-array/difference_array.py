"""Difference Array — build, range updates, rebuild."""


def build_diff(arr: list[int]) -> list[int]:
    """O(n) time, O(n) space."""
    if not arr:
        return []
    diff = [0] * len(arr)
    diff[0] = arr[0]
    for i in range(1, len(arr)):
        diff[i] = arr[i] - arr[i - 1]
    return diff


def range_update(diff: list[int], left: int, right: int, value: int) -> None:
    """O(1) range update in-place."""
    diff[left] += value
    if right + 1 < len(diff):
        diff[right + 1] -= value


def rebuild_from_diff(diff: list[int]) -> list[int]:
    """Prefix sum on diff to get final array. O(n)."""
    if not diff:
        return []
    arr = [0] * len(diff)
    arr[0] = diff[0]
    for i in range(1, len(diff)):
        arr[i] = arr[i - 1] + diff[i]
    return arr


def brute_range_update(arr: list[int], left: int, right: int, value: int) -> list[int]:
    """O(n) per update."""
    result = arr[:]
    for i in range(left, right + 1):
        result[i] += value
    return result


if __name__ == "__main__":
    arr = [10, 10, 10, 10, 10]
    diff = build_diff(arr)
    print("diff:", diff)
    range_update(diff, 1, 3, 5)
    print("after update:", diff)
    print("final:", rebuild_from_diff(diff))
