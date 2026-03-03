const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "posts",
    required: true
  },
  username: {
    type: String,
    required: true
  }
}, { timestamps: true });          
likeSchema.index({ postId: 1, username: 1 }, { unique: true }); // Ensure a user can like a post only once     

const Like = mongoose.model("Like", likeSchema);

module.exports = Like;