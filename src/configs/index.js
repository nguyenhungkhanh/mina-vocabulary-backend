const dotenv = require('dotenv')

dotenv.config()

const PORT = process.env.PORT
const MONGO_URI = process.env.MONGO_URI
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
const USER_NODEMAILER = process.env.USER_NODEMAILER;
const PASS_NODEMAILER = process.env.PASS_NODEMAILER;

module.exports = {
  PORT,
  MONGO_URI,
  JWT_SECRET_KEY,
  USER_NODEMAILER,
  PASS_NODEMAILER
}