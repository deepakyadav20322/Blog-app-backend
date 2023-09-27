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
    passwordToken:{
        type:String,
        default:""
    },
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