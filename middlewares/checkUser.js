// authMiddleware.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || "secret";

module.exports.authMiddleware = (req, res, next) => {
  
  const token = req.cookies.userToken


  if (!token) {
    return res.status(401).json({ message: "No token provided, authorization denied" });
  }


  try {
    // Verify token
    const decoded = jwt.verify(token, SECRET_KEY);

    // Attach user to request
    req.user = decoded; // `decoded` contains the user payload from the token

    next();
  } catch (error) {
    // Token is not valid
    return res.status(401).json({ message: "Token is not valid" });
  }
};