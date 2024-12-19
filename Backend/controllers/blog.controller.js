const slugify = require('slugify');
const { customAlphabet } = require('nanoid');
const { Blog } = require("../models/blog.model");
const { Comment } = require("../models/comment.model");
const { User } = require("../models/user.model");
const { validateCreateBlogData, validateCommentData } = require("../utils/blogValidation");
const { populate } = require('dotenv');

const createBlog = async (req, res) => {
    try {
        validateCreateBlogData(req);
        const { title, subtitle, content, thumbnail, visibility, tags } = req.body;

        const creatorId = req.user?._id;

        // generate reading time
        // if avg reading speed is 255 words per min then
        const averageWordsPerMinute = 255;
        const wordCount = content.split(' ').length;
        const estimatedReadTime = Math.ceil(wordCount / averageWordsPerMinute);

        //generate slug for the title
        const titleSlug = slugify(title, { lower: true, strict: true });

        // add uniqueId to titleSlug to differentiate between same titleSlugs
        const nanoid = customAlphabet('1234567890abcdef', 10); 
        const uniqueId = nanoid();
        const finalSlug = `${titleSlug}-${uniqueId}`;
        
        // generate slugs for tags
        const slugifyTags = tags.map(tag => slugify(tag, { lower: true, strict: true }));

        // save the data 
        const blog = new Blog({
            title,
            titleSlug : finalSlug,
            subtitle,
            content,
            thumbnail,
            visibility,
            tags: slugifyTags,
            readingTime: estimatedReadTime,
            creator: creatorId,
        })

        //save the blog
        await blog.save();

        // push blog id into the user blogs array
        await User.findByIdAndUpdate({ _id: creatorId }, {
            $push: { blogs: blog._id }
        })

        res.status(201).json({
            message: "Blog created successfully"
        });

    } catch (error) {
        res.status(400).json({
            message: "Error coming while creating blog",
            Error: error.message
        })
    }
}

const clapBlog = async (req, res) => {
    try {
        const blogId = req.params.blogId;
        const userId = req.user?._id;

        // validateBlogId
        const blog = await Blog.findById({ _id: blogId });
        if (!blog) {
            return res.status(400).json({
                message: "Blog not found"
            })
        }

        const clapArray = blog.claps;

        // check if a user has already clapped
        if (clapArray.includes(userId)) {
            return res.status(209).json({
                message: "You have already clapped",
            })
        }

        // if user not clapped already then
        clapArray.push(userId)
        blog.clapCount++;
        await blog.save();

        res.status(201).json({
            message: "Blog clapped successfully"
        })

    } catch (error) {
        res.status(400).json({
            message: "Error coming while clapping a blog",
            Error: error.message
        })
    }
}

const addComment = async (req, res) => {
    try {
        validateCommentData(req);
        const { message } = req.body;
        const userId = req.user?._id;
        const blogId = req.params.blogId;

        // validateBlogId
        const blog = await Blog.findById({ _id: blogId });

        if (!blog) {
            return res.status(400).json({
                message: "Blog not found"
            })
        }

        const comment = new Comment({
            blogId: blogId,
            fromUserId: userId,
            message,
        })

        await comment.save();

        const commentsArrayOfBlog = blog.postResponses
        commentsArrayOfBlog.push(comment._id);
        blog.postResponseCount++;
        await blog.save();

        res.status(201).json({
            message: "Comment added successfully"
        })

    } catch (error) {
        res.status(400).json({
            message: "Error coming while clapping a blog",
            Error: error.message
        })
    }
}

const editComment = async (req, res) => {
    try {
        validateCommentData(req);
        const { message } = req.body;
        const userId = req.user?._id;
        const commentId = req.params.commentId;

        // validate is comment valid as well as is the comment is written by the current user
        const comment = await Comment.findOne({
            $and: [
                { _id: commentId },
                { fromUserId: userId }
            ]
        });

        if (!comment) {
            return res.status(400).json({
                message: "comment not found or not written by you"
            })
        }

        comment.message = message;
        await comment.save();

        res.status(201).json({
            message: "Comment Edited successfully"
        })

    } catch (error) {
        res.status(400).json({
            message: "Error coming while editing a comment",
            Error: error.message
        })
    }
}

