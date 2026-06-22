#include <vector>
#include <iostream>

std::vector<std::vector<int>> buildPrefix2D(const std::vector<std::vector<int>>& matrix) {
    if (matrix.empty() || matrix[0].empty()) return {};
    int rows = static_cast<int>(matrix.size());
    int cols = static_cast<int>(matrix[0].size());
    std::vector<std::vector<int>> prefix(rows, std::vector<int>(cols, 0));

    for (int i = 0; i < rows; ++i) {
        for (int j = 0; j < cols; ++j) {
            int top = (i > 0) ? prefix[i - 1][j] : 0;
            int left = (j > 0) ? prefix[i][j - 1] : 0;
            int overlap = (i > 0 && j > 0) ? prefix[i - 1][j - 1] : 0;
            prefix[i][j] = matrix[i][j] + top + left - overlap;
        }
    }
    return prefix;
}

int regionSum(
    const std::vector<std::vector<int>>& prefix,
    int r1, int c1, int r2, int c2
) {
    int total = prefix[r2][c2];
    if (r1 > 0) total -= prefix[r1 - 1][c2];
    if (c1 > 0) total -= prefix[r2][c1 - 1];
    if (r1 > 0 && c1 > 0) total += prefix[r1 - 1][c1 - 1];
    return total;
}

int main() {
    std::vector<std::vector<int>> matrix = {
        {1, 2, 3},
        {4, 5, 6},
        {7, 8, 9},
    };
    auto prefix = buildPrefix2D(matrix);
    std::cout << "region (0,1)-(1,2): " << regionSum(prefix, 0, 1, 1, 2) << '\n';
    return 0;
}
