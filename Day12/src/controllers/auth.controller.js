const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');
const crypto = require('crypto');
async function registerController(req, res) {
    try {
        const { name, email, username, password} = req.body;

        // Check if user exists by email OR username
        const isUserExists = await UserModel.findOne({
            $or: [
                { email },
                { username }
            ]
        });

        if (isUserExists) {
            return res.status(409).json({
                message: "User already exists with this email or username"
            });
        }

        // Hash incoming password
        const hashedPassword = crypto
            .createHash('sha256')
            .update(password)
            .digest('hex'); 

        // Create new user
        const user = await UserModel.create({
            name,
            email,
            username,
            password: hashedPassword
        });

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );
        res.cookie('token', token,);
        res.status(201).json({
            message: "User registered successfully",
            user: {
                email: user.email,
                username: user.username,
            },
            
           
        });

    } catch (error) {
        res.status(500).json({
            message: "Error registering user",
            error: error.message
        });
    }
};

async function loginController (req, res)  {
    try {
        const { email, username, password } = req.body;

        // Hash incoming password
        const hashedPassword = crypto
            .createHash('sha256')
            .update(password)
            .digest('hex');

        // Find user by email OR username
        const user = await UserModel.findOne({
            $or: [
                { email },
                { username }
            ]
        });

        if (!user || user.password !== hashedPassword) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: "Login successful",
            user: {
                email: user.email,
                username: user.username,
            },
            token
            
            
        });

    } catch (error) {
        res.status(500).json({
            message: "Error logging in",
            error: error.message
        });
    }
};

module.exports = { registerController, loginController };