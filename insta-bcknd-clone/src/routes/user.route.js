const express = require("express");
const userRouter = express.Router();
const { identifyUser } = require("../middleware/auth.middileware");
const userController = require("../controllers/user.controller");



// @route POST /api/users/follow/:userId
// @descrption Follow a user by user id, this is a protected route, only logged in users can access this route. So we need to verify the token and get the user id from the token and then follow the user by user id.
// @access Private
userRouter.post('/follow/:username', identifyUser, userController.followUserController); // follow a user by user id, this is a protected route, only logged in users can access this route. So we need to verify the token and get the user id from the token and then follow the user by user id.
userRouter.post('/unfollow/:username', identifyUser, userController.unfollowUserController); // unfollow a user by user id, this is a protected route, only logged in users can access this route. So we need to verify the token and get the user id from the token and then unfollow the user by user id.









module.exports = userRouter;


