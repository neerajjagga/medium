const bcrypt = require('bcrypt');
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
            return res.status(409).json({
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
        console.log(error);
        res.status(300).json({
            message : "Error coming while creating user",
            Error : error.message
        })
    }
}

const userLogin = async (req, res) => {
    try {
        validateLoginData(req);
        const {emailId, password, username} = req.body;

        // check if email or username exits or not
        const user = await User.findOne({
            $or : [
                {username},
                {emailId}
            ]
        });

        if(!user) {
            return res.status(300).json({
                messge : "Invalid credentials"
            })
        }
        // mathch password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            return res.status(400).json({
                message: `Invalid credentials`
            })
        }
        // if not generate jwt based on username and id
        const token = await user.getToken(); 
        console.log(token);

        res.cookie('token', token);
        res.status(200).json({
            message : "Login successfull"
        })

    } catch (error) {
        res.status().json({
            message : "Error coming while logging user",
            Error : error.message
        })
    }
}

module.exports = {signupUser, userLogin};