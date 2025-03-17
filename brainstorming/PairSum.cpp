#include <iostream>
#include <unordered_set>

using namespace std;

void findPair(int nums[], int size, int target) {
    unordered_set<int> seen; 

    for (int i = 0; i < size; i++) {
        int complement = target - nums[i]; 
            
        if (seen.find(complement) != seen.end()) {
            cout << "Pair found (" << nums[i] << ", " << complement << ")" << endl;
            return;
        }
        
        seen.insert(nums[i]);
    }
    
    cout << "No pair found" << endl;
}

int main() {
    int nums[] = {8, 7, 2, 5, 3, 1};
    int target = 10;
    int size = sizeof(nums) / sizeof(nums[0]);

    findPair(nums, size, target);

    return 0;
}
