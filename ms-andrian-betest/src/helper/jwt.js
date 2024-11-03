const jwt = require('jsonwebtoken');

function createToken(payload) {
  const options = {
    expiresIn: '1h',
  };
  return jwt.sign(payload, process.env.SECRET, options);
}

function verifyToken(token) {
  return jwt.verify(token, process.env.SECRET);
}

module.exports = { createToken, verifyToken };
