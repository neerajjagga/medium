const express = require('express');
const {getProfile, getFollowingUsers, getFollowers, updateProfile} = require('../controllers/profile.controller');
const { userAuth } = require('../middlewares/userAuth.middleware');
const multer  = require('multer');
const profileRouter = express.Router();


const storage = multer.diskStorage({
    destination : function(req, file, cb) {
        cb(null, './uploads/profile-images');
    },
    filename : function(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
})

const upload = multer({ storage });

profileRouter.patch('/edit', userAuth, upload.single('profileImage'), updateProfile);
profileRouter.get('/@:username', userAuth, getProfile);
profileRouter.get('/@:username/following', userAuth, getFollowingUsers);
profileRouter.get('/@:username/followers', userAuth, getFollowers);

module.exports = {profileRouter};