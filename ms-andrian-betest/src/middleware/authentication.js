const { verifyToken } = require('../helper/jwt');
const { getDB } = require('../internal/db'); // Ensure you import getDB

async function Authentication(req, res, next) {
  try {
    const db = getDB();

    // Extract the token from the Authorization header
    const { access_token } = req.headers;

    if (!access_token) {
      return res.status(401).json({ message: 'Token Needed!' });
    }

    const payload = verifyToken(access_token);
    const user = await db.collection('users').findOne({
      userName: payload.username,
      accountNumber: payload.accountnumber,
    });
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Attach user information to the request object
    req.user = {
      username: user.userName,
      accountnumber: user.accountNumber,
    };

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    // Handle specific errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid Token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token Expired' });
    }

    // For other errors, return a generic 500 response
    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
}

module.exports = Authentication;
