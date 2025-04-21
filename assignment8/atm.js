class ATM {
    constructor(totalCash = 10000, dailyWithdrawalLimit = 5000) {
        this.totalCash = totalCash;
        this.dailyWithdrawalLimit = dailyWithdrawalLimit;
        this.accountBalance = 5000; // Simulating user's account balance
        this.pin = "1234"; // Simulating user's PIN
        this.invalidPinAttempts = 0;
        this.isCardBlocked = false;
        this.todayWithdrawal = 0;
        this.isServerConnected = true; // Simulating server connection status
    }

    checkServerConnection() {
        if (!this.isServerConnected) {
            throw new Error("Unable to connect with server. Please try again later.");
        }
    }

    verifyPin(enteredPin) {
        this.checkServerConnection();
        if (this.isCardBlocked) {
            throw new Error("Your card is blocked. Please contact your bank.");
        }
        if (enteredPin !== this.pin) {
            this.invalidPinAttempts++;
            if (this.invalidPinAttempts >= 3) {
                this.isCardBlocked = true;
                throw new Error("Your card has been blocked after 3 invalid PIN attempts. Please contact your bank.");
            }
            throw new Error(`Incorrect PIN. You have ${3 - this.invalidPinAttempts} attempts remaining.`);
        }
        this.invalidPinAttempts = 0; // Reset attempts on successful PIN
        return true;
    }

    withdrawCash(amount) {
        this.checkServerConnection();
        if (this.isCardBlocked) {
            throw new Error("Your card is blocked. Please contact your bank.");
        }

        if (amount <= 0) {
            throw new Error("Withdrawal amount must be greater than zero.");
        }

        if (amount % 100 !== 0) {
            throw new Error("Withdrawal amount must be a multiple of 100.");
        }

        if (amount > this.dailyWithdrawalLimit - this.todayWithdrawal) {
            throw new Error(`Daily withdrawal limit exceeded. You can withdraw a maximum of ${this.dailyWithdrawalLimit - this.todayWithdrawal} more today.`);
        }

        if (amount > this.accountBalance) {
            throw new Error("Insufficient funds in your account.");
        }

        if (amount > this.totalCash) {
            throw new Error("Insufficient cash available in the ATM machine.");
        }

        this.accountBalance -= amount;
        this.totalCash -= amount;
        this.todayWithdrawal += amount;
        return {
            message: `Successfully withdrew ₹${amount}.`,
            remainingBalance: this.accountBalance,
            remainingATMCash: this.totalCash,
            todayWithdrawal: this.todayWithdrawal
        };
    }

    // Simulate a new day resetting the daily withdrawal limit
    resetDailyLimit() {
        this.todayWithdrawal = 0;
        this.isCardBlocked = false;
        this.invalidPinAttempts = 0;
        console.log("Daily withdrawal limit reset. Card unblocked.");
    }

    // Simulate server disconnection
    simulateServerDisconnect() {
        this.isServerConnected = false;
        console.log("Simulating server disconnection.");
    }

    // Simulate server connection
    simulateServerConnect() {
        this.isServerConnected = true;
        console.log("Simulating server connection.");
    }
}

export default ATM;