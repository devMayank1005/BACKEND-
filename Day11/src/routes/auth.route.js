const express = require('express');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');
const crypto = require('crypto');


const authRouter = express.Router();

/* ================= REGISTER ================= */
authRouter.post('/register', async (req, res) => {
    try {
        const { name, email, username, password } = req.body;

        // Check if user exists by email OR username
        const isUserExists = await UserModel.findOne({
            $or: [
                { email },
                { username }
            ]
        });

        if (isUserExists) {
            return res.status(400).json({
                message: "User already exists with this email or username"
            });
        }

        // Create new user
        const user = await UserModel.create({
            name,
            email,
            username,
            password
        });

        res.status(201).json({
            message: "User registered successfully",
            user
        });

    } catch (error) {
        res.status(500).json({
            message: "Error registering user",
            error: error.message
        });
    }
});

/* ================= LOGIN ================= */
authRouter.post('/login', async (req, res) => {
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
            { expiresIn: '1h' }
        );

        res.json({
            message: "Login successful",
            token
        });

    } catch (error) {
        res.status(500).json({
            message: "Error logging in",
            error: error.message
        });
    }
});
