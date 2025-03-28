/* eslint-disable no-console */
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `Auth App <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`📩 Email sent to ${to}`);
  } catch (error) {
    console.error(`❌ Email failed: ${error.message}`);
  }
};

exports.sendActivationEmail = async (email, token) => {
  const activationLink = `http://localhost:5000/api/auth/activate/${token}`;
  const html = `
    <h2>Activate your account</h2>
    <p>Click the link below to activate your account:</p>
    <a href="${activationLink}">${activationLink}</a>
  `;

  await sendEmail(email, 'Activate Your Account', html);
};

exports.sendResetPasswordEmail = async (email, token) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  const html = `
    <h2>Reset your password</h2>
    <p>Click the link below to set a new password:</p>
    <a href="${resetLink}">${resetLink}</a>
  `;

  await sendEmail(email, 'Reset Your Password', html);
};

exports.sendEmailChangeNotification = async (oldEmail, newEmail, token) => {
  const confirmLink = `${process.env.FRONTEND_URL}/confirm-email-change/${token}`;
  const html = `
    <h2>Email Change Confirmation</h2>
    <p>You requested to change your email to <strong>${newEmail}</strong>.</p>
    <p>Click the link below to confirm the change:</p>
    <a href="${confirmLink}">${confirmLink}</a>
  `;

  await sendEmail(oldEmail, 'Confirm Your Email Change', html);
};
