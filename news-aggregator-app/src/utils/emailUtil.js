const nodemailer = require('nodemailer');

async function setupEmail() {

  let testAccount = await nodemailer.createTestAccount();
  console.log('Ethereal test account created.');
  console.log('------------------------------------');
  console.log('Preview messages sent with this account at:', nodemailer.getTestMessageUrl(null));
  console.log(`User: ${testAccount.user}`);
  console.log(`Pass: ${testAccount.pass}`);
  console.log('------------------------------------');

  let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user, 
      pass: testAccount.pass, 
    },
  });

  return transporter;
}

async function sendEmail({ transporter, to, subject, html }) {
  try {
    let info = await transporter.sendMail({
      from: '"News Aggregator" <noreply@newsaggregator.com>',
      to: to,
      subject: subject,
      html: html,
    });

    console.log('Email sent: %s', info.messageId);
    // Log the URL to preview the sent email
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

module.exports = { setupEmail, sendEmail };