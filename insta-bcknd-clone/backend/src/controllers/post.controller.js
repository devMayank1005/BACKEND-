const PostModel = require("../models/post.model");
const  ImageKit = require('@imagekit/nodejs/index.js');
const { toFile } = require("@imagekit/nodejs/index.js");
const jwt = require("jsonwebtoken");
const { identifyUser } = require("../middleware/auth.middileware");
const likeModel = require("../models/like.model");
const CommentModel = require("../models/comment.model");
const UserModel = require("../models/user.model");
const FollowModel = require("../models/follow.model");  
const imagekitInstance = new ImageKit({
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
    publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
    urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT,
});

async function createPostController(req, res) {

   try {
        const userId = req.userId || req.user?.userId;
        console.log("User ID from token in createPostController:", userId);
        console.log("Decoded user payload:", req.user);
        
        console.log("Creating post with data:", req.body);
        console.log(req.file);

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized. Please log in."
            });
        }

        if (!req.file?.buffer) {
            return res.status(400).json({
                message: "Image is required"
            });
        }

        const file = await imagekitInstance.files.upload({
            file : await toFile(Buffer.from(req.file.buffer),'file'),
            fileName : "one love" ,//required
            folder : "/cohortinstaclone-posts" //optional
            
        });

        const post = await PostModel.create({
            caption: req.body.caption,
            imageUrl: file.url,
            user: userId
        });

        const createdPost = await PostModel.findById(post._id).populate('user').lean();

        return res.status(201).json({
            message: "Post created successfully",
            post: {
                ...createdPost,
                imgUrl: createdPost?.imgUrl || createdPost?.imageUrl
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}
async function getPostController(req,res){ // /api/posts this is a protected route, only logged in users can access this route. So we need to verify the token and get the user id from the token and then get the posts of that user.  
    const userId = req.user.userId;
    console.log("User ID from token:", userId);

    
    

    const posts = await PostModel.find().populate('user', 'username');
    res.status(200).json({
        message: "Posts retrieved successfully",
        posts
    });
}


async function getPostdeailsController(req,res){ // /api/posts/details/:postId this is a protected route, only logged in users can access this route. So we need to verify the token and get the user id from the token and then get the post details of that post id. return details about the post and also return a boolean value isOwner which will be true if the logged in user is the owner of the post and false if the logged in user is not the owner of the post.
  
    const userId = req.user.userId;
    console.log("User ID from token:", userId);
    const postId = req.params.postId;
    console.log("Post ID from params:", postId);

    const post = await PostModel.findById(postId).populate('user', 'username');
    if (!post) {
        return res.status(404).json({
            message: "Post not found"
        });
    }

 const isOwner = post.user._id.toString() === userId;

    res.status(200).json({
        message: "Post details retrieved successfully",
        post,
        isOwner
    });
}

async function likePostController(req, res) {
    try {
        const username = req.user.username;
        const postId = req.params.postId;

        const post = await PostModel.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        // Check if already liked
        const existingLike = await likeModel.findOne({
            username,
            postId
        });

        if (existingLike) {
            return res.status(200).json({
                message: "Post liked successfully"
            });
        }

        // Create like
        await likeModel.create({
            username,
            postId
        });

        return res.status(200).json({
            message: "Post liked successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

async function addCommentController(req, res) {
    try {
        const postId = req.params.postId;
        const username = req.username || req.user?.username;
        const { text } = req.body;

        if (!username) {
            return res.status(401).json({
                message: "Unauthorized. Please log in."
            });
        }

        if (!text) {
            return res.status(400).json({
                message: "Comment text is required"
            });
        }

        const post = await PostModel.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const comment = await CommentModel.create({
            postId,
            username,
            text
        });

        return res.status(201).json({
            message: "Comment added successfully",
            comment
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

async function getCommentsController(req, res) {
    try {
        const postId = req.params.postId;

        const comments = await CommentModel.find({ postId })
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            message: "Comments retrieved successfully",
            comments
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

async function unLikePostController(req, res) {
    try {
        const username = req.user.username;
        const postId = req.params.postId;

        const post = await PostModel.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const existingLike = await likeModel.findOne({
            username,
            postId
        });

        if (!existingLike) {
            return res.status(200).json({
                message: "Post unliked successfully"
            });
        }

        await likeModel.deleteOne({
            _id: existingLike._id
        });

        return res.status(200).json({
            message: "Post unliked successfully"
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

async function getFeedcontroller(req, res) {
  try {
    const username = req.user?.username;

    const posts = await PostModel.find()
      .populate("user")
      .lean();

    const postsWithLikes = await Promise.all(
      posts.map(async (post) => {
        let isLiked = false;

        if (username) {
          const like = await likeModel.findOne({
            username,
            postId: post._id
          });
          isLiked = !!like;
        }

        return {
          ...post,
          imgUrl: post.imgUrl || post.imageUrl,
          isLiked
        };
      })
    );

    return res.status(200).json({
      message: "Feed retrieved successfully",
      posts: postsWithLikes
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      message: "Failed to retrieve feed"
    });
  }
}

module.exports = {
    createPostController
    ,getPostController,
    getPostdeailsController,
    likePostController,
    unLikePostController,
    addCommentController,
    getCommentsController,
    getFeedcontroller
};