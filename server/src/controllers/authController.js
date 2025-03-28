/* eslint-disable no-console */
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('../services/mailService');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ where: { email } });

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const activationToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    user = await User.create({
      name,
      email,
      password,
      activationToken,
      isActive: false,
    }).catch((error) => console.log('Error creating user: ', error));

    await nodemailer.sendActivationEmail(email, activationToken);

    res
      .status(201)
      .json({ message: 'Check your email to activate your account' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.activate = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ where: { email: decoded.email } });

    if (!user) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    user.isActive = true;
    user.activationToken = null;
    await user.save();

    res.status(200).json({ message: 'Account activated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
