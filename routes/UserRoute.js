const express = require('express');
const userRoute = express();
const uesrController = require('../controllers/UserController')
const {auth} = require('../middleware/auth');
const { handleMulterError } = require('../middleware/handleMulterError');
const multer = require('multer')
const path =require('path');

// ============================== Multer configuration for uploading mainImage ===========================

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,path.join(__dirname,'../public/UserImages'));
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



userRoute.post('/login',uesrController.userLogin);
userRoute.post('/register',uesrController.userRegister);
userRoute.post('/verifyEmail',uesrController.VerifyEmail);
userRoute.post('/verification/:id',uesrController.VerificationDone);
userRoute.post('/forgetPass',uesrController.forgetPass);
userRoute.post('/resetPassword/:uuid',uesrController.resetPassword);
userRoute.get('/getSingleUser/:id',auth,uesrController.getSingleUser);
userRoute.post('/updateUser/:id',auth,upload.single("profileImg"),handleMulterError,uesrController.updateUser);
userRoute.delete('/deleteUserAccount',auth,uesrController.deleteUserAccount);
userRoute.get('/getRandomUserInfo/:id',uesrController.getRandomUserInfo);
userRoute.get('/userFollow/:userIdToFollow',auth,uesrController.userFollow);
userRoute.get('/userUnFollow/:userIdToUnfollow',auth,uesrController.userUnFollow);
userRoute.get('/getgetFollowerFollowing/:userId',auth,uesrController.getgetFollowerFollowing);






module.exports = userRoute ;