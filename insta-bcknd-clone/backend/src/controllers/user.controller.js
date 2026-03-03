const followModel = require("../models/follow.model");
const UserModel = require("../models/user.model");
const userRouter = require("../routes/user.route");




// /api/users/follow/:userId this is a protected route, only logged in users can access this route. So we need to verify the token and get the user id from the token and then follow the user with the user id from the params. return a message "User followed successfully" if the user is followed successfully and return a message "You are already following this user" if the user is already following this user.{}


const FollowModel = require("../models/follow.model");

async function followUserController(req, res) {
  try {
    const followerUsername = req.user.username; // from token
    const followeeUsername = req.params.username; // from URL
     
   
    if (followerUsername === followeeUsername) {
      return res.status(400).json({
        message: "You cannot follow yourself"
      });
    }

    const isFolloweeExist = await UserModel.findOne(
        { username: followeeUsername }
    );

if (!isFolloweeExist) {
  return res.status(404).json({
    message: "User to follow not found"
  });
}
   
    // Check if already following
    const existingFollow = await FollowModel.findOne({
      follower: followerUsername,
      followee: followeeUsername
    });

    if (existingFollow) {
      return res.status(400).json({
        message: `You are already following ${followeeUsername}`
      });
    }

    const followRecord = await FollowModel.create({
      follower: followerUsername,
      followee: followeeUsername
    });

    res.status(201).json({
      message: `You are following ${followeeUsername}`,
      follow: followRecord
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}



async function unfollowUserController(req, res) {
  try {
    const followerUsername = req.user.username; // from token
    const followeeUsername = req.params.username; // from URL

    const isUserFollowing = await FollowModel.findOne({
      follower: followerUsername,
      followee: followeeUsername
    });

    if (!isUserFollowing) {
      return res.status(400).json({
        message: `You are not following ${followeeUsername}`
      });
    }

    await FollowModel.deleteOne({
      follower: followerUsername,
      followee: followeeUsername
    });

    res.status(200).json({
      message: `You have unfollowed ${followeeUsername}`
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}   

 
module.exports = { followUserController, unfollowUserController };