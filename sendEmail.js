

//for send mail-------------------------------------

const nodemailer=require('nodemailer')
// const config=require('../config/config')


const password=process.env.PASSWORD;
const adminEmail=process.env.EMAIL;
//const otp =req.session.otp;
//console.log(password);
//console.log(adminEmail);

const sendMail = async (name, email, otp) => {
  try {
    console.log('mnmnmnmnmnmnmnm');
    console.log(email) 
    console.log(password);
console.log(adminEmail);
//console.log(otp)


    const transporter = nodemailer.createTransport({
      host: 'SMTP.gmail.com', // Update with your email provider's SMTP details
      port: 587,
      secure: false,
      requireTLS: true,
      service:'gmail',
      
      auth: {
        user: 'nihalmuhaednihal@gmail.com',
        pass: 'wfge xhpl ejaq tnpw'
        
      }
    });
    const mailOptions = {
      from: 'nihalmuhaednihal@gmail.com',
      to: email,
      subject: 'Email Verification',
      html: `<p>Hi ${name}, please  check your otp for ${otp} to verify your email.</p>`
    };

    transporter.sendMail(mailOptions,  (error, info)=> {
      if (error) {
        console.log(error);
      } else {
        //console.log('qerhbgforgf')
        console.log('Email has been sent:', info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};


module.exports = sendMail;
