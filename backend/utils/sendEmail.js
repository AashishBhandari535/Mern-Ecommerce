const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config({ path: "./../config/config.env" });

const sendEmail = async (options) => {
  //1)Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  //2)Define the email options
  const mailOptions = {
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  //3)Actually send the mail
  const mailResponse = await transporter.sendMail(mailOptions, (err) => {
    if (err) {
      return console.log(err.message);
    }
    return "message was sent";
  });
  return mailResponse;
};

module.exports = sendEmail;
