/* eslint-disable no-console */
const { Token } = require('../models/token');
const { client } = require('../config/db');

// Сохраняем или обновляем токен
const save = async (userId, newToken) => {
  console.log('Saving token for userId:', userId);
  console.log('New token:', newToken);

  if (!userId) {
    throw new Error('User ID is required');
  }

  // Использование транзакции
  const t = await client.transaction();

  try {
    const token = await Token.findOne({ where: { userId }, transaction: t });

    if (!token) {
      console.log('No existing token found, creating a new one');

      await Token.create(
        { userId, refreshToken: newToken },
        { transaction: t },
      );
    } else {
      console.log('Token found, updating with new refresh token');
      token.refreshToken = newToken;
      await token.save({ transaction: t });
    }

    // Подтверждение транзакции
    await t.commit();
  } catch (error) {
    // Откат транзакции при ошибке
    await t.rollback();
    console.error('Error saving token:', error);
    throw error; // Перебрасываем ошибку для дальнейшего логирования
  }
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
