const bcrypt = require('bcrypt');
const { User } = require("../models/user.model");
const { validateSignupData, validateLoginData } = require("../utils/userValidation");


const signupUser = async (req, res) => {
    try {
        validateSignupData(req);
        const { name, username, emailId, password, bio, profileImgUrl } = req.body;

        // find if a user already exists with this username and password;
        const isUserPresent = await User.findOne({
            $or: [
                { emailId: emailId },
                { username: username }
            ]
        });

        if (isUserPresent) {
            return res.status(409).json({
                success : false,
                message: "A user already exists with this email or username",
            });
        }

        // hash password
        const hassedPassword = bcrypt.hashSync(password, 10);

        // create new user and save 
        const user = new User({
            name,
            username,
            emailId,
            password: hassedPassword,
            bio,
            profileImgUrl,
        });

        await user.save();

        // generate token
        const token = await user.getToken();
        res.cookie('token', token, { httpOnly: true, sameSite: 'strict' });

        res.status(201).json({
            success : true,
            message: "User created successfully",
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message: "Error occurred while creating user",
            Error: error.message
        })
    }
}

const userLogin = async (req, res) => {
    try {
        validateLoginData(req);
        const { emailId, password, username } = req.body;

        // check if email or username exits or not
        const user = await User.findOne({
            $or: [
                { username },
                { emailId }
            ]
        });

        if (!user) {
            return res.status(401).json({
                success : false,
                message: "Invalid credentials"
            })
        }
        // mathch password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success : false,
                message: `Invalid credentials`
            })
        }
        // if not generate jwt based on username and id
        const token = await user.getToken();

        res.cookie('token', token, { httpOnly: true, sameSite: 'strict' });
        res.status(200).json({
            success : true,
            message: "Login successfull"
        })

    } catch (error) {
        res.status(500).json({
            success : false,
            message: "Error coming while logging user",
            Error: error.message
        })
    }
}

const userLogout = async (req, res) => {
    try {

        const { token } = req.cookies;
        if (!token) {
            return res.status(400).json({
                success : false,
                message: "You are already logged out"
            })
        }

        res.clearCookie('token', { httpOnly: true, sameSite: 'strict' });

        res.status(200).json({
            success : true,
            message: "Logout successfull"
        })

    } catch (error) {
        res.status(500).json({
            success : false,
            message: "Error coming while logging out user",
            Error: error.message
        })
    }
}

module.exports = { signupUser, userLogin, userLogout };