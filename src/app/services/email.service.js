// services/email.service.js
const nodemailer = require('nodemailer');

// Configure transporter (use Gmail for testing; switch to SendGrid/Mailgun in production)
const transporter = nodemailer.createTransport({
  service: 'gmail', // Or your SMTP host
  auth: {
    user: 'yourauctionemail@gmail.com',  // Replace with a real email
    pass: 'your-app-password-here'       
  }
});

async function sendEmail(to, subject, text, html = '') {
  const mailOptions = {
    from: '"Atlantic Auctions" <yourauctionemail@gmail.com>',
    to,
    subject,
    text,
    html: html || text.replace(/\n/g, '<br>')
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}: ${subject}`);
  } catch (error) {
    console.error('Email error:', error);
  }
}

module.exports = { sendEmail };
