const { User } = require('../models/user.model');
const { getPagination } = require('../utils/pagination.utility');

const getProfile = async (req, res) => {
    try {
        // return the profile
        const loggedInUser = req.user;
        const username = req.params.username;

        if (!username) {
            return res.status(400).json({
                success : false,
                message: "Username parameter is required."
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
                options: { limit: limit, skip: skip }
            })
            .populate('blogs', BLOG_SAFE_DATA)
            .exec()

        if (!user) {
            return res.status(404).json({
                success : false,
                message: `User with username '${username}' not found.`
            })
        }

        // return the profile
        res.status(200).json({
            success : true,
            message : "User profile fetched successfully",
            data : user,
        })

    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({
            success : false,
            message: "An error occurred while fetching the profile.",
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
                success : false,
                message: "Username parameter is required."
            })
        }

        // max 10 users data fetched at a time
        const { limit, skip } = getPagination(req, 15);

        // extract following users data
        const followingUsers = await User
            .findOne({ username })
            .select('followingCount following -_id')
            .populate({
                path: 'following',
                select: FOLLOWING_USER_SAFE_DATA,
                options: { limit, skip }
            })
            .exec()

        if (!followingUsers) {
            return res.status(404).json({
                success : false,
                message: `User with username '${username}' not found.`
            });
        }

        res.status(200).json({
            success : true,
            message: "Following users fetched successfully",
            data : followingUsers
        })

    } catch (error) {
        console.error("Error fetching following users:", error);
        res.status(500).json({
            success : false,
            message: "An error occurred while fetching the following users.",
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
                success : false,
                message: "Username parameter is required."
            })
        }

        // max 10 users data fetched at a time
        const { limit, skip } = getPagination(req, 15);

        // extract followers users data
        const followers = await User
            .findOne({ username })
            .select('followersCount followers -_id')
            .populate({
                path: 'followers',
                select: FOLLOWER_USER_SAFE_DATA,
                options: { limit, skip }
            })
            .exec()

        if (!followers) {
            return res.status(404).json({
                success : false,
                message: `User with username '${username}' not found.`
            });
        }

        res.status(200).json({
            success : true,
            message: "Followers users fetch successfully",
            data : followers
        })

    } catch (error) {
        console.error("Error while fetching followers:", error);
        res.status(500).json({
            success : false,
            message: "An error occurred while fetching the followers.",
            error: error.message,
        });
    }
}


module.exports = { getProfile, getFollowingUsers, getFollowers };