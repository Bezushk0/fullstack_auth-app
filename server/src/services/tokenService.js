const { Token } = require('../models/token');

const save = async (userId, newToken) => {
  const token = await Token.findOne({ where: { userId } });

  if (!token) {
    await Token.create({ userId, refreshToken: newToken });

    // eslint-disable-next-line no-useless-return
    return;
  }

  token.refreshToken = newToken;

  await token.save();
};

const getByToken = (refreshToken) => {
  return Token.findOne({ where: { refreshToken } });
};

const remove = (userId) => {
  return Token.destroy({ where: { userId } });
};

module.exports = {
  save,
  getByToken,
  remove,
};
