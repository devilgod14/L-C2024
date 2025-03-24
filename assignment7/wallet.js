class Wallet {
    #value; 
  
    constructor() {
      this.#value = 0;
    }
  
    getTotalMoney() {
      return this.#value;
    }
  
    setTotalMoney(newValue) {
      this.#value = newValue;
    }
  
    addMoney(deposit) {
      this.#value += deposit;
    }
  
    subtractMoney(debit) {
      if (debit <= this.#value) {
        this.#value -= debit;
        return true; 
      }
      return false;
    }
  }
  
  export default Wallet;