const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description:{
    type: String,
    required: true,
    trim:true
  },
  content: {
    type: String,
    required: true,
    trim:true
  },
  mainImage:{
    type:String
  },
  readTime:{
    type:Number,
    // required:true,
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
  viewCount: {
    type: Number,
    default: 0, 
  },
  saveCount:{
    type:Number,
    default:0,
  },
  category:{
    type:String,
    // required:true,
  },
  comments: [{
      commentText: {
        type: String,
        trim:true,
      },
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
    likes: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User', // Reference to the User model for users who liked the post
}],
},
{timestamps:true});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;






// for letter use --------------------------


// likes: [{
//   type: mongoose.Schema.Types.ObjectId,
//   ref: 'User', // Reference to the User model for users who liked the post
// }],

// comments: [{
//   commentText: {
//     type: String,
//     required: true,
//     trim:true,
//   },
//   author: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// }],