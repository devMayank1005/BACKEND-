express = require("express");
const postRouter = express.Router();
const { createPostController, getPostController, getPostdeailsController } = require("../controllers/post.controller");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Create a new post /api/posts
// request body: { caption, image-file }

postRouter.post('/',upload.single('image'), createPostController);
postRouter.get('/',getPostController); 

postRouter.get('/details/:postId',getPostdeailsController); // get post details by post id, this is a protected route, only logged in users can access this route. So we need to verify the token and get the user id from the token and then get the post details of that post id.)









module.exports = postRouter;