const  {Schema,model} = require('mongoose');
const  mongoose= require('mongoose');


const userSchema = new Schema({
    fname:{
        type:'String',
        required:true,
       trim:true
    },
    lname:{
        type:String,
        required:true,
       trim:true,
    },
    email:{
        type:String,
        required:true,
       trim:true
    },
    password:{
        type:String,
        required:true,
    },
    bio:{
        type:String,
        required:false,
        default:'I am a Writer',
        trim:true
    },
    mob:{
        type:Number,
        required:true,
    },
    emailVerify:{
        type:Number,
        default:0
    },
    isAdmin:{
        type:Number,
        default:0
    },
   blocked:{
    type:Number,
    default:0,
   },
   websiteURL:{
    type:String,
    required:false
   },
   location:{
    type:String,
    required:false
   },
   available:{
    type:String,
    required:false
   },
   currentLearning:{
    type:String,
    required:false
   },
   skillLanguage:{
    type:String,
    required:false
   },
   work:{
    type:String,
    required:false
   },
   education:{
    type:String,
    required:false
   },
   brandColor:{
    type:String,
    required:false
   },
    passwordToken:{
        type:String,
        default:""
    },followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }],
      following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }],
    savedPost: [
        {
          post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post', // Reference to the Post model
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],

},
{timestamps:true});

module.exports = model('User',userSchema);