const jwt = require('jsonwebtoken');

module.exports.generateToken  = (id,role) => {
  // Payload with user ID and role
  const payload = {
    userId: id, 
    role:role  // 'admin' or 'user'
  };

  // Generate the token
  const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '3h' });

  return token;
}
