const { User } = require('../models/user.model');
const { getPagination } = require('../utils/pagination.utility');
const { validateProfileUpdateData } = require('../utils/userValidation');
const fs = require('fs');
const { uploadImageOnCloudinary } = require('../utils/cloudinary.utility');

const getProfile = async (req, res) => {
    try {
        // return the profile
        const username = req.params.username;

        if (!username) {
            return res.status(400).json({
                success: false,
                message: "Username parameter is required."
            })
        }

        // user safe data
        const USER_SAFE_DATA = "name username bio profileImgUrl followersCount followers followingCount _id createdAt"
        const FOLLOWING_USER_SAFE_DATA = "name username profileImgUrl followersCount bio -_id";

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
            .exec()

        if (!user) {
            return res.status(400).json({
                success: false,
                message: `User with username '${username}' not found.`
            })
        }

        // return the profile
        res.status(200).json({
            success: true,
            message: "User profile fetched successfully",
            user: user,
        })

    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({
            success: false,
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
                success: false,
                message: "Username parameter is required."
            })
        }

        // max 10 users data fetched at a time
        const { limit, skip } = getPagination(req, 10);

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
                success: false,
                message: `User with username '${username}' not found.`
            });
        }

        res.status(200).json({
            success: true,
            message: "Following users fetched successfully",
            users: followingUsers
        })

    } catch (error) {
        console.error("Error fetching following users:", error);
        res.status(500).json({
            success: false,
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
                success: false,
                message: "Username parameter is required."
            })
        }

        // max 10 users data fetched at a time
        const { limit, skip } = getPagination(req, 10);

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
                success: false,
                message: `User with username '${username}' not found.`
            });
        }

        res.status(200).json({
            success: true,
            message: "Followers users fetch successfully",
            data: followers
        })

    } catch (error) {
        console.error("Error while fetching followers:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching the followers.",
            error: error.message,
        });
    }
}

const updateProfile = async (req, res) => {
    try {
        validateProfileUpdateData(req);

        const loggedInUser = req.user;
        const { name, username, bio } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (username) {
            // check the user is not updating the older username
            if (loggedInUser.username === username) {
                return res.status(400).json({
                    success: false,
                    message: "Username can't be same as the previous one",
                })
            }
            // check if the username is available or not
            const isUserWithUsername = await User.findOne({ username });
            if (isUserWithUsername) {
                return res.status(400).json({
                    success: false,
                    message: "Username not available"
                })
            }
            updateData.username = username;
        }
        if (bio) updateData.bio = bio;

        if (req.file) {
            try {
                const FOLDER_NAME = "profile-images"
                const response = await uploadImageOnCloudinary(req.file.path, FOLDER_NAME);

                fs.unlinkSync(req.file.path);

                updateData.profileImgUrl = response.secure_url;

            }
            catch (error) {
                console.log("Error coming while uploading image");

                if(req.file && req.file.path) {
                    fs.unlinkSync(req.file.path);
                }

                return res.status(500).json({
                    success: false,
                    message: 'Failed to upload file',
                    error: error.message,
                });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            { _id: loggedInUser._id }, 
            updateData, 
            { new: true }
        ).select('-password');

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser,
        })

    } catch (error) {
        const statusCode = error.status || 500;
        console.error("Error while updating profile:", error);

        // check if the file is not in our local disk in case of any error
        if (req.file && req.file.path) {
            fs.unlinkSync(req.file.path);
        }

        res.status(statusCode).json({
            success: false,
            message: "An error occurred while updating the profile.",
            error: error.message,
        });
    }
}

module.exports = { getProfile, getFollowingUsers, getFollowers, updateProfile };