const FeaturedPost = require("../models/featuredPost");

exports.isFeaturedPost = async (postId) => {
  const post = await FeaturedPost.findOne({ post: postId });
  return post ? true : false;
};
