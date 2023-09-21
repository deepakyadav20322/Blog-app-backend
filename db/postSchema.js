const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  discription:{
    type: String,
    required: true,
    trim:true
  },
  content: {
    type: String,
    required: true,
    trim:true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index:true,
  },
  tags: [{
    type: String,
    trim: true,
  }],

  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model for users who liked the post
  }],
 
  comments: [{
    commentText: {
      type: String,
      required: true,
      trim:true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  viewCount: {
    type: Number,
    default: 0, 
  },
},
{timestamps:true});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
