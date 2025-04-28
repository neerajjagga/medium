const slugify = require("slugify");
const { customAlphabet } = require("nanoid");
const { Blog } = require("../models/blog.model");
const { Comment } = require("../models/comment.model");
const { User } = require("../models/user.model");
const {
  validateCreateBlogData,
  validateCommentData,
} = require("../utils/blogValidation");
const {
  uploadImageOnCloudinary,
  deleteImageOnCloudinary,
} = require("../utils/cloudinary.utility");
const { getPagination } = require("../utils/pagination.utility");

const createBlog = async (req, res) => {
  try {
    validateCreateBlogData(req);

    const {
      title,
      subTitle,
      content,
      htmlContent,
      jsonContent,
      visibility,
      tags,
    } = req.body;

    if (!title || !content || !htmlContent || !jsonContent) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: title, content, htmlContent, jsonContent",
      });
    }

    let parsedJsonContent;
    try {
      parsedJsonContent = JSON.parse(jsonContent);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid JSON content",
        error: err.message,
      });
    }

    const creatorId = req.user?._id;

    // Generate reading time
    const averageWordsPerMinute = 255;
    const wordCount = content.trim().split(/\s+/).length; // handles multiple spaces
    const estimatedReadTime = Math.ceil(wordCount / averageWordsPerMinute);

    // Generate slug for the title
    const titleSlug = slugify(title, { lower: true, strict: true });
    const nanoid = customAlphabet("1234567890abcdef", 10);
    const uniqueId = nanoid();
    const finalSlug = `${titleSlug}-${uniqueId}`;

    // Generate slugs for tags
    const slugifyTags = (tags || "")
      .replace(/#/g, "")
      .split(",")
      .map((tag) => slugify(tag.trim(), { lower: true, strict: true }));

    // If subTitle is not given, generate from content
    let finalSubTitle = subTitle;
    if (!finalSubTitle) {
      finalSubTitle = content.length <= 150
        ? content
        : content.slice(0, 150).trim() + "...";
    }

    // Default thumbnail
    let secure_url = "/assets/media/thumbnail.png";

    // Handle file upload if exists
    if (req.file) {
      const FOLDER_NAME = "thumbnail-images";
      try {
        const response = await uploadImageOnCloudinary(req.file.path, FOLDER_NAME);
        secure_url = response.secure_url;
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError);

        return res.status(500).json({
          success: false,
          message: "Failed to upload image, try again later",
          error: uploadError.message,
        });
      }
    }

    // Create a new Blog instance
    const blog = new Blog({
      title,
      titleSlug: finalSlug,
      subtitle: finalSubTitle,
      content,
      htmlContent,
      jsonContent: parsedJsonContent,
      thumbnailUrl: secure_url,
      visibility,
      tags: slugifyTags,
      readingTime: estimatedReadTime,
      creator: creatorId,
    });

    await blog.save();

    // Push blog ID to user's blogs array
    await User.findByIdAndUpdate(
      creatorId,
      { $push: { blogs: blog._id } },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog,
    });

  } catch (error) {
    console.error("Error while creating blog:", error);

    const statusCode = error.status || 500;

    res.status(statusCode).json({
      success: false,
      message: "Blog not created",
      error: error.message,
    });
  }
};

const clapBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const userId = req.user?._id;

    // validateBlogId
    const blog = await Blog.findById({ _id: blogId });
    if (!blog) {
      return res.status(400).json({
        success: false,
        message: "Blog not found",
      });
    }

    const clapArray = blog.claps;

    // check if a user has already clapped
    if (clapArray.includes(userId)) {
      return res.status(409).json({
        success: false,
        message: "You have already clapped",
      });
    }

    // if user not clapped already then
    clapArray.push(userId);
    blog.clapCount++;
    await blog.save();

    res.status(201).json({
      message: "Blog clapped successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error coming while clapping a blog",
      Error: error.message,
    });
  }
};

const addComment = async (req, res) => {
  try {
    validateCommentData(req);
    const { message } = req.body;
    const userId = req.user?._id;
    const blogId = req.params.blogId;

    // validateBlogId
    const blog = await Blog.findById({ _id: blogId });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const comment = new Comment({
      blogId: blogId,
      fromUserId: userId,
      message,
    });

    await comment.save();

    const commentsArrayOfBlog = blog.postResponses;
    commentsArrayOfBlog.push(comment._id);
    blog.postResponseCount++;
    await blog.save();

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
    });
  } catch (error) {
    const statusCode = error.status || 500;
    res.status(statusCode).json({
      success: false,
      message: "Error coming while commenting a blog",
      Error: error.message,
    });
  }
};

