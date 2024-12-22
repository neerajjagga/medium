const bcrypt = require("bcrypt");
const { User } = require("../models/user.model");
const {
  validateSignupData,
  validateLoginData,
} = require("../utils/userValidation");
const {obfuscateEmail} = require('../utils/obfuscateEmail');

const signupUser = async (req, res) => {
  try {
    validateSignupData(req);
    const { name, username, emailId, password, bio } = req.body;

    // Check if a user already exists with this email or username
    const isUserPresent = await User.findOne({
      $or: [{ emailId: emailId }, { username: username }],
    });

    if (isUserPresent) {
      return res.status(409).json({
        success: false,
        message: "A user already exists with this email or username.",
      });
    }

    // Hash password
    const hassedPassword = bcrypt.hashSync(password, 10);

    // generate obfuscate email 
    const obfuscatedEmailId = obfuscateEmail(emailId);

    // Create new user and save
    const user = new User({
      name,
      username,
      emailId,
      obfuscatedEmailId,
      password: hassedPassword,
      bio,
    });

    await user.save();

    // Generate token
    const token = await user.getToken();

    res.cookie("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // Expires in 7 days
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: { ...user._doc, password: undefined , emailId : undefined},
    });

  } catch (error) {
    console.log(error);
    const statusCode = error.status || 500;
    res.status(statusCode).json({
      success: false,
      message : error.message,
    });
  }
};

const userLogin = async (req, res) => {
  try {
    validateLoginData(req);
    const { emailId, password, username } = req.body;

    // Check if email or username exists
    const user = await User.findOne({
      $or: [{ username }, { emailId }],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Match password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      }).select('-password');
    }

    // Generate JWT token
    const token = await user.getToken();
    res.cookie("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // Expires in 7 days
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: { ...user._doc, password: undefined, emailId : undefined },
    });
  } catch (error) {
    const statusCode = error.status || 500;
    res.status(statusCode).json({
      success: false,
      message : "Login failed",
      error: error.message,
    });
  }
};

const userLogout = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "You are already logged out.",
      });
    }

    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const checkAuth = (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { signupUser, userLogin, userLogout, checkAuth };
