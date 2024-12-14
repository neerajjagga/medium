const { populate } = require('dotenv');
const { User } = require('../models/user.model');

const getProfile = async (req, res) => {
    try {
        // return the profile
        const loggedInUser = req.user;
        const username = req.params.username;

        if (!username) {
            return res.status(400).json({
                message: "Username parameter is missing."
            })
        }

        // user safe data
        const USER_SAFE_DATA = "name username bio profileImgUrl followersCount following followingCount blogs -_id"
        const FOLLOWING_USER_SAFE_DATA = "name profileImgUrl followersCount bio -_id";
        const BLOG_SAFE_DATA = "title subtitle thumbnail clapCount postResponseCount readingTime publishAt -_id";

        // first only fetch first 5 following user
        const limit = 5;
        const skip = 0;

        // find user with username 
        const user = await User
            .findOne({ username })
            .select(USER_SAFE_DATA)
            .populate({
                path: 'following',
                select: FOLLOWING_USER_SAFE_DATA,
                options: { limit, skip }
            })
            .populate('blogs', BLOG_SAFE_DATA)
            .exec()

        if (!user) {
            return res.status(404).json({
                message: `User not found with ${username}`
            })
        }

        // return the profile
        res.status(200).json({
            user,
        })

    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({
            message: "An unexpected error occurred while fetching the profile.",
            error: error.message,
        });
    }
}

const getFollowingUsers = async (req, res) => {
    try {
        const username = req.params.username;
        const FOLLOWING_USER_SAFE_DATA = "name profileImgUrl followersCount bio -_id";

        if (!username) {
            return res.status(400).json({
                message: "Username parameter is missing."
            })
        }

        // max 10 users data fetched at a time
        const DEFAULT_LIMIT = 10;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || DEFAULT_LIMIT;
        limit = limit <= DEFAULT_LIMIT ? limit : DEFAULT_LIMIT;
        const skip = (page - 1) * limit;

        // extract following users data
        const followingUsers = await User
            .findOne({ username })
            .select('followingCount following -_id')
            .populate({
                path : 'following',
                select : FOLLOWING_USER_SAFE_DATA,
                options : { limit, skip}
            })
            .exec()

        if (!followingUsers) {
            return res.status(404).json({
                message: "User not found."
            });
        }
            
        res.status(200).json({
            message : "Following users data fetch successfully",
           followingUsers
        })

    } catch (error) {
        console.error("Error fetching following users:", error);
        res.status(500).json({
            message: "An unexpected error occurred while fetching the following users.",
            error: error.message,
        });
    }
}

const getFollowers = async (req, res) => {
    try {
        const username = req.params.username;
        const FOLLOWER_USER_SAFE_DATA = "name profileImgUrl followersCount bio -_id";

        if (!username) {
            return res.status(400).json({
                message: "Username parameter is missing."
            })
        }

        // max 10 users data fetched at a time
        const DEFAULT_LIMIT = 10;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || DEFAULT_LIMIT;
        limit = limit <= DEFAULT_LIMIT ? limit : DEFAULT_LIMIT;
        const skip = (page - 1) * limit;

        // extract followers users data
        const followers = await User
            .findOne({ username })
            .select('followersCount followers -_id')
            .populate({
                path : 'followers',
                select : FOLLOWER_USER_SAFE_DATA,
                options : { limit, skip}
            })
            .exec()

        if (!followers) {
            return res.status(404).json({
                message: "User not found."
            });
        }
            
        res.status(200).json({
            message : "Following users data fetch successfully",
            followers
        })

    } catch (error) {
        console.error("Error while fetching followers:", error);
        res.status(500).json({
            message: "An unexpected error occurred while fetching the followers.",
            error: error.message,
        });
    }
}


module.exports = { getProfile, getFollowingUsers, getFollowers};