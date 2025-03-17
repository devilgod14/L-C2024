#include <iostream>
#include <vector>

using namespace std;

int findSmallestMissingPositive(int arr[], int size) {

    int shift = 0;
    for (int i = 0; i < size; i++) {
        if (arr[i] <= 0) {
            swap(arr[i], arr[shift]);
            shift++;
        }
    }


    int newSize = size - shift;
    int* positivePart = arr + shift;


    for (int i = 0; i < newSize; i++) {
        int value = abs(positivePart[i]);
        if (value > 0 && value <= newSize) {
            positivePart[value - 1] = -abs(positivePart[value - 1]);
        }
    }


    for (int i = 0; i < newSize; i++) {
        if (positivePart[i] > 0) {
            return i + 1;
        }
    }

    return newSize + 1;
}

int main() {
    int arr1[] = {2, 3, 7, 6, 8, -1, -10, 15};
    int arr2[] = {2, 3, -7, 6, 8, 1, -10, 15};
    int arr3[] = {1, 1, 0, -1, -2};

    cout << "Smallest missing positive number: " << findSmallestMissingPositive(arr1, sizeof(arr1) / sizeof(arr1[0])) << endl;
    cout << "Smallest missing positive number: " << findSmallestMissingPositive(arr2, sizeof(arr2) / sizeof(arr2[0])) << endl;
    cout << "Smallest missing positive number: " << findSmallestMissingPositive(arr3, sizeof(arr3) / sizeof(arr3[0])) << endl;

    return 0;
}
