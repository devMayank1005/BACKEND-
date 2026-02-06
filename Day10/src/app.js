const express = require('express');

const path = require('path');
const cookieParser = require('cookie-parser');



const noteModel = require('./models/user.model');
const authRoute = require('./routes/auth.route'); // ✅ MISSING LINE


const app = express();

app.use(cookieParser());


app.use(express.json());


app.use('/api/auth', authRoute);

module.exports = app;