const deleteComment = async (req, res) => {
    try {
        const userId = req.user?._id;
        const blogId = req.params.blogId;
        const commentId = req.params.commentId;

        // validate the commemt is present or not
        const comment = await Comment.findOneAndDelete({
            $and: [
                { _id: commentId },
                { fromUserId: userId }
            ]
        });

        console.log(comment);

        if (!comment) {
            return res.status(400).json({
                message: "comment not found or not written by you"
            })
        }

        // then update the blog postResponseCount and delete the commentId from the array
        const blog = await Blog.findByIdAndUpdate(blogId,
            {
                $pull: { postResponses: commentId }, // pop out the deleted CommentId
                $inc: { postResponseCount: -1 } // decrement the postResponse count
            },
            {
                new: true
            }
        );

        res.status(201).json({
            message: "Comment deleted successfully"
        });

    } catch (error) {
        res.status(400).json({
            message: "Error coming while editing a comment",
            Error: error.message
        })
    }
}

const deleteBlog = async (req, res) => {
    try {
        const loggedInUser = req.user;
        const blogId = req.params.blogId;

        // if we have deleted the blog then 
        // -> delete the blog
        // -> delete all the comments realted to that blog
        // -> pull the object id of the blog from the user schema

        // find and delete the blog
        const blog = await Blog.findOneAndDelete({
            _id: blogId,
            creator: loggedInUser._id
        });

        // if blog not found
        if (!blog) {
            return res.status(404).json({
                message: "Blog not found or you're not authorized to delete this blog",
            })
        }

        // delete all the comments related to that blog
        await Comment.deleteMany({ blogId });

        // pull the object id of blog from user blogs array
        await User.findByIdAndUpdate({ _id: loggedInUser._id }, {
            $pull: { blogs: blogId }
        })

        res.status(200).json({
            message: "Blog deleted successfully"
        })

    } catch (error) {
        res.status(400).json({
            message: "Error coming while deleting a blog",
            Error: error.message
        })
    }
}

const viewBlog = async (req, res) => {
    try {
        const loggedInUser = req.user;
        const username = req.params.username;
        const titleSlug = req.params.titleSlug;

        const BLOG_SAFE_DATA = "title titleSlug thumbnail content clapCount postResponseCount postResponses readingTime creator publishAt visibility -_id";
        const CREATOR_SAFE_DATA = "name username profileImgUrl bio followersCount followingCount -_id";
        const POST_RESPONSES_SAFE_DATA = "fromUserId message createdAt -_id";
        const FROM_USER_ID_SAFE_DATA = "name profileImgUrl -_id";

        const postResponseLimit = parseInt(req.query.limit) || 3;
        const skip = parseInt(req.query.skip) || 0;

        // check the username and titleSlug cannnot be empty
        if (!username || !titleSlug) {
            return res.status(404).json({
                message: "username and titleSlug is required"
            })
        }

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({
                message: "Invalid username"
            })
        }

        // if user present, check the blog is valid or not
        const blog = await Blog.findOne({
            $and: [
                { creator: { $eq: user._id } },
                { titleSlug }
            ]
        })
            .select(BLOG_SAFE_DATA)
            .populate('creator', CREATOR_SAFE_DATA)
            .populate({
                path: 'postResponses',
                select: POST_RESPONSES_SAFE_DATA,
                populate: {
                    path: 'fromUserId',
                    select: FROM_USER_ID_SAFE_DATA,
                },
                options: { limit: postResponseLimit, skip: skip }
            })
            .lean()

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Blog fetched successfully",
            blog
        })

    } catch (error) {
        res.status(500).json({
            message: "Error coming while deleting a blog",
            Error: error.message
        })
    }
}

module.exports = { createBlog, clapBlog, addComment, editComment, deleteComment, deleteBlog, viewBlog }