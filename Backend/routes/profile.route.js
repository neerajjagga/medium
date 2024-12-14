const express = require('express');
const {getProfile, getFollowingUsers, getFollowers} = require('../controllers/profile.controller');
const { userAuth } = require('../middlewares/userAuth.middleware');
const profileRouter = express.Router();

profileRouter.get('/@:username', userAuth, getProfile);
profileRouter.get('/@:username/following', userAuth, getFollowingUsers);
profileRouter.get('/@:username/followers', userAuth, getFollowers);

module.exports = {profileRouter};