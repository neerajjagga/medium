const express = require('express');
const {signupUser, userLogin, userLogout} = require('../controllers/user.controller');
const { userAuth } = require('../middlewares/userAuth.middleware');
const userRouter = express.Router();


userRouter.post('/signup', signupUser);
userRouter.post('/login', userLogin);
userRouter.post('/logout', userLogout);

module.exports = {userRouter};