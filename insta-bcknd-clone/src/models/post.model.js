const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      default: ""
    },
    imageUrl: {
      type: String,
      required: [true, "Image is required"]
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User id is required for creating a post"]
    }
  },
  {
    timestamps: true
  }
);

const PostModel = mongoose.model('Post', postSchema);

module.exports = PostModel;
