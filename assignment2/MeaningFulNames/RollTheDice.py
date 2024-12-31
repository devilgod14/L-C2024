import random
def rollDice(Sides):
    diceResult=random.randint(1, Sides)
    return diceResult


def main():
    diceSides=6
    isRolling=True
    while isRolling:
        userInput=input("Ready to roll? Enter Q to Quit")
        if userInput.lower() !="q":
            rolledResult=rollDice(diceSides)
            print("You have rolled a",rolledResult)
        else:
            isRolling=False