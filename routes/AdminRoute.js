const express = require('express');
const adminRoutes = express();
const adminController = require('../controllers/AdminController')
const {auth} = require('../middleware/auth')

adminRoutes.post('/adminLogin',adminController.adminLogin);
adminRoutes.get('/getAllUserInfo',auth,adminController.getAllUserInfo);
adminRoutes.put('/userBlock/:id', auth,adminController.blockToUser);
adminRoutes.post('/createCategory', auth,adminController.createCategory);
adminRoutes.get('/getCategories',adminController.getCategories);




module.exports = adminRoutes ;