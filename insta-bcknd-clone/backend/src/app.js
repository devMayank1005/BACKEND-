const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const userModel = require('./models/user.model');

const app = express();

app.use(express.json());
app.use(cookieParser());

// Serve static files from frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/dist')));
}

// CORS configuration
const corsOptions = {
  credentials: true,
  origin: process.env.NODE_ENV === 'production' 
    ? false 
    : "http://localhost:5173"
};
app.use(cors(corsOptions));

// require routes
const authRouter = require('./routes/auth.route');
const postRouter = require('./routes/post.route');  
const userRouter = require('./routes/user.route');



// use routes
app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);
app.use('/api/users', userRouter);

// Catch-all handler for frontend routes in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
  });
}

module.exports = app;