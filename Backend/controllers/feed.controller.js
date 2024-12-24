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

        console.log('User Customized Blogs: ', userCustomizedBlogs.length);

        if (userCustomizedBlogs.length > 0 && userCustomizedBlogs.length < limit) {
            const pendingNoOfBlogs = limit - userCustomizedBlogs.length;
            const pendingMixedGenereBlogs = await fetchMixedGenereBlogs(skip, pendingNoOfBlogs);

            // after that concat both usercustomized field and mixedgenere fields
            const mixedBlogs = userCustomizedBlogs.concat(pendingMixedGenereBlogs);

            console.log('Pending Blogs: ', pendingNoOfBlogs);
            console.log('Mixed Blogs: ', pendingMixedGenereBlogs.length);
            console.log('Total Blogs: ', mixedBlogs.length);

            return res.status(200).json({
                success : true,
                blogs: mixedBlogs,
                allBlogsFetched: mixedBlogs.length < limit
            })
        }


        if (userCustomizedBlogs.length === 0) {
            // mixed blogs
            const mixedGenereBlogs = await fetchMixedGenereBlogs(skip, limit);

            return res.status(200).json({
                success : true,
                blogs: mixedGenereBlogs,
                allBlogsFetched: mixedGenereBlogs.length < limit
            })
        }

        res.status(200).json({
            success : true,
            blogs: userCustomizedBlogs,
            allBlogsFetched: userCustomizedBlogs.length < limit
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message: "Failed to fetch blogs",
            Error: error.message
        })
    }
}

const getFilteredFeed = async (req, res) => {
    try {
        const loggedInUser = req.user;

        const BLOG_SAFE_DATA = "title titleSlug subtitle thumbnail clapCount postResponseCount readingTime creator publishAt -_id";
        const CREATOR_SAFE_DATA = "name username profileImgUrl -_id";

        // Add pagination
        const { limit, skip } = getPagination(req, 20);

        const { type, tag } = req.query;

        // Handle tag-based feed
        if (type === 'tag') {
            if (!tag) {
                return res.status(400).json({
                    success: false,
                    message: "Tag parameter is missing",
                });
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
                .lean();

            if (tagRelatedBlogs.length === 0) {
                return res.status(200).json({
                    success: true,
                    message: `No blogs found with the tag ${tag}`
                });
            }

            return res.status(200).json({
                success: true,
                message: "Blogs fetched successfully",
                blogs: tagRelatedBlogs,
                allBlogsFetched: tagRelatedBlogs.length < limit
            });
        }

        // Handle following-based feed
        else if (type === 'following') {
            if (loggedInUser.following.length === 0) {
                return res.status(200).json({
                    success: true,
                    message: "Follow someone to see their blogs"
                });
            }

            const followingBlogs = await Blog.find({
                creator: { $in: loggedInUser.following } // Blogs by followed users
            })
                .sort({ publishAt: -1 })
                .select(BLOG_SAFE_DATA)
                .populate('creator', CREATOR_SAFE_DATA)
                .skip(skip)
                .limit(limit)
                .lean();

            if (followingBlogs.length === 0) {
                return res.status(204).json({
                    success: true,
                    message: "No blogs found from the users you follow",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Blogs fetched successfully",
                blogs: followingBlogs
            });
        }

        // Invalid type
        else {
            return res.status(400).json({
                success: false,
                message: "Invalid type parameter. Use 'tag' or 'following'."
            });
        }
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch blogs",
            error: error.message
        });
    }
};


module.exports = { getForYouFeed, getFilteredFeed };