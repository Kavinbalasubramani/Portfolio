require('dotenv').config({ path: __dirname + '/.env' });
const nodemailer = require('nodemailer');

const user = process.env.SMTP_USER?.trim();
const pass = (process.env.SMTP_PASS || '').replace(/\s+/g, '');

console.log('Testing SMTP via port 587 (STARTTLS) with user:', user);

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Port 587 requires STARTTLS (secure: false)
  auth: { user, pass },
  tls: {
    rejectUnauthorized: false
  }
});

const mailOptions = {
  from: `"Kavin B Portfolio" <${user}>`,
  to: process.env.CONTACT_EMAIL?.trim() || user,
  subject: 'Test Notification - Portfolio Contact System (Port 587)',
  text: 'Hello Kavin! Your portfolio email notifications are working perfectly on port 587.',
  html: '<div style="font-family: sans-serif; padding: 20px;"><h2 style="color: #7c3aed;">Portfolio Contact System Active</h2><p>Your portfolio email notifications are working and verified on port 587.</p></div>'
};

transporter.sendMail(mailOptions, (err, info) => {
  if (err) {
    console.error('PORT 587 SEND ERROR:', err.message);
    process.exit(1);
  } else {
    console.log('PORT 587 SEND SUCCESS! MessageId:', info.messageId);
    console.log('Accepted recipients:', info.accepted);
    process.exit(0);
  }
});
