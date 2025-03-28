/* eslint-disable no-console */
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  },
);

sequelize
  .authenticate()
  .then(() => console.log('✅ PostgreSQL connected'))
  .catch((err) => console.log('❌ PostgreSQL connection error:', err));

module.exports = sequelize;
