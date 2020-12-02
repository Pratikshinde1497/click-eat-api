const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function SendMail(options) {

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GmailUser, // generated ethereal user
      pass: process.env.GmailPass, // generated ethereal password
    },
  });

  const mailOptions = {
    from: 'ClickEat@support.com', // sender address
    to: options.sendTo, // list of receivers
    subject: options.subject, // Subject line
    text: options.text, // plain text body
    html: options.html, // html body
  }
  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info.messageId);
}

module.exports = SendMail;