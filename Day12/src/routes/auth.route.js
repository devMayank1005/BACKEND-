const express = require('express');
const authController = require('../controllers/auth.controller');
const registerController = authController.registerController;
const loginController = authController.loginController;


const authRouter = express.Router();

/* ================= REGISTER ================= */
authRouter.post('/register', registerController);
/* ================= LOGIN ================= */
authRouter.post('/login', loginController); 

module.exports = authRouter;