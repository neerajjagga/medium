const {User} = require('../models/user.model')

const followUser = async(req, res) => {
    try {
        const loggedInUser = req.user;
        const userToFollowId = req.params.userId;

        if(loggedInUser._id.toString() === userToFollowId) {
            return res.status(400).json({
                message : "You cannot follow yourself"
            })
        }

        // find the user
        const userToFollow = await User.findById(userToFollowId);
        if(!userToFollow) {
            return res.status(404).json({
                message : "Invaid user ID provided"
            })
        }

        if (loggedInUser.following.includes(userToFollowId)) {
            return res.status(400).json({
                message: `You are already following ${userToFollow.username}.`
            });
        }
        // if not make connection between them

        // update following array of loggedInUser
        await User.findByIdAndUpdate(loggedInUser._id, {
            $addToSet: { following: userToFollowId }, // prevent duplicate
            $inc: { followingCount: 1 }
        });

        // update followers array of userToFollow
         await User.findByIdAndUpdate(userToFollowId, {
            $addToSet: { followers: loggedInUser._id }, // Prevent duplicate 
            $inc: { followersCount: 1 }
        });

        res.status(200).json({
            message : `You are now following ${userToFollowId}`
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            message : "Error coming while following a user",
            Error : error
        })
    }
}

const unfollowUser = async(req, res) => {
    try {
        const loggedInUser = req.user;
        const userId = req.params.userId;

        // check is the user valid or not
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({
                message : "Invaid user Id provided"
            })
        }

        // check if user is following or not
        const isFollowing = loggedInUser.following.includes(userId);
        if(!isFollowing) {
            return res.status(400).json({
                message : `You cannot unfollow ${loggedInUser.username} because you are not following him/her`
            })
        }

        // if isFollowing then remove and update the loggedInUser
        await User.findByIdAndUpdate(loggedInUser._id, {
            $pull : {following : userId},
            $inc : {followingCount : -1}
        }, 
        { new : true });

        // also update the userId
        await User.findByIdAndUpdate(userId, {
            $pull : {followers : loggedInUser._id},
            $inc : {followersCount : -1}
        }, { new : true });

        res.status(200).json({
            message : `You successfully unfollowed ${user.username}`
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message : "Error coming while unfollowing a user",
            Error : error.message
        })
    }
}

module.exports = {followUser, unfollowUser}