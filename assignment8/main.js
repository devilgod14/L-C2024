import ATM from "./ATM.js";

const atm = new ATM();

function performWithdrawal(pin, amount) {
    try {
        atm.verifyPin(pin);
        const result = atm.withdrawCash(amount);
        console.log(result.message);
        console.log(`Remaining Account Balance: ₹${result.remainingBalance}`);
        console.log(`Remaining ATM Cash: ₹${result.remainingATMCash}`);
        console.log(`Today's Withdrawal: ₹${result.todayWithdrawal}`);
    } catch (error) {
        console.error(`Withdrawal failed: ${error.message}`);
    }
    console.log("--------------------");
}

console.log("Initial ATM Cash:", atm.totalCash);
console.log("Initial Account Balance:", atm.accountBalance);
console.log("--------------------");

performWithdrawal("1234", 2000);
performWithdrawal("1234", 3000); // Attempting to exceed daily limit
performWithdrawal("1111", 1000); // Invalid PIN attempt 1
performWithdrawal("2222", 1000); // Invalid PIN attempt 2
performWithdrawal("3333", 1000); // Invalid PIN attempt 3 - Card should be blocked
performWithdrawal("1234", 1000); // Attempt with blocked card

// Simulate insufficient cash in ATM
atm.totalCash = 500;
performWithdrawal("1234", 1000);

// Simulate insufficient funds in account
atm.accountBalance = 300;
performWithdrawal("1234", 500);

// Simulate server disconnection
atm.simulateServerDisconnect();
performWithdrawal("1234", 1000);
atm.simulateServerConnect();
performWithdrawal("1234", 500);

// Simulate a new day
atm.resetDailyLimit();
performWithdrawal("1234", 1000);

console.log("Final ATM Cash:", atm.totalCash);
console.log("Final Account Balance:", atm.accountBalance);