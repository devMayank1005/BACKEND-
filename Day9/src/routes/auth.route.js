const express = require('express');
const User = require('../models/user.model');
const authRouter = express.Router();
const jwt = require('jsonwebtoken');

authRouter.post('/register', async(req, res) => {
    // Registration logic here
    const { name, email, password } = req.body;
    // You would typically add validation and hashing here
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).send({ message: 'Email already in use' });
    }   
     
    const user = await User.create({ name, email, password });


    const token = jwt.sign({ userId: user._id }
        , process.env.JWT_SECRET_KEY, 
        { expiresIn: '1h' });
    res.status(201).send({ message: 'User registered successfully', user, token }); 
});

authRouter.post('/login', (req, res) => {
    // Login logic here
    res.send('User logged in');
});




module.exports = authRouter;