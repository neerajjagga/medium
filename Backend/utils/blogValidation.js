const validator = require('validator');

const validateCreateBlogData = (req) => {
  const { title, content, thumbnail, visibility, tags } = req.body;

  if (!title || !content || !tags) {
    throw { status: 400, message: "Title, content, or tags cannot be empty" };
  }
  if (title.length < 10 || title.length > 50) {
    throw { status: 400, message: "Title length is invalid, it should be between 10-50 characters" };
  }
  if (content.length < 1 || content.length > 5000) {
    throw { status: 400, message: "Content length should be between 1-5000 characters" };
  }
  if (thumbnail && !validator.isURL(thumbnail)) {
    throw { status: 400, message: "Thumbnail URL is not valid" };
  }
  if (visibility && !["locked", "unlocked"].includes(visibility.trim())) {
    throw { status: 400, message: 'Visibility is invalid. It must be either "locked" or "unlocked".' };
  }
  if (tags.length > 5) {
    throw { status: 400, message: "Maximum tags allowed: 5" };
  }
};


const validateCommentData = (req) => {
    const { message } = req.body;
    if (!message) {
      throw { status: 400, message: "Comment cannot be empty" };
    }
    if (message.length < 1 || message.length > 100) {
      throw { status: 400, message: "Comment length is invalid, it should be between 1-100 characters" };
    }
};
  

module.exports = {validateCreateBlogData, validateCommentData}