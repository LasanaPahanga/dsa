#include <vector>
#include <algorithm>
#include <iostream>

// O(n) build, O(1) query
std::vector<int> buildPrefix(const std::vector<int>& arr) {
    std::vector<int> prefix(arr.size(), 0);
    if (arr.empty()) return prefix;
    prefix[0] = arr[0];
    for (size_t i = 1; i < arr.size(); ++i) {
        prefix[i] = prefix[i - 1] + arr[i];
    }
    return prefix;
}

int rangeSum(const std::vector<int>& prefix, int left, int right) {
    if (left == 0) return prefix[right];
    return prefix[right] - prefix[left - 1];
}

int maxSubarraySumFixedK(const std::vector<int>& arr, int k) {
    if (k <= 0 || k > static_cast<int>(arr.size())) return 0;
    auto prefix = buildPrefix(arr);
    int best = rangeSum(prefix, 0, k - 1);
    for (int start = 1; start <= static_cast<int>(arr.size()) - k; ++start) {
        best = std::max(best, rangeSum(prefix, start, start + k - 1));
    }
    return best;
}

int main() {
    std::vector<int> arr = {2, 4, 1, 5, 3};
    auto prefix = buildPrefix(arr);
    std::cout << "sum(1, 3): " << rangeSum(prefix, 1, 3) << '\n'; // 10
    return 0;
}
