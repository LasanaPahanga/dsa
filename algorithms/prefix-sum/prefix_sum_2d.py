"""2D Prefix Sum — build and rectangular region queries."""


def build_prefix_2d(matrix: list[list[int]]) -> list[list[int]]:
    """O(n*m) time and space."""
    if not matrix or not matrix[0]:
        return []
    rows, cols = len(matrix), len(matrix[0])
    prefix = [[0] * cols for _ in range(rows)]

    for i in range(rows):
        for j in range(cols):
            top = prefix[i - 1][j] if i > 0 else 0
            left = prefix[i][j - 1] if j > 0 else 0
            overlap = prefix[i - 1][j - 1] if i > 0 and j > 0 else 0
            prefix[i][j] = matrix[i][j] + top + left - overlap
    return prefix


def region_sum(
    prefix: list[list[int]],
    r1: int,
    c1: int,
    r2: int,
    c2: int,
) -> int:
    """O(1) query for inclusive corners (r1,c1) to (r2,c2)."""
    total = prefix[r2][c2]
    if r1 > 0:
        total -= prefix[r1 - 1][c2]
    if c1 > 0:
        total -= prefix[r2][c1 - 1]
    if r1 > 0 and c1 > 0:
        total += prefix[r1 - 1][c1 - 1]
    return total


if __name__ == "__main__":
    matrix = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
    ]
    prefix = build_prefix_2d(matrix)
    print("region (0,1)-(1,2):", region_sum(prefix, 0, 1, 1, 2))  # 16
