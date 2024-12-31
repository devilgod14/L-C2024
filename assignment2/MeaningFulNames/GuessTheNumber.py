import random

def isValidGuess(guess):
    return guess.isdigit() and 1 <= int(guess) <= 100

def main():
    targetNumber = random.randint(1, 100)
    isCorrectGuess = False
    guessCount = 0
    
    Userguess = input("Guess a number between 1 and 100: ")
    
    while not isCorrectGuess:
        if not isValidGuess(Userguess):
            Userguess = input("Invalid input! Please enter a number between 1 and 100: ")
            continue
        
        guessCount += 1
        Userguess = int(Userguess)
        
        if Userguess < targetNumber:
            Userguess = input("Too low. Guess again: ")
        elif Userguess > targetNumber:
            Userguess = input("Too high. Guess again: ")
        else:
            print(f"Congratulations! You guessed the number in {guessCount} attempts!")
            isCorrectGuess = True
            
    main()
