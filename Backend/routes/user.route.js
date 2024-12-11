const express = require('express');
const {signupUser} = require('../controllers/user.controller')
const userRouter = express.Router();


userRouter.post('/signup', signupUser);


module.exports = {userRouter};