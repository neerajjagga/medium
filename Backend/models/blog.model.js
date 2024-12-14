const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    title : {
        type : String,
        required : true,
        trim : true,
        minLength : 10,
        maxLength : 50,
    },
    titleSlug : {
        type : String,
        trim : true,
    },
    subtitle : {
        type : String,
        default : "",
        trim : true,
        maxLength : 100,
    },
    content : {
        type : String,
        required : true,
        maxLength : 3000,
        trim : true,
    },
    thumbnail : {
        type : String,
        default : "https://www.contentviewspro.com/wp-content/uploads/2017/07/default_image.png",
    },
    claps : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
    }],
    clapCount : {
        type : Number,
        default : 0
    },
    postResponses : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Comment'
    }],
    postResponseCount : {
        type : Number,
        default : 0
    },
    visibility : {
        type : String,
        enum : ["locked", "unlocked"],
        default : "unlocked",
        trim : true,
    },
    topics : {
        type : [String],
        validate : {
            validator : function(arr) {
                return arr.length <= 5;
            },
            message : "You can maximum add 5 topics"
        },
    },
    readingTime : {
        type : Number,
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