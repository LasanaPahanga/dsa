#include <vector>
#include <iostream>

std::vector<int> buildDiff(const std::vector<int>& arr) {
    std::vector<int> diff(arr.size(), 0);
    if (arr.empty()) return diff;
    diff[0] = arr[0];
    for (size_t i = 1; i < arr.size(); ++i)
        diff[i] = arr[i] - arr[i - 1];
    return diff;
}

void rangeUpdate(std::vector<int>& diff, int left, int right, int value) {
    diff[left] += value;
    if (right + 1 < static_cast<int>(diff.size()))
        diff[right + 1] -= value;
}

std::vector<int> rebuildFromDiff(const std::vector<int>& diff) {
    std::vector<int> arr(diff.size(), 0);
    if (diff.empty()) return arr;
    arr[0] = diff[0];
    for (size_t i = 1; i < diff.size(); ++i)
        arr[i] = arr[i - 1] + diff[i];
    return arr;
}

int main() {
    std::vector<int> arr = {10, 10, 10, 10, 10};
    auto diff = buildDiff(arr);
    rangeUpdate(diff, 1, 3, 5);
    auto final = rebuildFromDiff(diff);
    for (int v : final) std::cout << v << ' ';
    std::cout << '\n'; // 10 15 15 15 10
    return 0;
}
