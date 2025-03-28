/* eslint-disable no-console */
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  `postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?sslmode=require`,
  {
    dialect: 'postgres',
    logging: false,
  },
);

sequelize
  .authenticate()
  .then(() => console.log('✅ PostgreSQL connected'))
  .catch((err) => console.log('❌ PostgreSQL connection error:', err));

module.exports = sequelize;
