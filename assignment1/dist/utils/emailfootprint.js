export class EmailFootprint {
    constructor(emailId) {
        this.STANDARD_CO2_PER_EMAIL = 0.004;
        this.ATTACHMENT_CO2_PER_EMAIL = 0.05;
        this.SPAM_CO2_PER_EMAIL = 0.0003;
        this.inboxCarbonFootprint = 0;
        this.sentCarbonFootprint = 0;
        this.spamCarbonFootprint = 0;
        this.emailId = emailId;
    }
    calculateInboxCarbonFootprint(inboxStandardEmail, inboxAttachmentEmail) {
        this.inboxCarbonFootprint =
            inboxStandardEmail * this.STANDARD_CO2_PER_EMAIL + inboxAttachmentEmail * this.ATTACHMENT_CO2_PER_EMAIL;
    }
    calculateSentCarbonFootprint(sentStandardEmail, sentAttachmentEmail) {
        this.sentCarbonFootprint =
            sentStandardEmail * this.STANDARD_CO2_PER_EMAIL + sentAttachmentEmail * this.ATTACHMENT_CO2_PER_EMAIL;
    }
    calculateSpamCarbonFootprint(spamEmail) {
        this.spamCarbonFootprint = spamEmail * this.SPAM_CO2_PER_EMAIL;
    }
    displayCarbonFootprint() {
        console.log("Carbon Footprint of Emails in a day");
        console.log(`Inbox: ${this.inboxCarbonFootprint} Kg`);
        console.log(`Sent: ${this.sentCarbonFootprint} Kg`);
        console.log(`Spam: ${this.spamCarbonFootprint} Kg`);
    }
}
