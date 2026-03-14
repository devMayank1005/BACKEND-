const {Router} = require('express');
const authController = require('../controller/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = Router();



router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/get-me', authMiddleware.authUser, authController.getMe);

router.get('/logout', authController.logout);


module.exports = router;