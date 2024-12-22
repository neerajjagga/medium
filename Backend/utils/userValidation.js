const validator = require("validator");

const validateSignupData = (req) => {
  const { name, username, emailId, password, bio } = req.body;
  if (!name || !username || !emailId || !password) {
    throw ({status : 400, message : "Fields name, username, emailId and password cannot be empty!"});
  }
  if (name.length < 3 || name.length > 25) {
    throw ({status : 400, message : "Name should be in between 3-25!"});
  } 
  if (username.length < 5 || username.length > 15) {
    throw ({status : 400, message : "Username should be in between 5-15!"});
  } 
  if (!validator.isEmail(emailId)) {
    throw ({status : 400, message : "Enter valid emailId!"});
  } 
  if (!validator.isStrongPassword(password)) {
    throw ({status : 400, message : "Enter strong password!"});
  } 
  if (bio && bio.length > 200) {
    throw ({status : 400, message : "Bio cannot exceed 200 characters!"});
  }
};

const validateLoginData = (req) => {
  const { emailId, username, password } = req.body;
    if (!password) {
      throw { status: 400, message: "Password cannot be empty!" };
    }
    if (!emailId && !username) {
      throw { status: 400, message: "Provide either emailId or username!" };
    }
};

const validateProfileUpdateData = (req) => {
  const {name, username, bio, profileImgUrl} = req.body;
  if(!name && !username && !bio && !profileImgUrl) {
    throw ({status : 400, message :"At least one field (name, username, bio or profileImgUrl) must be provided for update."});
  }
  if (name && (name.length < 3 || name.length > 25)) {
    throw ({status : 400, message : "Name should be in between 3-25!"});
  } 
  if (username && (username.length < 5 || username.length > 15)) {
    throw ({status : 400, message : "Username should be in between 5-15!"});
  } 
  if (bio && bio.length > 200) {
    throw ({status : 400, message : "Bio cannot exceed 200 characters!"});
  } 
  if (profileImgUrl && !validator.isURL(profileImgUrl)) {
    throw ({status : 400, message : "Please enter valid image URL"});
  }
}

module.exports = { validateSignupData, validateLoginData, validateProfileUpdateData };
