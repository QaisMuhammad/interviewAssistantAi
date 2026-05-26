const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth.routes');
const interviewRouter = require('./routes/interview.routes');

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use('/api/auth', authRouter);
app.use('/api/interview', interviewRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

module.exports = app;