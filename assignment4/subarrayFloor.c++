#include <iostream>
#include <vector>
using namespace std;

vector<long long> computePrefixSums(const vector<long long>& elements) {
    vector<long long> prefixSums(elements.size() + 1, 0);
    for (size_t i = 0; i < elements.size(); i++) {
        prefixSums[i + 1] = prefixSums[i] + elements[i];
    }
    return prefixSums;
}

int main() {
    int numElements, numQueries;
    cin >> numElements >> numQueries;
    vector<long long> elements(numElements);
    for (int i = 0; i < numElements; i++) {
        cin >> elements[i];
    }
    vector<long long> prefixSums = computePrefixSums(elements);
    for (int i = 0; i < numQueries; i++) {
        int leftIndex, rightIndex;
        cin >> leftIndex >> rightIndex;
        long long subarraySum = prefixSums[rightIndex] - prefixSums[leftIndex - 1];
        int subarrayLength = rightIndex - leftIndex + 1;
        cout << (subarraySum / subarrayLength) << "\n";
    }
    return 0;
}
