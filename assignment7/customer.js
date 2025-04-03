import Wallet from './wallet.js';

class Customer {
  #firstName; // private variables
  #lastName;
  #wallet;

  constructor(firstName, lastName) {
    this.#firstName = firstName;
    this.#lastName = lastName;
    this.#wallet = new Wallet();
  }

  getFirstName() {
    return this.#firstName;
  }

  getLastName() {
    return this.#lastName;
  }

  getWalletBalance() {
    return this.#wallet.getBalane();
  }

  depositMoney(amount) {
    this.#wallet.creditMoney(amount);
  }

  pay(amount) {
    return this.#wallet.debitMoney(amount);
  }
}

export default Customer;