const editComment = async (req, res) => {
  try {
    validateCommentData(req);
    const { message } = req.body;
    const userId = req.user?._id;
    const commentId = req.params.commentId;

    // validate is comment valid as well as is the comment is written by the current user
    const comment = await Comment.findOne({
      $and: [{ _id: commentId }, { fromUserId: userId }],
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "comment not found or not written by you",
      });
    }

    comment.message = message;
    await comment.save();

    res.status(200).json({
      success: true,
      message: "Comment Edited successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error coming while editing a comment",
      Error: error.message,
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    const userId = req.user?._id;
    const blogId = req.params.blogId;
    const commentId = req.params.commentId;

    // validate the commemt is present or not
    const comment = await Comment.findOneAndDelete({
      $and: [{ _id: commentId }, { fromUserId: userId }],
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "comment not found or not written by you",
      });
    }

    // then update the blog postResponseCount and delete the commentId from the array
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { postResponses: commentId }, // pop out the deleted CommentId
        $inc: { postResponseCount: -1 }, // decrement the postResponse count
      },
      {
        new: true,
      }
    );

    res.status(204).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error coming while editing a comment",
      Error: error.message,
    });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const blogId = req.params.blogId;

    // if we have deleted the blog then
    // -> delete the blog
    // -> delete all the comments realted to that blog
    // -> pull the object id of the blog from the user schema
    // -> delete the image from cloudinary

    // find and delete the blog
    const blog = await Blog.findOneAndDelete({
      _id: blogId,
      creator: loggedInUser._id,
    });

    // if blog not found
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found or you're not authorized to delete this blog",
      });
    }

    // delete all the comments related to that blog
    await Comment.deleteMany({ blogId });

    // pull the object id of blog from user blogs array
    await User.findByIdAndUpdate(
      { _id: loggedInUser._id },
      {
        $pull: { blogs: blogId },
      }
    );

    // delete the thubhnail image from the cloudinary if the thumbnail url exists
    if (blog.thumbnailUrl !== null) {
      try {
        await deleteImageOnCloudinary(blog.thumbnailUrl);
      } catch (error) {
        console.log("Error coming while deleting thumbnial", error);
      }
    }

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while deleting a blog",
      Error: error.message,
    });
  }
};

const viewBlog = async (req, res) => {
  try {
    const username = req.params.username;
    const titleSlug = req.params.titleSlug;

    const BLOG_SAFE_DATA =
      "title titleSlug thumbnailUrl content clapCount postResponseCount postResponses readingTime creator publishAt visibility -_id";
    const CREATOR_SAFE_DATA =
      "name username profileImgUrl bio followersCount followingCount -_id";
    const POST_RESPONSES_SAFE_DATA = "fromUserId message createdAt -_id";
    const FROM_USER_ID_SAFE_DATA = "name profileImgUrl -_id";

    const postResponseLimit = parseInt(req.query.limit) || 3;
    const skip = parseInt(req.query.skip) || 0;

    // check the username and titleSlug cannnot be empty
    if (!username || !titleSlug) {
      return res.status(404).json({
        success: false,
        message: "username and titleSlug is required",
      });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid username",
      });
    }

    // if user present, check the blog is valid or not
    const blog = await Blog.findOne({
      $and: [{ creator: { $eq: user._id } }, { titleSlug }],
    })
      .select(BLOG_SAFE_DATA)
      .populate("creator", CREATOR_SAFE_DATA)
      .populate({
        path: "postResponses",
        select: POST_RESPONSES_SAFE_DATA,
        populate: {
          path: "fromUserId",
          select: FROM_USER_ID_SAFE_DATA,
        },
        options: { limit: postResponseLimit, skip: skip },
      })
      .lean();

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog fetched successfully",
      blog,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error coming while deleting a blog",
      Error: error.message,
    });
  }
};

const getUserBlogs = async (req, res) => {
  try {
    const { userId } = req.params;

    const { page } = req.query;

    const BLOG_SAFE_DATA =
      "title titleSlug subtitle thumbnailUrl content clapCount postResponseCount readingTime publishAt -_id";

    // check the username cannnot be empty
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required!",
        allBlogsFetched: false,
      });
    }

    const { limit, skip } = getPagination(req, 10);

    const userBlogs = await Blog.find({ creator: userId })
      .sort({ publishAt: -1 })
      .select(BLOG_SAFE_DATA)
      .skip(skip)
      .limit(limit)
      .lean();

    if (userBlogs.length === 0 && page == 1) {
      return res.status(200).json({
        success: true,
        message: `No blog is created yet!`,
        allBlogsFetched: false,
      });
    }

    return res.status(200).json({
      success: true,
      blogs: userBlogs,
      message: null,
      allBlogsFetched: userBlogs.length < limit,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
      error: error.message,
    });
  }
};

module.exports = {
  createBlog,
  clapBlog,
  addComment,
  editComment,
  deleteComment,
  deleteBlog,
  viewBlog,
  getUserBlogs,
};
