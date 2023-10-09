const express = require('express');
const postRoute = express();
const postController = require('../controllers/PostController')
const {auth} = require('../middleware/auth');
const multer = require('multer');
const path =require('path');
const { handleMulterError } = require('../middleware/handleMulterError');


// ============================== Multer configuration for uploading mainImage ===========================

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,path.join(__dirname,'../public/BlogImages'));
    },
    filename:function(req,file,cb) {
        cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage ,
    fileFilter:(req, file, cb) => {
     const allowedExtensions = ['.jpeg','.png','.jpg'];
     // Get the file extension by using path module
     const fileExtension = path.extname(file.originalname).toLowerCase();
   
     // Check if the file extension is allowed
     if (allowedExtensions.includes(fileExtension)) {
       cb(null, true);
     } else {
       const error = new multer.MulterError('Only JPEG files are allowed');
       error.code = 'LIMIT_FILE_TYPES'; //  Set a custom error code
       cb(error);
     }
   },
    limits: { fileSize: 1024 * 1024 } // 1MB size limit size 
   });




// -------------------------------- ********************************* ------------------------------------

postRoute.post('/createPost',auth,upload.single("mainImage"),handleMulterError,postController.createPost);
postRoute.get('/getSinglePost/:id',postController.getPostById);
postRoute.get('/getPostByIdForUpdate/:id',postController.getPostByIdForUpdating);
postRoute.get('/getAllPosts',postController.getAllPosts);
postRoute.get('/getAllPostsOfUser/:id',postController.getAllPostsOfUser);
postRoute.get('/getAllPostsOfUserRecomendation/:id',postController.getAllPostsOfUserForRecomedation);
postRoute.post('/updatePost/:id',auth,postController.updatePost);
postRoute.delete('/deletePost/:id',auth,postController.deletePost);
postRoute.post('/addCommentToPost/:id',auth,postController.addCommentToPost);
postRoute.post('/savePost/:id',auth,postController.savedPost)
postRoute.delete('/unSavePost/:id',auth,postController.unSavePost)
postRoute.get('/fetchAllSavedPost',auth,postController.fetchAllSavedPost);
postRoute.get('/getAllPostToSpecificUser/:userId',postController.getAllPostToSpecificUser);
postRoute.get('/likePost/:postId',auth,postController.likePost)
postRoute.get('/unlikePost/:postId',auth,postController.unlikePost)



module.exports = postRoute ;