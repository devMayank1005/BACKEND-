const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../models/user.model");

/* =========================
   REGISTER CONTROLLER
========================= */
async function registerController(req, res) {
    try {
        const { name, email, username, password } = req.body;

        // Check if user already exists
        const existingUser = await UserModel.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists with this email or username"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await UserModel.create({
            name,
            email,
            username,
            password: hashedPassword
        });

        // Create JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1d" }
        );

        // Set secure cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // true in production (HTTPS)
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                email: user.email,
                username: user.username
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Error registering user",
            error: error.message
        });
    }
}


/* =========================
   LOGIN CONTROLLER
========================= */
async function loginController(req, res) {
    try {
        const { email, username, password } = req.body;

        const user = await UserModel.findOne({
            $or: [{ email }, { username }]
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // true in production
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                email: user.email,
                username: user.username
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Error logging in",
            error: error.message
        });
    }
}


/* =========================
   LOGOUT CONTROLLER
========================= */
async function logoutController(req, res) {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });

        res.status(200).json({
            message: "Logged out successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error logging out",
            error: error.message
        });
    }
}

module.exports = {
    registerController,
    loginController,
    logoutController
};
