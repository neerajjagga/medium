const mongoose = require("mongoose");

const blogSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: 10,
      maxLength: 50,
    },
    titleSlug: {
      type: String,
      trim: true,
    },
    subtitle: {
      type: String,
      default: "",
      trim: true,
      maxLength: 160,
    },
    htmlContent: {
      type: String,
      required: true,
    },
    jsonContent: {
      type: Object,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      default: "/assets/media/thumbnail.png",
    },
    claps: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    clapCount: {
      type: Number,
      default: 0,
    },
    postResponses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    postResponseCount: {
      type: Number,
      default: 0,
    },
    visibility: {
      type: String,
      enum: ["locked", "unlocked"],
      default: "unlocked",
      trim: true,
    },
    tags: {
      type: [String],
      validate: {
        validator: function (arr) {
          return arr.length <= 5;
        },
        message: "You can maximum add 5 topics",
      },
      required: true,
    },
    readingTime: {
      type: Number,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    publishAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

blogSchema.index({ creator: 1, tags: 1, publishAt: -1 });

const Blog = mongoose.model("Blog", blogSchema);

module.exports = {
  Blog,
};
