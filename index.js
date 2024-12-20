const express = require('express');
const app = express();
require('dotenv').config();
const connectToDatabase = require('./db/connection')
const cors = require('cors');
const allUser = require('./db/userSchema')


const port = process.env.PORT ||4040; 
//Database connection function
connectToDatabase();
//Middlewares----------
app.use(cors());
app.use(express.json({limit: '1mb'}))
app.use(express.urlencoded({limit: '1mb',extended:true}));

// Serve images from the 'public' directory
app.use(express.static('public'));

//Routes Middleware----------
app.use('/user',require('./routes/UserRoute'));
app.use('/post',require('./routes/postRoute'));
app.use('/admin',require('./routes/AdminRoute'));

const http = require('http')
const {Server} = require('socket.io');

//Middlewares--------------
const server = http.createServer(app);
          const io = new Server(server,{
            cors:{
           origin:'*',
            },
          })

io.on('connection',(socket)=>{
    console.log('user connected',socket.id);

    socket.on('likePost', async(post) => {
        console.log('like on',post)
        // Handle liking the post (save to database, etc.)
        // Emit an event to update clients in real-time
     
        io.emit('postLiked', post);
      });
    
      socket.on('UnlikePost', async(post) => {
        console.log('unlike on',post)
        // Handle disliking the post (save to database, etc.)
        // Emit an event to update clients in real-time
      
        
        io.emit('postUnliked',post);
      });
     

    socket.on('disconnect',()=>{
        console.log('user disconnected...',socket.id);
    })

   
})



server.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})

exports.io = io


