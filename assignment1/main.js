"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var emailfootprint_1 = require("./utils/emailfootprint");
var emailId = prompt("Enter email id: ");
if (emailId !== null) {
    var inboxStandardEmail = parseInt(prompt("Enter number of standard emails received: ") || '0');
    var inboxAttachmentEmail = parseInt(prompt("Enter number of attachment emails received: ") || '0');
    var sentStandardEmail = parseInt(prompt("Enter number of standard emails sent: ") || '0');
    var sentAttachmentEmail = parseInt(prompt("Enter number of attachment emails sent: ") || '0');
    var spamEmail = parseInt(prompt("Enter number of spam emails: ") || '0');
    var emailFootprint = new emailfootprint_1.EmailFootprint(emailId);
    emailFootprint.calculateInboxCarbonFootprint(inboxStandardEmail, inboxAttachmentEmail);
    emailFootprint.calculateSentCarbonFootprint(sentStandardEmail, sentAttachmentEmail);
    emailFootprint.calculateSpamCarbonFootprint(spamEmail);
    emailFootprint.displayCarbonFootprint();
}
else {
    console.log("Invalid email address entered.");
}
