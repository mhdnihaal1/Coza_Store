const nodemailer = require('nodemailer');
// const config = require('../config/config');

const password = process.env.PASSWORD;
const adminEmail = process.env.EMAIL;

const sendEmailresetpassword = async (email, otp) => {
  try {
    console.log('mnmnmnmnmnmnmnm');
    console.log(email);

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'nihalmuhaednihal@gmail.com',
        pass: 'stnatdxfmriapugy', // Update with your Gmail app password
      },
    });

    const mailOptions = {
      from: 'nihalmuhaednihal@gmail.com',
      to: email,
      subject: 'Email Verification',
      html: `<p> please check your otp for ${otp} to verify your email.</p>`,
    };

    // Use sendMail instead of sendEmailresetpassword
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email has been sent:', info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = sendEmailresetpassword;
