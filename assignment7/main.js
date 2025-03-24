import Customer from './customer.js';

const myCustomer = new Customer("Piyush", "Dave");
myCustomer.depositMoney(10.00);

const payment = 5.00;
console.log(`Delivery boy wants $${payment}`);

if (myCustomer.pay(payment)) {
  console.log(`Payment of $${payment} successful.`);
  console.log(`Customer's remaining balance: $${myCustomer.getWalletBalance()}`);
} else {
  console.log("Customer has insufficient funds. Please come back later.");
}