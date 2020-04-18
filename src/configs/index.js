const dotenv = require('dotenv')

dotenv.config()

const PORT = process.env.PORT
const MONGO_URI = process.env.MONGO_URI
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

module.exports = {
  PORT,
  MONGO_URI,
  JWT_SECRET_KEY
}