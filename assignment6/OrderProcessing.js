// User Class
class User {
    constructor(name, email) {
      this.name = name;
      this.email = email;
    }
  
    showInfo() {
      console.log(`User Name: ${this.name} Email: ${this.email}`);
    }
  
    getName() {
      return this.name;
    }
  
    getEmail() {
      return this.email;
    }
  }
  
  // OrderProcessing Class
  class OrderProcessing {
    constructor() {
      this.orders = [];
      this.BULK_DISCOUNT_THRESHOLD = 5;
      this.BULK_DISCOUNT_RATE = 0.85;
      this.LARGE_ORDER_THRESHOLD = 10;
    }
  
    orderDetails(user, item, quantity, price) {
      let total = quantity * price;
      if (quantity > this.BULK_DISCOUNT_THRESHOLD) {
        total *= this.BULK_DISCOUNT_RATE;
      }
  
      this.orders.push(`Item: ${item}, Qty: ${quantity}, Total: ${total}`);
  
      console.log("Order Placed!");
      console.log(`User: ${user.getName()}, Item: ${item}, Quantity: ${quantity}, Total: ${total}`);
  
      if (quantity > this.LARGE_ORDER_THRESHOLD) {
        console.log("Bulk Order Alert!");
      }
  
      this.sendEmail(user.getEmail(), `Order placed for ${item} with total cost ${total}`);
    }
  
    sendEmail(email, message) {
      console.log(`Sending email to: ${email} Message: ${message}`);
    }
  }
  
  // PaymentProcessing Class
  class PaymentProcessing {
    constructor() {
      this.HIGH_VALUE_TRANSACTION_THRESHOLD = 1000.0;
    }
  
    makePayment(cardType, amount, cardNumber, cardExpiry) {
      if (cardType === "Credit") {
        console.log(`Processing Credit Card payment of $${amount}`);
      } else if (cardType === "Debit") {
        console.log(`Processing Debit Card payment of $${amount}`);
      } else {
        console.log("Unknown Payment Method");
      }
  
      if (amount > this.HIGH_VALUE_TRANSACTION_THRESHOLD) {
        console.log("High-value transaction alert!");
      }
  
      console.log(`Payment Done for ${cardNumber} (Card Ending: ${cardExpiry.substring(cardExpiry.length - 4)})`);
    }
  }
  
  // MainApp
  class MainApp {
    static main() {
      const user = new User("John", "john@example.com");
      const orderProcessor = new OrderProcessing();
      orderProcessor.orderDetails(user, "Laptop", 3, 700);
    }
  }
  
  MainApp.main();