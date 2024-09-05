const { generateToken } = require('../utils/tokenService');
const nodemailer = require('nodemailer');

// Handle forgot password request
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  // Check if the user exists in the DB (replace with your own DB check)
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Generate a random token
  const token = generateToken();

  // Store the token in DB (for verification later) and set an expiry (e.g., 1 hour)
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  // Send reset email
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const resetURL = `http://your-frontend-url/reset-password/${token}`;

  const mailOptions = {
    to: email,
    from: process.env.EMAIL,
    subject: 'Password Reset Request',
    html: `<p>You requested a password reset.</p>
           <p>Click <a href="${resetURL}">here</a> to reset your password.</p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Password reset link has been sent to your email.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send reset email.' });
  }
};

// New controller function for resetting the password
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Find user by reset token and check if token has not expired
    const user = await User.findOne({ 
      resetPasswordToken: token, 
      resetPasswordExpires: { $gt: Date.now() } 
    });

    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
    }

    // Update the user's password
    user.password = password;
    user.resetPasswordToken = undefined; // Clear the token
    user.resetPasswordExpires = undefined; // Clear the expiry
    await user.save();

    res.json({ message: 'Password has been successfully updated.' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while resetting password.' });
  }
};
