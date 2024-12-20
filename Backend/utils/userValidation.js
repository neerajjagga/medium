const validator = require('validator');

const validateSignupData = (req) => {
    const { name, username, emailId, password, bio, profileImgUrl } = req.body;
    if (!name || !username || !emailId || !password) {
        throw new Error("Fields name, username, emailId and password cannot be empty");
    }
    else if (name.length < 3 || name.length > 25) {
        throw new Error("Name should be inbetween 3-25");
    }
    else if (username.length < 5 || username.length > 15) {
        throw new Error("username should be inbetween 5-15");
    }
    else if (!validator.isEmail(emailId)) {
        throw new Error("Enter valid emailId");
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("Enter strong password");
    }
    else if (bio && bio.length > 200) {
        throw new Error("Bio cannot exceed 200 characters");
    }
    else if (profileImgUrl && !validator.isURL(profileImgUrl)) {
        throw new Error("Enter valid profile url");
    }
}

const validateLoginData = (req) => {
    const { emailId, username, password } = req.body;
    if (emailId && !emailId || !password) {
        throw new Error("emailId and password cannot be empty");
    }
    else if (username && !username || !password) {
        throw new Error("username and password cannot be empty");
    }
}

module.exports = { validateSignupData, validateLoginData };