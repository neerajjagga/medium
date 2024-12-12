const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User} = require("../models/user.model");
const {validateSignupData, validateLoginData} = require("../utils/userValidation");


const signupUser = async(req, res) => {
    try {
        validateSignupData(req);
        const {name, username, emailId, password, bio,  profileUrl, } = req.body;

        // find if a user already exists with this username and password;
        const isUserPresent = await User.findOne({
            $or : [
                {emailId : emailId},
                {username : username}
            ]
        });
        if(isUserPresent) {
            res.status(409).end({
                message : "A user already exists with this email or username",
            });
        }

        // hash password
        const hassedPassword = bcrypt.hashSync(password, 10);

        // create new user and save 
        const user = new User({
            name, 
            username, 
            emailId, 
            password : hassedPassword, 
            bio, 
            profileUrl
        });

        await user.save();
        res.status(201).json({
            message : "User created successfully",
        })
    } catch (error) {
        res.status(300).json({
            message : "Error coming while creating user",
            Error : error.message
        })
    }
}

const userLogin = async (req, res) => {
    try {
        validateLoginData(req);
        const {emailId, password} = req.body;
        
    } catch (error) {
        
    }
}

module.exports = {signupUser, userLogin};