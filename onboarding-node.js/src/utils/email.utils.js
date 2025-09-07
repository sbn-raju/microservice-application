const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

//Creating the Configuration of the mailer.
const config = {
  secure: true,
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
};

//Creating the transporter using the nodemailer.
const transporter = nodemailer.createTransport(config);

//Authentication Mail.
module.exports.verifyEmailSender = async (email, subject, context) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: subject,
      text: context,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(info);

    console.log("Email sent successfully:", info.response);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
