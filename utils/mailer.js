const nodemailer = require("nodemailer");

let transporter, transporter2;

const initializeTransporter = async () => {
  try {
    // Support email
    transporter = nodemailer.createTransport({
      host: "mail.privateemail.com",  
      secure: true,
      port: 465,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS, 
      },
    });

    // Casting email
    transporter2 = nodemailer.createTransport({
      host: "mail.privateemail.com",  
      secure: true,
      port: 465,
      auth: {
        user: process.env.EMAIL2,
        pass: process.env.PASS2, 
      },
    });
  } catch (err) {
    console.log(err);
  }
};

const sendMail = async ({ email: to, subject, html, attachments, transporterNum }) => {
  return await new Promise(async function (resolve, reject) {
    try {
      if(transporterNum === 1) {
        await transporter.verify();

        await transporter.sendMail({
          from: process.env.EMAIL,
          to,
          subject,
          html,
          attachments,
        });
        resolve(true);
      } else {
        await transporter2.verify();

        await transporter2.sendMail({
          from: process.env.EMAIL2,
          to,
          subject,
          html,
          attachments,
        });
        resolve(true);
      }
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { sendMail, initializeTransporter };