const mongoose = require('mongoose');

const SavePost = new  mongoose.Schema({
    post:{
        type:mongoose.Schema.Types.ObjectId ,
        ref:'Post',
        required:true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true,

    }
},

{ timestamps:true}
);

 module.exports =  mongoose.model('savedPost',SavePost);