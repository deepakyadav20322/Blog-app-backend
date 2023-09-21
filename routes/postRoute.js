const express = require('express');
const postRoute = express();
const postController = require('../controllers/PostController')


postRoute.post('/createPost',postController.createPost);
postRoute.get('/getSinglePost/:id',postController.getPostById);
postRoute.get('/getAllPosts',postController.getAllPosts);
postRoute.post('/updatePost/:id',postController.updatePost);
postRoute.delete('/deletePost/:id',postController.deletePost);







module.exports = postRoute ;