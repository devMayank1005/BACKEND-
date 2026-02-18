express = require("express");
const postRouter = express.Router();
const { createPostController } = require("../controllers/post.controller");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Create a new post /api/posts
// request body: { caption, image-file }

postRouter.post('/',upload.single('image'), createPostController);










module.exports = postRouter;