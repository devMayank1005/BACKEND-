const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String },
    profilePicture: {
      type: String,
      default: 'https://example.com/default-profile-picture.jpg'
    },
    // edge collection tells us that this field will store the references of the followers and following of the user
       timestamps: true
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
