const jwt = require('jsonwebtoken')
const User = require('../models/user.model');
const { sendMail } = require('../utils/mailer');

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

const resetPassword = async (request, response) => {
  try {
    const { email } = request.body;
    const userExisted = await User.findOne({ email })

    if (!userExisted) {
      return response.status(404).json({ status: 404, message: 'Not found' })
    }

    const to = email;
    const subject = '[Từ vựng Minna no Nihongo] Khôi phục mật khẩu';
    const password = Math.floor(new Date().getTime()/1000).toString();

    const html = `
      <p>Mật khẩu mới của bạn là: <b>${password}</b></p>
      <p>Từ vựng Minna no Nihongo xin cảm ơn bạn đã sử dụng ứng dụng. Chúc bạn 1 ngày làm việc, học tập hiệu quả!</p>
    `;

    userExisted.password = password;

    await userExisted.save()

    await sendMail(to, subject, html);

    return response.status(200).json({ status: 200 })
  } catch (error) {
    console.log(error);
    return response.status(500).json({ status: 500, message: 'Opps! Something went wrong when call api.' })
  }
};

const updatePassword = async (request, response) => {
  try {
    const { _id } = request.decoded;
    const { old_password, new_password } = request.body;

    const userExisted = await User.findById(_id)

    if (!userExisted) {
      return response.status(404).json({
        message: 'User not found.'
      })
    }
  
    if (!userExisted.comparePassword(old_password)) {
      return response.status(400).json({
        message: 'Password not correct.'
      })
    }

    if (!new_password || new_password.length < 6) {
      return response.status(400).json({ status: 400, message: 'New password require less 6 characters.' })
    }

    if (new_password === old_password) {
      return response.status(400).json({ status: 400, message: 'New password must diffent with current password.'})
    }
    
    userExisted.password = new_password;

    await userExisted.save();
    
    return response.status(200).json({ status: 200 })
  } catch(error) {
    console.log(error);
    return response.status(500).json({ status: 500, message: 'Opps! Something went wrong when call api.' })
  }
};

const getMe = async (request, response) => {
  try {
    const { _id } = request.decoded;
    const userExisted = await User.findById(_id);

    if (!userExisted) {
      return response.status(404).json({ status: 404, message: 'User not found.' })
    }

    return response.status(200).json({
      status: 200,
      data: {
        email: userExisted.email
      }
    })
  } catch(error) {
    console.log(error);
    return response.status(500).json({ status: 500, message: 'Opps! Something went wrong when call api.' })
  }
};

module.exports = {
  login,
  resetPassword,
  updatePassword,
  getMe
}