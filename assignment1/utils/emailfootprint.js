"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailFootprint = void 0;
var EmailFootprint = /** @class */ (function () {
    function EmailFootprint(emailId) {
        this.STANDARD_CO2_PER_EMAIL = 0.004;
        this.ATTACHMENT_CO2_PER_EMAIL = 0.05;
        this.SPAM_CO2_PER_EMAIL = 0.0003;
        this.inboxCarbonFootprint = 0;
        this.sentCarbonFootprint = 0;
        this.spamCarbonFootprint = 0;
        this.emailId = emailId;
    }
    EmailFootprint.prototype.calculateInboxCarbonFootprint = function (inboxStandardEmail, inboxAttachmentEmail) {
        this.inboxCarbonFootprint =
            inboxStandardEmail * this.STANDARD_CO2_PER_EMAIL + inboxAttachmentEmail * this.ATTACHMENT_CO2_PER_EMAIL;
    };
    EmailFootprint.prototype.calculateSentCarbonFootprint = function (sentStandardEmail, sentAttachmentEmail) {
        this.sentCarbonFootprint =
            sentStandardEmail * this.STANDARD_CO2_PER_EMAIL + sentAttachmentEmail * this.ATTACHMENT_CO2_PER_EMAIL;
    };
    EmailFootprint.prototype.calculateSpamCarbonFootprint = function (spamEmail) {
        this.spamCarbonFootprint = spamEmail * this.SPAM_CO2_PER_EMAIL;
    };
    EmailFootprint.prototype.displayCarbonFootprint = function () {
        console.log("Carbon Footprint of Emails in a day");
        console.log("Inbox: ".concat(this.inboxCarbonFootprint, " Kg"));
        console.log("Sent: ".concat(this.sentCarbonFootprint, " Kg"));
        console.log("Spam: ".concat(this.spamCarbonFootprint, " Kg"));
    };
    return EmailFootprint;
}());
exports.EmailFootprint = EmailFootprint;
