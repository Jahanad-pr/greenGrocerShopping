const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

module.exports.adminAuthMiddleware = (req, res, next) => {

  
  
  // Get token from Authorization header
  const token = req.cookies.authkeys
  
  
  if (!token) {
    
    return res.status(401).json({ message: "No token provided, authorization denied" });
    
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, SECRET_KEY);

    // Attach user to request
    req.admin = decoded; // `decoded` contains the user payload from the token

    next();

  } catch (error) {
    // Token is not valid
    return res.status(401).json({ message: "Token is not valid" });
  }
};