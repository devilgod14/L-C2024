#include <iostream>
#include <vector>

using namespace std;

vector<int> getCommonElements(int arr1[], int size1, int arr2[], int size2, int arr3[], int size3) {
    vector<int> commonElements;
    int index1 = 0, index2 = 0, index3 = 0;

    while (index1 < size1 && index2 < size2 && index3 < size3) {
        if (arr1[index1] == arr2[index2] && arr2[index2] == arr3[index3]) {
            commonElements.push_back(arr1[index1]);
            index1++;
            index2++;
            index3++;
        } 
        else if (arr1[index1] < arr2[index2]) {
            index1++;
        } 
        else if (arr2[index2] < arr3[index3]) {
            index2++;
        } 
        else {
            index3++;
        }
    }

    return commonElements;
}

int main() {
    int arr1[] = {1, 5, 10, 20, 40, 80};
    int arr2[] = {6, 7, 20, 80, 100};
    int arr3[] = {3, 4, 15, 20, 30, 70, 80, 120};

    int size1 = sizeof(arr1) / sizeof(arr1[0]);
    int size2 = sizeof(arr2) / sizeof(arr2[0]);
    int size3 = sizeof(arr3) / sizeof(arr3[0]);

    vector<int> result = getCommonElements(arr1, size1, arr2, size2, arr3, size3);

    cout << "Common elements: ";
    for (int element : result) {
        cout << element << " ";
    }
    cout << endl;

    return 0;
}
