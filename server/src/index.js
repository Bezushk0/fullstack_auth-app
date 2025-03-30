/* eslint-disable no-console */
'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');

const { authRouter } = require('./routes/authRoutes');
const { userRouter } = require('./routes/userRoutes');
const { errorMiddleware } = require('./middlewares/errorMiddleware');

const PORT = process.env.PORT;

app.use(
  cors({
    origin: process.env.CLIENT_HOST,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use(authRouter);
app.use('/users', userRouter);

app.use((req, res) => {
  res.status(404).send('The page is not found');
});

app.use(errorMiddleware);

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
