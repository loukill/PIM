const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    meta: {
      type: String,
      trim: true,
      required: true,
    },
    author: {
      type: String,
      deafult: "Admin",
    },
    content: {
      type: String,
      trim: true,
      required: true,
    },
    thumbnail: {
      type: Object,
      url: String,
      public_id: String,
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);
