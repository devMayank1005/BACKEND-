const mongoose = require('mongoose');

const followSchema = new mongoose.Schema(
  {
    follower: { type : String },
    followee: { type : String},
    status: { type: String, 
      enum: { 
        values: ['pending', 'accepted', 'rejected'],
       message:"status can only be pending, accepted or rejected" },
      default: 'pending' } 
  },
  
  {
    timestamps: true
  }
);

followSchema.index({ follower: 1, followee: 1 }, 
  { unique: true });

const FollowModel = mongoose.model('Follow', followSchema);

module.exports = FollowModel;