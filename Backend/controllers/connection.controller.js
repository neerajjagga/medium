const {User} = require('../models/user.model')

const followUser = async(req, res) => {
    try {
        const loggedInUser = req.user;
        const userToFollowUsername = req.params.username;

        if(loggedInUser.username === userToFollowUsername) {
            return res.status(400).json({
                message : "You cannot follow yourself"
            })
        }

        // find the user
        const userToFollow = await User.findOne({username : userToFollowUsername});
        if(!userToFollow) {
            return res.status(404).json({
                message : "Invaid username"
            })
        }

        if (loggedInUser.following.includes(userToFollow._id)) {
            return res.status(400).json({
                message: `You are already following ${userToFollowUsername}.`
            });
        }
        // if not make connection between them

        // update following array of loggedInUser
        await User.findByIdAndUpdate(loggedInUser._id, {
            $addToSet: { following: userToFollow._id }, // prevent duplicate
            $inc: { followingCount: 1 }
        });

        // update followers array of userToFollow
         await User.findOneAndUpdate({username : userToFollowUsername}, {
            $addToSet: { followers: loggedInUser._id }, // Prevent duplicate 
            $inc: { followersCount: 1 }
        });

        res.status(200).json({
            message : `You are now following ${userToFollowUsername}`
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            message : `Error coming while following ${userToFollowUsername}`,
            Error : error
        })
    }
}

const unfollowUser = async(req, res) => {
    try {
        const loggedInUser = req.user;
        const usernameToUnfollow = req.params.username;

        if(loggedInUser.username === usernameToUnfollow) {
            return res.status(400).json({
                message : "You can't unfollow yourself"
            })
        }

        // check is the user valid or not
        const user = await User.findOne({username : usernameToUnfollow});
        if(!user) {
            return res.status(404).json({
                message : "Invaid username"
            })
        }

        // check if user is following or not
        const isFollowing = loggedInUser.following.includes(user._id);
        if(!isFollowing) {
            return res.status(400).json({
                message : `You can't unfollow ${usernameToUnfollow} because you are not following him/her`
            })
        }

        // if isFollowing then remove and update the loggedInUser
        await User.findByIdAndUpdate(loggedInUser._id, {
            $pull : {following : user._id},
            $inc : {followingCount : -1}
        }, 
        { new : true });

        // also update the userId
        await User.findOneAndUpdate({_id : user._id}, {
            $pull : {followers : loggedInUser._id},
            $inc : {followersCount : -1}
        }, { new : true });

        res.status(200).json({
            message : `You successfully unfollowed ${usernameToUnfollow}`
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message : `Error coming while unfollowing ${usernameToUnfollow}`,
            Error : error.message
        })
    }
}

module.exports = {followUser, unfollowUser}