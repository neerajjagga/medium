const express = require('express');
const {signupUser, userLogin} = require('../controllers/user.controller')
const userRouter = express.Router();


userRouter.post('/signup', signupUser);
userRouter.post('/login', userLogin);


module.exports = {userRouter};