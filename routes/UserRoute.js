const express = require('express');
const userRoute = express();
const uesrController = require('../controllers/UserController')


userRoute.post('/login',uesrController.userLogin);
userRoute.post('/register',uesrController.userRegister);
userRoute.post('/verifyEmail',uesrController.VerifyEmail);
userRoute.post('/verification/:id',uesrController.VerificationDone);
userRoute.post('/forgetPass',uesrController.forgetPass);
userRoute.post('/resetPassword/:uuid',uesrController.resetPassword);






module.exports = userRoute ;