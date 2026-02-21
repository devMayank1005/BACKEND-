const PostModel = require("../models/post.model");
const  ImageKit = require('@imagekit/nodejs/index.js');
const { toFile } = require("@imagekit/nodejs/index.js");
const jwt = require("jsonwebtoken");
const { identifyUser } = require("../middleware/auth.middileware");


const imagekitInstance = new ImageKit({
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY
});

async function createPostController(req, res) {

   console.log("User ID from token in createPostController:", req.userId);
    
    console.log("Creating post with data:", req.body);
    console.log(req.file);
    const file = await imagekitInstance.files.upload({
        file : await toFile(Buffer.from(req.file.buffer),'file'),
        fileName : "one love" ,//required
        folder : "/cohortinstaclone-posts" //optional
        
    });
    

    const post = await PostModel.create({
        caption: req.body.caption,
        imageUrl: file.url,
        user: req.userId
    });

    res.status(201).json({
        message: "Post created successfully",
        post
    });
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
  if (!isOwner) {
        return res.status(403).json({
            message: "Forbidden. You are not the owner of this post."
        });
    }

    res.status(200).json({
        message: "Post details retrieved successfully",
        post,
        isOwner
    });
}

module.exports = {
    createPostController
    ,getPostController,
    getPostdeailsController
};