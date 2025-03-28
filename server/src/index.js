/* eslint-disable no-console */
'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const { sequelize } = require('./models/User');

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to my API!!!!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

sequelize
  .sync({ force: true })
  .then(() => console.log('✅ Database synced'))
  .catch((err) => console.log('❌ Database sync error:', err));
