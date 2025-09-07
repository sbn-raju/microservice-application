const express = require('express');
const userController = require('../controllers/user.controllers');
const upload = require('../middleware/multer.middleware');
const authMiddleware = require("../middleware/auth.middleware.js");



const userRoutes = express();

//This route is used for editing the user details.
userRoutes.put('/edit', authMiddleware.authenticateUser, userController.editUser);

//This route is used for editing the user profile picture.
userRoutes.post('/edit-profile', authMiddleware.authenticateUser, upload.single('profile_img'), userController.updateUserProfile);


module.exports = userRoutes