const express = require('express');
const {getForYouFeed} = require('../controllers/feed.controller');
const { userAuth } = require('../middlewares/userAuth.middleware');

const feedRouter = express.Router();

feedRouter.get('/for-you', userAuth, getForYouFeed);

module.exports = {feedRouter}