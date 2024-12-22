const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { User } = require("../models/user.model");

dotenv.config();
const jwt_secret_key = process.env.JWT_SECRET_KEY;

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token missing. Please login.",
      });
    }
    // decode token to get the user _id
    let decodedObj;
    try {
      decodedObj = jwt.verify(token, jwt_secret_key);
    } catch (err) {
      const message =
        err.name === "TokenExpiredError"
          ? "Token expired. Please login again."
          : "Invalid token. Authentication failed.";
      return res.status(401).json({
        success: false,
        message,
      });
    }
    const { _id } = decodedObj;
    if (!_id) {
      return res.status(400).json({
        success: false,
        message: "Token payload is invalid. User ID is missing.",
      });
    }

    // find user with this user _id
    const user = await User.findById({ _id }).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please login again.",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

module.exports = { userAuth };
