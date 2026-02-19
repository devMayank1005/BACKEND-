const PostModel = require("../models/post.model");
const  ImageKit = require('@imagekit/nodejs');
const { toFile } = require("@imagekit/nodejs");
const jwt = require("jsonwebtoken");


const imagekitInstance = new ImageKit({
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY
});

async function createPostController(req, res) {

    const token = req.cookies.token;
    
    if (!token) {
        return res.status(401).json({
            message: "Unauthorized. Please log in to create a post."
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = decoded.userId;
        console.log("Decoded JWT:", decoded);
        console.log("Cookies:", req.cookies);
        


        
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token. Please log in again."
        });
    }
    
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
    const token = req.cookies.token;;
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = decoded.userId;
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token. Please log in again."
        });
    }

    const userId = decoded.userId;
    console.log("User ID from token:", userId);

    const posts = await PostModel.find().populate('user', 'username');
    res.status(200).json({
        message: "Posts retrieved successfully",
        posts
    });
}



async function getPostdeailsController(req,res){ // /api/posts/details/:postId this is a protected route, only logged in users can access this route. So we need to verify the token and get the user id from the token and then get the post details of that post id.
    const token = req.cookies.token;;
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = decoded.userId;
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token. Please log in again."
        });
    }

    const postId = req.params.postId;
    console.log("Post ID from params:", postId);

    const post = await PostModel.findById(postId).populate('user', 'username');
    if (!post) {
        return res.status(404).json({
            message: "Post not found"
        });
    }

 const isOwner = post.user._id.toString() === req.userId;
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