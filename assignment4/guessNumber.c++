#include <iostream>
#include <string>
#include <cctype>
#include <cstdlib>
#include <ctime>
using namespace std;

const int RANGE_START = 1;
const int RANGE_END = 100;

bool isValidNumber(const string &input) {
    if (input.empty())
        return false;
    for (char c : input) {
        if (!isdigit(c))
            return false;
    }
    int number = stoi(input);
    return (number >= RANGE_START && number <= RANGE_END);
}

int getUserGuess() {
    string input;
    while (true) {
        cout << "Guess a number between " << RANGE_START << " and " << RANGE_END << ": ";
        getline(cin, input);
        if (isValidNumber(input))
            return stoi(input);
        cout << "Please enter a valid number.\n";
    }
}

bool checkNumber(int guess, int correctNumber) {
    if (guess < correctNumber) {
        cout << "Too low. ";
        return false;
    }
    if (guess > correctNumber) {
        cout << "Too high. ";
        return false;
    }
    return true;
}

int main() {
    srand(static_cast<unsigned>(time(0)));
    int correctNumber = rand() % (RANGE_END - RANGE_START + 1) + RANGE_START;
    int guessCount = 0;
    bool guessedCorrectly = false;
    while (!guessedCorrectly) {
        int guess = getUserGuess();
        guessCount++;
        guessedCorrectly = checkNumber(guess, correctNumber);
        if (!guessedCorrectly)
            cout << "Guess again.\n";
    }
    cout << "You guessed it in " << guessCount << " guesses!\n";
    return 0;
}
