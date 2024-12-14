const validator = require('validator');

const validateCreateBlogData = (req) => {
    // required fields -> title, content
    const {title, subtitle, content, thumbnail, visibility, topics} = req.body;
    if(!title || !content) {
        throw new Error("Title or content cannot be empty");
    }
    else if(title.length < 10 || title.length > 50) {
        throw new Error("Title length is invalid, it should be in between 10-50")
    }
    else if(subtitle && (subtitle.length > 100 || subtitle.length < 1)) {
        throw new Error("Subtitle length is invalid, it should be in between 1-100")
    }
    else if(content.length < 1 || content.length > 3000) {
        throw new Error("Content length should be in between 1-3000 range")
    }
    else if(thumbnail && !validator.isURL(thumbnail)) {
        throw new Error("Thumbnail url is not valid");
    }
    else if (visibility && !["locked", "unlocked"].includes(visibility.trim())) {
        throw new Error('Visibility is invalid. It must be either "locked" or "unlocked".');
    }
    else if(topics && topics.length > 5) {
        throw new Error("Maximum topics allowed : 5");
    }
}

const validateCommentData = (req) => {
    const {message} = req.body;
    if(!message) {
        throw new Error("Comment cannot be empty");
    }
    else if(message.length < 1 || message.length > 100) {
        throw new Error("Comment length is invalid, it is in between 1-100");
    }
}

module.exports = {validateCreateBlogData, validateCommentData}