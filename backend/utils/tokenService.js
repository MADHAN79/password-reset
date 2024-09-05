const crypto = require('crypto');

// Function to generate a random token (used for reset link)
exports.generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};
