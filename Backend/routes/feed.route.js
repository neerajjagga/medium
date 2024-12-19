const express = require('express');
const {getForYouFeed, getFilteredFeed} = require('../controllers/feed.controller');
const { userAuth } = require('../middlewares/userAuth.middleware');

const feedRouter = express.Router();

feedRouter.get('/for-you', userAuth, getForYouFeed);
feedRouter.get('/', userAuth, getFilteredFeed);

module.exports = {feedRouter}