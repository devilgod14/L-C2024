def calculateArmstrongSum(number):

    # Initializing the sum and the number of digits
    armstrongSum = 0
    digitCount = 0

    # Calculating the number of individual digits
    tempNumber = number
    while tempNumber > 0:
        digitCount += 1
        tempNumber //= 10

    # Finding the Armstrong sum
    tempNumber = number
    while tempNumber > 0:
        remainder = tempNumber % 10
        armstrongSum += (remainder ** digitCount)
        tempNumber //= 10

    return armstrongSum

# End of function

# User Input
userNumber = int(input("\nPlease enter the number to check for Armstrong: "))

if userNumber == calculateArmstrongSum(userNumber):
    print("\n%d is an Armstrong number.\n" % userNumber)
else:
    print("\n%d is not an Armstrong number.\n" % userNumber)
