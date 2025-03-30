/* eslint-disable no-console */
require('dotenv').config();

const { Sequelize } = require('sequelize');
const pg = require('pg');

const client = new Sequelize({
  host: process.env.DB_HOST || 'postgres',
  username: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  dialect: 'postgres',
  dialectModule: pg,
  dialectOptions: {
    ssl: false,
    // ssl: {
    //   require: true,
    //   rejectUnauthorized: false,
    // },
  },
});

client
  .authenticate()
  .then(() => console.log('✅ PostgreSQL connected'))
  .catch((err) => console.log('❌ PostgreSQL connection error:', err));

module.exports = {
  client,
};
