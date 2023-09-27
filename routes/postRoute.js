const express = require('express');
const postRoute = express();
const postController = require('../controllers/PostController')
const {auth} = require('../middleware/auth')

postRoute.post('/createPost',auth,postController.createPost);
postRoute.get('/getSinglePost/:id',postController.getPostById);
postRoute.get('/getPostByIdForUpdate/:id',postController.getPostByIdForUpdating);
postRoute.get('/getAllPosts',postController.getAllPosts);
postRoute.get('/getAllPostsOfUser/:id',postController.getAllPostsOfUser);
postRoute.post('/updatePost/:id',auth,postController.updatePost);
postRoute.delete('/deletePost/:id',auth,postController.deletePost);
postRoute.post('/addCommentToPost/:id',auth,postController.addCommentToPost);
postRoute.post('/savePost/:id',auth,postController.savedPost)
postRoute.delete('/unSavePost/:id',auth,postController.unSavePost)
postRoute.get('/fetchAllSavedPost',auth,postController.fetchAllSavedPost);



module.exports = postRoute ;