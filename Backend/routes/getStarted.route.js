const express = require('express');
const { getTopics, saveTopics } = require('../controllers/getStarted.controller');
const { userAuth } = require('../middlewares/userAuth.middleware');

const getStartedRouter = express.Router();

getStartedRouter.get('/topics', userAuth, getTopics);
getStartedRouter.post('/topics', userAuth, saveTopics);

module.exports = { getStartedRouter };