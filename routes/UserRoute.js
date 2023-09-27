const express = require('express');
const userRoute = express();
const uesrController = require('../controllers/UserController')
const {auth} = require('../middleware/auth')

userRoute.post('/login',uesrController.userLogin);
userRoute.post('/register',uesrController.userRegister);
userRoute.post('/verifyEmail',uesrController.VerifyEmail);
userRoute.post('/verification/:id',uesrController.VerificationDone);
userRoute.post('/forgetPass',uesrController.forgetPass);
userRoute.post('/resetPassword/:uuid',uesrController.resetPassword);
userRoute.get('/getSingleUser/:id',auth,uesrController.getSingleUser);
userRoute.post('/updateUser/:id',auth,uesrController.updateUser);
userRoute.delete('/deleteUserAccount',auth,uesrController.deleteUserAccount);






module.exports = userRoute ;