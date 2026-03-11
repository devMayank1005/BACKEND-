const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true
    },
    username: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    }
  },
  { timestamps: true }
);

commentSchema.index({ postId: 1, createdAt: -1 });

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
