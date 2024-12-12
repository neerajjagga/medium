const {Blog} = require("../models/blog.model");
const {Comment} = require("../models/comment.model")
const {validateCreateBlogData, validateCommentData} = require("../utils/blogValidation");

const createBlog = async(req, res) => {
    try {
        validateCreateBlogData(req);
        const {title, subtitle, content, thumbnail, visibility, tags} = req.body;

        const createrId = req.user?._id;        

        // generate reading time
        // if avg reading speed is 255 words per min then
        const averageWordsPerMinute = 255;
        const wordCount = content.split(' ').length; 
        const readingTime = Math.floor(wordCount / averageWordsPerMinute);        
        const estimatedReadTime = readingTime === 0 ? 1 : readingTime;

        // save the data 
        const blog = new Blog({
            title,
            subtitle,
            content,
            thumbnail,
            visibility,
            tags,
            readingTime : estimatedReadTime,
            creater : createrId,
        })

        //save the blog
        await blog.save();
        res.status(201).json({
            message : "Blog created successfully"
        });

    } catch (error) {        
        res.status(400).json({
            message : "Error coming while creating blog",
            Error : error.message
        })
    }
}

const clapBlog = async(req, res) => {
    try {
        const blogId = req.params.blogId;
        const userId = req.user?._id;

        // validateBlogId
        const blog = await Blog.findById({_id : blogId});
        if(!blog) {
            return res.status(400).json({
                message : "Blog not found"
            })
        }

        const clapArray = blog.claps;

        // check if a user has already clapped
        if(clapArray.includes(userId)) {
            return res.status(209).json({
                message : "You have already clapped",
            })
        }

        // if user not clapped already then
        clapArray.push(userId)
        await blog.save();

        res.status(201).json({
            message : "Blog clapped successfully"
        })

    } catch (error) {        
        res.status(400).json({
            message : "Error coming while clapping a blog",
            Error : error.message
        })
    }
}

const commentBlog = async(req, res) => {
    try {
        validateCommentData(req);
        const {message} = req.body;
        const userId = req.user?._id;
        const blogId = req.params.blogId;

         // validateBlogId
         const blog = await Blog.findById({_id : blogId});
         if(!blog) {
             return res.status(400).json({
                 message : "Blog not found"
             })
         }

         const comment = new Comment({
            blogId : blogId,
            fromUserId : userId,
            message,
         })

         await comment.save();

         const commentsArrayOfBlog = blog.postResponses
         commentsArrayOfBlog.push(userId);
         await blog.save();

         res.status(201).json({
            message : "Comment added successfully"
         })

    } catch (error) {        
        res.status(400).json({
            message : "Error coming while clapping a blog",
            Error : error.message
        })
    }
}

module.exports = {createBlog, clapBlog, commentBlog}