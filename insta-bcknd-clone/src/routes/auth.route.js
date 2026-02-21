const express = require('express');
const authController = require('../controllers/auth.controller');
const { log } = require('node:console');
const registerController = authController.registerController;
const loginController = authController.loginController;
const logoutController = authController.logoutController;


const authRouter = express.Router();

/* ================= REGISTER ================= */
authRouter.post('/register', registerController);
/* ================= LOGIN ================= */
authRouter.post('/login', loginController); 

authRouter.post('/logout', logoutController);

module.exports = authRouter;