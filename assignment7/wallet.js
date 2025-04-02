class Wallet {
    #value; 
  
    constructor() {
      this.#value = 0;
    }
  
    getBalane() {
      return this.#value;
    }
  
    setBalance(newValue) {
      this.#value = newValue;
    }
  
    creditMoney(deposit) {
      this.#value += deposit;
    }
  
    debitMoney(debit) {
      if (debit <= this.#value) {
        this.#value -= debit;
        return true; 
      }
      return false;
    }
  }
  
  export default Wallet;