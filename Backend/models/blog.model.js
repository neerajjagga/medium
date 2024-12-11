const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    title : {
        type : String,
        required : true,
        trim : true,
        minLength : 10,
        maxLength : 50,
    },
    subtitle : {
        type : String,
        default : "",
        trim : true,
        maxLength : 50,
    },
    content : {
        type : String,
        required : true,
        maxLength : 3000,
        trim : true,
    },
    thumbnail : {
        type : String,
        default : "",
    },
    clapCount : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
    }],
    postResponses : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Comments'
    }],
    visibility : {
        type : String,
        enum : ["locked", "unlocked"],
        trim : true,
    },
    tags : {
        type : [String],
        validate : {
            validator : function (arr) {
                return arr.length <= 10;
            },
            message : "You can add max 10 tags"
        }
    },
    readingTime : {
        type : Number,
        required : true,
    },
    creater : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
    },
    publishAt : {
        type : Date,
        default : Date.now,
    },
}, 
{
    timestamps : true
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = {
    Blog
}