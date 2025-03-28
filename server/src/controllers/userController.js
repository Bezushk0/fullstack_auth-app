const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const {
  sendResetPasswordEmail,
  sendEmailChangeNotification,
} = require('../services/mailService');

exports.getProfile = async (req, res) => {
  res.json({ id: req.user.id, name: req.user.name, email: req.user.email });
};

exports.updateName = async (req, res) => {
  try {
    const { name } = req.body;

    req.user.name = name;
    await req.user.save();
    res.json({ message: 'Name updated', name });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!(await bcrypt.compare(oldPassword, req.user.password))) {
      return res.status(400).json({ message: 'Incorrect old password' });
    }

    req.user.password = await bcrypt.hash(newPassword, 10);
    await req.user.save();
    res.json({ message: 'Password updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateEmail = async (req, res) => {
  try {
    const { password, newEmail } = req.body;

    if (!(await bcrypt.compare(password, req.user.password))) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    const oldEmail = req.user.email;

    const emailChangeToken = crypto.randomBytes(32).toString('hex');

    req.user.emailChangeToken = emailChangeToken;
    req.user.newEmail = newEmail;
    await req.user.save();

    await sendEmailChangeNotification(oldEmail, newEmail, emailChangeToken);

    res.json({
      message: 'Email change request sent. Check your email to confirm.',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.confirmEmailChange = async (req, res) => {
  try {
    const { token } = req.body;

    const user = await User.findOne({ where: { emailChangeToken: token } });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.email = user.newEmail;
    user.newEmail = null;
    user.emailChangeToken = null;

    await user.save();

    res.json({ message: 'Email successfully updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');

    user.resetPasswordToken = resetToken;

    user.resetPasswordExpires = Date.now() + 3600000;

    await user.save();
    await sendResetPasswordEmail(email, resetToken);

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.json({ message: 'Password successfully reset' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
