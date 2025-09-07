const express = require('express');
const userAuthControllers = require("../controllers/auth.controllers");


const userAuthRoutes = express();


//Used for logging the user into the system.
userAuthRoutes.post('/login', userAuthControllers.login);


//Used for the register the new user into the system.
userAuthRoutes.post('/register', userAuthControllers.register);


//Used for verify the email of the user.
userAuthRoutes.post('/verify-email', userAuthControllers.verifyMail);

//Used for verify the otp.
userAuthRoutes.post('/verify-otp', userAuthControllers.verifyOTP);

//Used for changing the password of the user.
userAuthRoutes.post('/forget-password', userAuthControllers.forgetPassword);


module.exports = userAuthRoutes