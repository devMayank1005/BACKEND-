const userModel = require('../model/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const blacklistModel = require('../model/blacklist.model');
const redis = require('../config/cache');


async function register(req, res) {
    try {
        const {username, email, password} = req.body;
        const isAlreadyRegistered = await userModel.findOne({
            $or: [
                {email},
                {username}
            ]
        });
        
        if (isAlreadyRegistered) {
            return res.status(400).json({message: 'User already exists'});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({
            username,
            email,
            password: hashedPassword
        }); 
        const token = jwt.sign({id: user._id,
            username: user.username,
                email:user.email},
             process.env.JWT_SECRET, {
                expiresIn: '1d'
            });
        res.status(201).json({message: 'User registered successfully',
            user:{
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
}

async function login(req, res) {
    try {
        const {username,email, password} = req.body;
        const user = await userModel.findOne({
            $or: [
                {email},
                {username}
            ]});
        if (!user) {
            return res.status(400).json({message: 'Invalid credentials'});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({message: 'Invalid credentials'});
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, 
            {
                expiresIn: '1h'
            });
            res.cookie('token', token);
        res.json({
            message: 'Login successful',
            user: {id: user._id, 
                username: user.username, 
                email: user.email}
                });
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
}

async function getMe(req, res) {
    const user = req.user;
    res.json({user});

    

    
}

async function logout(req, res) {
  const token = req.cookies.token;
  res.clearCookie('token');
  redis.set(token, 'true', 'EX', 60 * 60 * 24
    
  );
  res.status(200).json({ message: 'Logout successful' });
}
module.exports = {register, login, getMe, logout};






