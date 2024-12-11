const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    blogId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Blog',
        required : true,
    },
    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    message : {
        type : String,
        maxLength : 100,
        trim : true,
        required : true,
        validate: {
            validator: function (value) {
                return value.trim().length > 0;            
            },
            message: 'Message cannot be empty',
        },
    },
    createdAt : {
        type : Date,
        default : Date.now,
    }
}, 
{
    timestamps : true
});

commentSchema.index({blogId : 1, fromUserId : 1});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = {
    Comment
}