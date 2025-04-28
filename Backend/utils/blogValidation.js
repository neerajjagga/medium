const validateCreateBlogData = (req) => {
  const { title, subTitle, content, visibility, tags } = req.body;
  console.log(title);

  if (!title || title.length < 10 || title.length > 50) {
    throw {
      status: 400,
      message: "Title is required and must be between 10-50 characters.",
    };
  }

  if (subTitle && subTitle?.length > 150) {
    throw {
      status: 400,
      message: "Subtitle length should be between 1-150 characters.",
    };
  }

  if (!content || content.length < 1 || content.length > 5000) {
    throw {
      status: 400,
      message: "Content is required and should be between 1-5000 characters.",
    };
  }

  if (visibility && !["locked", "unlocked"].includes(visibility.trim())) {
    throw {
      status: 400,
      message: 'Visibility is invalid. It must be either "locked" or "unlocked".',
    };
  }

  if (!tags || typeof tags !== "string") {
    throw { status: 400, message: "Tags are required and must be a string." };
  }

  const tagsArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);

  if (!Array.isArray(tagsArray)) {
    throw { status: 400, message: "Tags should be an array after splitting." };
  }
  if (tagsArray.length > 5) {
    throw { status: 400, message: "Maximum 5 tags are allowed." };
  }

  if (req.file) {
    const validMimeTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validMimeTypes.includes(req.file.mimetype)) {
      throw {
        status: 400,
        message: "Invalid file type: only JPEG, PNG, or GIF images are allowed.",
      };
    }
    if (req.file.size > 10 * 1024 * 1024) {
      throw {
        status: 400,
        message: "File is too large. Maximum allowed size is 10 MB.",
      };
    }
  }
};

const validateCommentData = (req) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    throw { status: 400, message: "Comment cannot be empty." };
  }

  if (message.length < 1 || message.length > 100) {
    throw {
      status: 400,
      message: "Comment length must be between 1-100 characters.",
    };
  }
};

module.exports = { validateCreateBlogData, validateCommentData };
