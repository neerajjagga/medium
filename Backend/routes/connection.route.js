const express = require('express');
const { userAuth } = require('../middlewares/userAuth.middleware');
const {followUser, unfollowUser} = require('../controllers/connection.controller')

const connectionRouter = express.Router();

connectionRouter.post('/follow/:username', userAuth, followUser);
connectionRouter.post('/unfollow/:username', userAuth, unfollowUser);


module.exports = {connectionRouter}