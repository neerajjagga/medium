const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const {User} = require('../models/user.model');

dotenv.config();
const jwt_secret_key = process.env.JWT_SECRET_KEY;

const userAuth = async(req, res, next) => {
    try {
        const {token} = req.cookies;
        if(!token) {
            throw new Error("Token not valid -> relogin");
        }
        // decode token to get the user _id
        const decodedObj = jwt.verify(token, jwt_secret_key);
        const {_id} = decodedObj;

        // find user with this user _id
        const user = await User.findById({_id}).select('-password');
        if(!user) {
            throw new error("User not found -> relogin");
        }        
        req.user = user;
        next();
    } catch (error) {
        return res.status(400).json({
            message : "Error coming while creating blog",
            Error : error.message
        })
    }
}

module.exports = {userAuth}