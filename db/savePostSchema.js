const mongoose = require('mongoose');

const SavePost = new  mongoose.Schema({
    post:{
        type:mongoose.Schema.Types.ObjectId ,
        ref:'Uesr',
        required:true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post',
        require:true,

    }
},

{ timestamps:true}
);

 module.exports =  mongoose.model('savedPost',SavePost);