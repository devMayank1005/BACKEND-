const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const authRouter = express.Router();
const userModel = require('../model/user.model');

authRouter.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    const isUserExist = await userModel.findOne({ email });

    if (isUserExist) {
        return res.status(400).json
        (
            { message: 'User already exists' }
        );
    }

    const user = await userModel.create({ name, 
        email, 
        password: crypto.createHash('sha256').update(password).digest('hex') });

    const token = jwt.sign({ userId: user._id }, 
        process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    res.cookie('token', token);
    res.status(201).json({ message: 'User registered successfully', user, token });
  });


authRouter.get('/getme', async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await userModel.findById(decoded.userId);
        console.log(user);
        res.json({ user });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
});


authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    if (user.password !== hashedPassword) {
        return res.status(400).json({ message: 'Invalid  password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    res.cookie('token', token);
    res.json({ message: 'Login successful', user, token });
});

authRouter.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logout successful' });
}); 

module.exports = authRouter;
