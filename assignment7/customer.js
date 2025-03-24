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
    return this.#wallet.getTotalMoney();
  }

  depositMoney(amount) {
    this.#wallet.addMoney(amount);
  }

  pay(amount) {
    return this.#wallet.subtractMoney(amount);
  }
}

export default Customer;