const { Blog } = require("../models/blog.model");
const { getPagination } = require('../utils/pagination.utility');

const getForYouFeed = async (req, res) => {
    try {
        const loggedInUser = req.user;
        const BLOG_SAFE_DATA = "title titleSlug subtitle thumbnail clapCount postResponseCount readingTime creator publishAt -_id";
        const CREATOR_SAFE_DATA = "name username profileImgUrl -_id"

        // adding pagination
        const { limit, skip } = getPagination(req, 20);

        //customized feed
        const userCustomizedBlogs = await Blog.find({
            $and: [
                { creator: { $ne: loggedInUser._id } },
                { tags: { $in: loggedInUser.interestedTopics } }
            ],
        })
            .sort({ publishAt: -1 })
            .select(BLOG_SAFE_DATA)
            .populate('creator', CREATOR_SAFE_DATA)
            .skip(skip)
            .limit(limit)
            .lean()

        const fetchMixedGenereBlogs = async (skip, limit) => {
            return await Blog.find({
                creator: { $ne: loggedInUser._id },
                tags: { $nin: loggedInUser.interestedTopics },
            })
                .sort({ publishAt: -1 })
                .select(BLOG_SAFE_DATA)
                .populate('creator', CREATOR_SAFE_DATA)
                .skip(skip)
                .limit(limit)
                .lean()
        }

        if (userCustomizedBlogs.length > 0 && userCustomizedBlogs.length < limit) {
            const pendingNoOfBlogs = limit - userCustomizedBlogs.length;
            const pendingMixedGenereBlogs = await fetchMixedGenereBlogs(skip, pendingNoOfBlogs);

            // after that concat both usercustomized field and mixedgenere fields
            const mixedBlogs = userCustomizedBlogs.concat(pendingMixedGenereBlogs);

            return res.status(200).json({
                message: "Success",
                blogs : mixedBlogs
            })
        }

        if (userCustomizedBlogs.length === 0) {
            // mixed blogs
            const mixedGenereBlogs = await fetchMixedGenereBlogs(skip, limit);

            return res.status(200).json({
                message: "Success",
                blogs : mixedGenereBlogs
            })
        }

        res.status(200).json({
            message: "Success",
            blogs : userCustomizedBlogs
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to fetch blogs",
            Error: error.message
        })
    }
}

const getTagRelatedFeed = async (req, res) => {
    try {
        const loggedInUser = req.user;
        const BLOG_SAFE_DATA = "title titleSlug subtitle thumbnail clapCount postResponseCount readingTime creator publishAt -_id";
        const CREATOR_SAFE_DATA = "name username profileImgUrl -_id"

        // adding pagination
        const { limit, skip } = getPagination(req, 20);

        // if tag specified in the query
        const tag = req.query.tag;

        if (!tag) {
            return res.status(400).json({
                message: "Tag parameter is missing"
            })
        }

        const tagRelatedBlogs = await Blog.find({
            $and: [
                { creator: { $ne: loggedInUser._id } },
                { tags: { $in: tag } }
            ]
        })
            .sort({ publishAt: -1 })
            .select(BLOG_SAFE_DATA)
            .populate('creator', CREATOR_SAFE_DATA)
            .skip(skip)
            .limit(limit)
            .lean()

        if (tagRelatedBlogs.length === 0) {
            return res.status(404).json({
                message: `Blogs not found with ${tag} tag`
            })
        }

        return res.status(200).json({
            message: "Blogs fetched successfully",
            blogs : tagRelatedBlogs,
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to fetch blogs",
            Error: error.message
        })
    }
}

module.exports = { getForYouFeed, getTagRelatedFeed };