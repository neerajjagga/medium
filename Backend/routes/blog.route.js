const express = require('express');
const { userAuth } = require('../middlewares/userAuth.middleware');
const {createBlog, clapBlog, commentBlog} = require("../controllers/blog.controller")
const blogRouter = express.Router();


blogRouter.post('/createblog', userAuth, createBlog);
blogRouter.post('/clap/:blogId', userAuth, clapBlog);
blogRouter.post('/addcomment/:blogId', userAuth, commentBlog); // doubt in this endpoint 

module.exports = {blogRouter};