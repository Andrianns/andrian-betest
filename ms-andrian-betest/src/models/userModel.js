const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    accountNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    emailAddress: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    identityNumber: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create a User model
const User = mongoose.model('User ', userSchema);

module.exports = User;
