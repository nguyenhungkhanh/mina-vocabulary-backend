const jwt = require('jsonwebtoken')

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

module.exports = async (request, response, next) => {
  const token = request.body.token || request.query.token || (request.headers["authorization"] || '').replace('Bearer', '').trim()

  if (!token) {
    return response
      .status(403)
      .json({
        message: "No token provided."
      })
  }
    
  jwt.verify(token, JWT_SECRET_KEY, function (error, decoded) {
    if (error) {
      return response.status(403).json({
        message: 'Invalid token.'
      });
    }
    request.decoded = decoded;
    next()
  })
}
