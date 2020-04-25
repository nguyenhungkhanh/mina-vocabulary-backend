const nodeMailer = require('nodemailer');
const { USER_NODEMAILER, PASS_NODEMAILER } = require('../configs');

const sendMail = (to, subject, html) => {
  const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
      user: USER_NODEMAILER,
      pass: PASS_NODEMAILER
    }
  })
  const options = {
    to,
    subject,
    html
  }

  return transporter.sendMail(options)
}

module.exports = {
  sendMail
}