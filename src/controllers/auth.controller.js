const jwt = require('jsonwebtoken')
const User = require('../models/user.model');

const { JWT_SECRET_KEY } = require('../configs')

const login = async (request, response) => {
  try {
    const {
      email,
      password
    } = request.body;
  
    const user = await User.findOne({ email })
  
    if (!user) {
      return response.status(404).json({
        message: 'User not found.'
      })
    }
  
    if (!user.comparePassword(password)) {
      return response.status(400).json({
        message: 'Password not correct.'
      })
    }
  
    const token = jwt.sign({
      _id: user._id
    }, JWT_SECRET_KEY)
  
    return response.status(200).json({ token })
  } catch(error) {
    console.log(error);
    return response.status(500).json({ status: 500, message: 'Opps! Something went wrong when call api.' })
  }
}

module.exports = {
  login
}