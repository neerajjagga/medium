<<<<<<< HEAD
const bcrypt = require('bcrypt');
=======
const bcrypt = require("bcrypt");
>>>>>>> e6d5e83 (Frontend Added!)
const { User } = require("../models/user.model");
const {
  validateSignupData,
  validateLoginData,
} = require("../utils/userValidation");

const signupUser = async (req, res) => {
  try {
    validateSignupData(req);
    const { name, username, emailId, password, bio } = req.body;

    // find if a user already exists with this username and password;
    const isUserPresent = await User.findOne({
      $or: [{ emailId: emailId }, { username: username }],
    });

<<<<<<< HEAD
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
=======
    if (isUserPresent) {
      return res.status(400).json({
        message: "A user already exists with this email or username!",
        success: false,
      });
>>>>>>> e6d5e83 (Frontend Added!)
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
    });

    await user.save();

    // generate token
    const token = await user.getToken();
    res.cookie("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // Expires in 7 days
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });

    res.status(201).json({
      message: "User created successfully",
      user: { ...user._doc, password: undefined },
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const userLogin = async (req, res) => {
  try {
    validateLoginData(req);
    const { emailId, password, username } = req.body;

    // check if email or username exits or not
    const user = await User.findOne({
      $or: [{ username }, { emailId }],
    });

<<<<<<< HEAD
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
=======
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
        success: false,
      });
>>>>>>> e6d5e83 (Frontend Added!)
    }
    // mathch password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: `Invalid credentials`,
        success: false,
      });
    }
    // if not generate jwt based on username and id
    const token = await user.getToken();

    res.cookie("token", token);
    res.status(200).json({
      message: "Login successfull",
      user: { ...user._doc, password: undefined },
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const userLogout = async (req, res) => {
<<<<<<< HEAD
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
=======
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(400).json({
        message: "You were already logout",
        success: false,
      });
>>>>>>> e6d5e83 (Frontend Added!)
    }

    res.clearCookie("token", {
      maxAge: 7 * 24 * 60 * 60 * 1000, // Expires in 7 days
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });

    res.status(200).json({
      message: "Logout successfull",
      success: true,
    });
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
  }
};

const checkAuth = (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
  }
};

module.exports = { signupUser, userLogin, userLogout, checkAuth };
