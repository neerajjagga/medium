const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name : {
        type : String,
        required : true,
        minLength : 3,
        maxLength : 25,
        trim : true,
    },
    username : {
        type : String,
        required : true,
        unique : true,
        minLength : 5,
        maxLength : 15,
        trim : true,
    },
    emailId : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true,
        minLength : 16,
        maxLength : 40,
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "Please enter a valid email address", 
        ],
    },
    password : {
        type : String,
        required : true,
        minLength : 8,
        trim : true,
    },
    bio : {
        type : String,
        default : "",
        maxLength : 200,
        trim : true,
    },
    profileUrl : {
        type : String,
        default : "defaultProfileIcon",
    },
    followers : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }],
    following : [{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    createdAt : {
        type : Date,
        default : Date.now,
    },
}, 
{
    timestamps : true
});

const User = new mongoose.model('User', userSchema);

module.exports = {
    User
}