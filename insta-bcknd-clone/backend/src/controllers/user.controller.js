const followModel = require("../models/follow.model");
const UserModel = require("../models/user.model");
const userRouter = require("../routes/user.route");




// /api/users/follow/:userId this is a protected route, only logged in users can access this route. So we need to verify the token and get the user id from the token and then follow the user with the user id from the params. return a message "User followed successfully" if the user is followed successfully and return a message "You are already following this user" if the user is already following this user.{}


const FollowModel = require("../models/follow.model");

async function followUserController(req, res) {
  try {

    const followerId = req.user.id;          // logged-in user
    const followeeId = req.params.userId;    // user to follow

    if (followerId === followeeId) {
      return res.status(400).json({
        message: "You cannot follow yourself"
      });
    }

    const followee = await UserModel.findById(followeeId);

    if (!followee) {
      return res.status(404).json({
        message: "User to follow not found"
      });
    }

    const existingFollow = await FollowModel.findOne({
      follower: followerId,
      followee: followeeId
    });

    if (existingFollow) {
      return res.status(400).json({
        message: "You are already following this user"
      });
    }

    const followRecord = await FollowModel.create({
      follower: followerId,
      followee: followeeId,
      status: "accepted"
    });

    res.status(201).json({
      message: "User followed successfully",
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

    const followerId = req.user.id;
    const followeeId = req.params.userId;

    const followRecord = await FollowModel.findOne({
      follower: followerId,
      followee: followeeId
    });

    if (!followRecord) {
      return res.status(400).json({
        message: "You are not following this user"
      });
    }

    await FollowModel.deleteOne({
      follower: followerId,
      followee: followeeId
    });

    res.status(200).json({
      message: "User unfollowed successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}  

 
async function getUserProfileController(req, res) {
  try {
    const userId = req.userId || req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "User ID not found in token"
      });
    }

    const user = await UserModel.findById(userId)
      .select('-password')
      .lean();

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Get followers count
    const followersCount = await FollowModel.countDocuments({
      followee: userId
    });

    // Get following count
    const followingCount = await FollowModel.countDocuments({
      follower: userId
    });

    // Get posts count
    const PostModel = require("../models/post.model");
    const postsCount = await PostModel.countDocuments({
      user: userId
    });

    res.status(200).json({
      user: {
        ...user,
        followersCount,
        followingCount,
        postsCount
      }
    });

  } catch (error) {
    console.error('Error in getUserProfileController:', error);
    res.status(500).json({
      message: error.message
    });
  }
}

module.exports = { followUserController, unfollowUserController, getUserProfileController };