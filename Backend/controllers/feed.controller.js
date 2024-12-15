const { Blog } = require("../models/blog.model");
const { Comment } = require("../models/comment.model");
const { User } = require("../models/user.model");

const getForYouFeed = async (req, res) => {
    try {
        const loggedInUser = req.user;
        const BLOG_SAFE_DATA = "title titleSlug subtitle thumbnail clapCount postResponseCount readingTime creator publishAt -_id";
        const CREATOR_SAFE_DATA = "name username profileImgUrl -_id"

        // adding pagination
        const DEFAULT_LIMIT = 20;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || DEFAULT_LIMIT;
        limit = limit > 0 && limit <= DEFAULT_LIMIT ? limit : DEFAULT_LIMIT;
        const skip = (page - 1) * limit;

        // if tag specified in the query
        // +++++++++++++++++++++++++++++  PENDING
    
        //customized feed
        const userCustomizedBlogs = await Blog.find({
            $and: [
                { creater: { $ne: loggedInUser._id } },
                { tags: { $in: loggedInUser.interestedTopics } }
            ],
        })
            .sort({ publishAt: -1 }) // sort newest first
            .select(BLOG_SAFE_DATA)
            .populate('creator', CREATOR_SAFE_DATA)
            .skip(skip)
            .limit(limit)
            .lean()

        if (userCustomizedBlogs.length === 0) {
            // mixed blogs
            const mixedGenereBlogs = await Blog.find({
                creator: { $ne: loggedInUser._id },
                tags: { $nin: loggedInUser.interestedTopics },
            })
                .sort({ publishAt: -1 })
                .select(BLOG_SAFE_DATA)
                .populate('creator', CREATOR_SAFE_DATA)
                .skip(skip)
                .limit(limit)
                .lean()

            return res.status(200).json({
                message: "Success",
                mixedGenereBlogs
            })
        }

        res.status(200).json({
            message: "Success",
            userCustomizedBlogs
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to fetch blogs",
            Error: error.message
        })
    }
}

module.exports = { getForYouFeed };