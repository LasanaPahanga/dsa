#include <iostream>
#include <vector>
#include <algorithm>

int kadaneMaxSum(const std::vector<int>& arr) {
    if (arr.empty()) return 0;
    int current = arr[0], best = arr[0];
    for (size_t i = 1; i < arr.size(); ++i) {
        current = std::max(arr[i], current + arr[i]);
        best = std::max(best, current);
    }
    return best;
}

struct KadaneResult {
    int sum;
    int start;
    int end;
};

KadaneResult kadaneWithIndices(const std::vector<int>& arr) {
    if (arr.empty()) return {0, -1, -1};
    int current = arr[0], best = arr[0];
    int currentStart = 0, bestStart = 0, bestEnd = 0;

    for (size_t i = 1; i < arr.size(); ++i) {
        if (current + arr[i] < arr[i]) {
            current = arr[i];
            currentStart = static_cast<int>(i);
        } else {
            current += arr[i];
        }
        if (current > best) {
            best = current;
            bestStart = currentStart;
            bestEnd = static_cast<int>(i);
        }
    }
    return {best, bestStart, bestEnd};
}

int main() {
    std::vector<int> arr = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
    auto result = kadaneWithIndices(arr);
    std::cout << "max sum: " << result.sum << "\n";
    std::cout << "range [" << result.start << ", " << result.end << "]: ";
    for (int i = result.start; i <= result.end; ++i)
        std::cout << arr[i] << " ";
    std::cout << "\n";
    return 0;
}
