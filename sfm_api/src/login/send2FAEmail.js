import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // your Gmail
    pass: process.env.EMAIL_PASS, // App Password
  },
});

export const send2FAEmail = async (email, token) => {
  await transporter.sendMail({
    from: `"Your App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your 2FA Verification Code",
    text: `Your verification code is ${token}`,
  });
};
