/* eslint-disable no-console */
const { Token } = require('../models/token');

// Сохраняем или обновляем токен
const save = async (userId, newToken) => {
  console.log('Saving token for userId:', userId);
  console.log('New token:', newToken);

  if (!userId) {
    throw new Error('User ID is required');
  }

  const token = await Token.findOne({ where: { userId } });

  if (!token) {
    console.log('No existing token found, creating a new one');

    await Token.create({ userId, refreshToken: newToken });

    return;
  }

  console.log('Token found, updating with new refresh token');
  token.refreshToken = newToken;
  await token.save();
};

// Получаем токен по refreshToken
const getByToken = (refreshToken) => {
  if (!refreshToken) {
    throw new Error('Refresh token is required');
  }

  console.log('Fetching token with refreshToken:', refreshToken);

  return Token.findOne({ where: { refreshToken } });
};

// Удаляем токен
const remove = (userId) => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  console.log('Removing token for userId:', userId);

  return Token.destroy({ where: { userId } });
};

module.exports = {
  save,
  getByToken,
  remove,
};
