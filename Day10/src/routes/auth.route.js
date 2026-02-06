const express = require('express');
const User = require('../models/user.model');
const authRouter = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

authRouter.post('/register', async(req, res) => {
    // Registration logic here
    const { name, email, password } = req.body;
    // You would typically add validation and hashing here
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).send({ message: 'Email already in use' });
    }   

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
     
    const user = await User.create({ name, email, password: hashedPassword });


    const token = jwt.sign({ userId: user._id }
        , process.env.JWT_SECRET_KEY, 
        { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true , secure:false});
    res.status(201).send({ message: 'User registered successfully', user, token }); 
    
});

authRouter.post('/protected', (req, res) => {    // Logout logic here
    console.log(req.cookies);
    res.send('Protected route');
});


// controller for login route

authRouter.post('/login', async (req, res) => {
    // Login logic here
    const { email, password } = req.body;
    const user = await User.findOne({ email, password }); // In production, use hashed passwords and proper validation
    if (!user) {
        return res.status(401).send({ message: 'Invalid email' });
    }
   const isPasswordMatch = user.password === crypto.createHash('sha256').update(password).digest('hex'); //user.password; // In production, use bcrypt to compare hashed passwords
    if (!isPasswordMatch) {
        return res.status(401).send({ message: 'Invalid password' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true , secure:false});
    res.send({ message: 'Login successful', user, token }); 
});




module.exports = authRouter;