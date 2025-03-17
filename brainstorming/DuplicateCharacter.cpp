#include <iostream>
#include <unordered_map>

using namespace std;

void findDuplicateCharacters(string str) {
    unordered_map<char, int> charCount;

    for (char ch : str) {
        charCount[ch]++;
    }

    cout << "Duplicate characters in \"" << str << "\":" << endl;
    
    for (auto pair : charCount) {
        if (pair.second > 1) {
            cout << pair.first << " - " << pair.second << " times" << endl;
        }
    }
}

int main() {
    string input;
    cout << "Enter a string: ";
    cin >> input;

    findDuplicateCharacters(input);

    return 0;
}
