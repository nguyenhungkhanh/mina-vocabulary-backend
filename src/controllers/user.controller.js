const User = require('../models/user.model')

const createUser = async (request, response) => {
  try {
    const { email, password } = request.body

    const isExist = await User.findOne({ email });

    if (isExist) {
      return response.status(400).json({ status: 400, message: 'User was existed.' })
    }

    const newUser = new User({ email, password });
    await newUser.save()
  
    return response.status(200).json({ status: 200 })
  } catch (error) {
    console.log(error)
    return response.status(500).json({ status: 500, message: 'Opps! Something wrong went call api.' })
  }
}

const getUsers = async (request, response) => {
  try {
    const users = await User.find();

    return response.status(200).json({ data: users })
  } catch(error) {
    return response.status(500).json({ error })
  }
}

module.exports = {
  createUser,
  getUsers
}