const express = require('express');
const { userAuth } = require('../middlewares/userAuth.middleware');
const {createBlog, clapBlog, addComment, editComment, deleteComment, deleteBlog, viewBlog, getUserBlogs} = require("../controllers/blog.controller");
const multer = require('multer');
const blogRouter = express.Router();

const storage = multer.diskStorage({
    destination : function(req, file, cb) {
        cb(null, './uploads/thumbnail-images');
    },
    filename : function(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
})

const upload = multer({ storage });


blogRouter.post('/createblog', userAuth, upload.single('thumbnailImage'), createBlog);
blogRouter.delete('/deleteblog/:blogId', userAuth, deleteBlog);
blogRouter.get('/:username/:titleSlug', userAuth, viewBlog);
blogRouter.post('/clap/:blogId', userAuth, clapBlog);
blogRouter.post('/addcomment/:blogId', userAuth, addComment); 
blogRouter.patch('/editcomment/:commentId', userAuth, editComment); 
blogRouter.delete('/deletecomment/:blogId/:commentId', userAuth, deleteComment); 
blogRouter.get('/:userId', userAuth, getUserBlogs);

module.exports = {blogRouter};