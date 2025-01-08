const { User } = require("../models/user.model");
const { getPagination } = require("../utils/pagination.utility");
const { validateProfileUpdateData } = require("../utils/userValidation");
const fs = require("fs");
const { uploadImageOnCloudinary, deleteImageOnCloudinary } = require("../utils/cloudinary.utility");

const getProfile = async (req, res) => {
  try {
    // return the profile
    const username = req.params.username;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Username parameter is required.",
      });
    }

    // user safe data
    const USER_SAFE_DATA =
      "name username bio profileImgUrl followersCount followers followingCount _id createdAt";
    const FOLLOWING_USER_SAFE_DATA =
      "name username profileImgUrl followersCount bio _id";
    const BLOG_SAFE_DATA =
      "title titleSlug subtitle thumbnailUrl content clapCount postResponseCount readingTime publishAt -_id";

    // first only fetch first 5 following user
    const limit = 5;
    const skip = 0;

    // find user with username
    const user = await User.findOne({ username })
      .select(USER_SAFE_DATA)
      .populate({
        path: "following",
        select: FOLLOWING_USER_SAFE_DATA,
        options: { limit: limit, skip: skip },
      })
      .populate({
        path: "blogs",
        select: BLOG_SAFE_DATA,
        options: { limit: 10, sort: { publishAt: -1 } },
      })
      .exec();

    if (!user) {
      return res.status(403).json({
        success: false,
        message: `User with username '${username}' not found.`,
      });
    }

    // return the profile
    res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      user: user,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the profile.",
      error: error.message,
    });
  }
};

const getFollowingUsers = async (req, res) => {
  try {
    const username = req.params.username;
    const FOLLOWING_USER_SAFE_DATA = "name username profileImgUrl bio _id";

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Username parameter is required.",
        allUsersFetched: false,
      });
    }

    // max 10 users data fetched at a time
    const { limit, skip } = getPagination(req, 10);

    // extract following users data
    const followingUsersData = await User.findOne({ username })
      .select("following -_id")
      .populate({
        path: "following",
        select: FOLLOWING_USER_SAFE_DATA,
        options: { limit, skip },
      })
      .exec();

    if (!followingUsersData) {
      return res.status(400).json({
        success: false,
        message: `User with username '${username}' not found.`,
      });
    }

    res.status(200).json({
      success: true,
      message: null,
      users: followingUsersData.following,
      allUsersFetched: followingUsersData.following.length < limit,
    });
  } catch (error) {
    console.error("Error fetching following users:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the following users.",
      error: error.message,
    });
  }
};

const getFollowers = async (req, res) => {
  try {
    const username = req.params.username;
    const FOLLOWER_USER_SAFE_DATA = "name username profileImgUrl bio _id";

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Username parameter is required.",
        allUsersFetched: false,
      });
    }

    // max 10 users data fetched at a time
    const { limit, skip } = getPagination(req, 10);

    // extract followers users data
    const followersUsersData = await User.findOne({ username })
      .select("followers -_id")
      .populate({
        path: "followers",
        select: FOLLOWER_USER_SAFE_DATA,
        options: { limit, skip },
      })
      .exec();

    if (!followersUsersData) {
      return res.status(400).json({
        success: false,
        message: `User with username '${username}' not found.`,
      });
    }

    res.status(200).json({
      success: true,
      message: null,
      users: followersUsersData.followers,
      allUsersFetched: followersUsersData.followers.length < limit,
    });
  } catch (error) {
    console.error("Error while fetching followers:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the followers.",
      error: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    validateProfileUpdateData(req);

    const loggedInUser = req.user;
    const { name, username, bio } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (username !== loggedInUser.username) {
      // check if the username is available or not
      const isUserWithUsername = await User.findOne({ username });
      if (isUserWithUsername) {
        return res.status(400).json({
          success: false,
          message: "Username not available",
        });
      }
      updateData.username = username;
    }
    updateData.bio = bio;

    if (req.file) {
      try {
        const FOLDER_NAME = "profile-images";
        const response = await uploadImageOnCloudinary(
          req.file.path,
          FOLDER_NAME
        );

        fs.unlinkSync(req.file.path);

        updateData.profileImgUrl = response.secure_url;
      } catch (error) {
        console.log("Error coming while uploading image", error);

        if (req.file && req.file.path) {
          fs.unlinkSync(req.file.path);
        }

        return res.status(500).json({
          success: false,
          message: "Failed to upload file",
          error: error.message,
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      { _id: loggedInUser._id },
      updateData,
      { new: true }
    ).select("-password");

    // delete user old profile image if it exists
    if(loggedInUser.profileImgUrl.includes('https://res.cloudinary.com') && req.file){
      await deleteImageOnCloudinary(loggedInUser.profileImgUrl);
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    const statusCode = error.status || 500;
    console.error("Error while updating profile:", error);

    // check if the file is not in our local disk in case of any error
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getProfile, getFollowingUsers, getFollowers, updateProfile };
