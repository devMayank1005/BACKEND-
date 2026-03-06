const express = require('express');
const authController = require('../controllers/auth.controller');
const { log } = require('node:console');
const registerController = authController.registerController;
const loginController = authController.loginController;
const logoutController = authController.logoutController;
const getMeController = authController.getMeController;
const { identifyUser } = require('../middleware/auth.middileware');


const authRouter = express.Router();

/* ================= REGISTER ================= */
authRouter.post('/register', registerController);
/* ================= LOGIN ================= */
authRouter.post('/login', loginController); 

authRouter.post('/logout', logoutController);

authRouter.get('/get-me', identifyUser,getMeController)

module.exports = authRouter;