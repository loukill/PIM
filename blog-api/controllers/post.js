const Post = require("../models/post");
const cloudinary = require("../cloud");
const { isValidObjectId } = require("mongoose");
const FeaturedPost = require("../models/featuredPost");
const { isFeaturedPost } = require("../utils/helper");

const addToFeaturedPost = async (postId) => {
  const alreadyExists = await FeaturedPost.findOne({ post: postId });
  if (alreadyExists) return;

  const featuredPost = new FeaturedPost({ post: postId });
  await featuredPost.save();

  const featuredPosts = await FeaturedPost.find({}).sort({ createdAt: -1 });
  await featuredPosts.forEach(async (post, index) => {
    if (index >= 4) await FeaturedPost.findByIdAndDelete(post._id);
  });
};

const removeFromFeaturedPost = async (postId) => {
  await FeaturedPost.findOneAndDelete({ post: postId });
};

exports.uploadImage = async (req, res) => {
  const { file } = req;
  if (!file) return res.status(401).json({ error: "Image file is missing!" });

  const { secure_url } = await cloudinary.uploader.upload(file.path);

  res.status(201).json({ image: secure_url });
};

exports.createPost = async (req, res) => {
  const { title, meta, author, content, tags, slug, featured } = req.body;
  const { file } = req;

  const newPost = new Post({
    title,
    meta,
    author: "Admin",
    content,
    tags,
    slug,
  });

  if (file) {
    const { secure_url: url, public_id } = await cloudinary.uploader.upload(
      file.path
    );
    newPost.thumbnail = { url, public_id };
  }

  await newPost.save();

  if (featured) await addToFeaturedPost(newPost._id);

  res.status(201).json({
    post: {
      id: newPost._id,
      thumbnail: newPost.thumbnail?.url,
      title,
      meta,
      slug,
      tags,
      author,
      featured,
    },
  });
};

exports.updatePost = async (req, res) => {
  const { title, meta, content, tags, slug, featured } = req.body;
  const { file } = req;
  const { id } = req.params;

  if (!isValidObjectId(id))
    return res.status(401).json({ error: "Invalid post id!" });

  const post = await Post.findById(id);
  if (!post) return res.status(404).json({ error: "Post not found!" });

  post.title = title;
  post.meta = meta;
  post.content = content;
  post.tags = tags;
  post.slug = slug;

  const public_id = post.thumbnail?.public_id;
  if (file && public_id) {
    const { result } = await cloudinary.uploader.destroy(public_id);
    if (result !== "ok")
      return res.status(500).json({ error: "Could not update thumbnail!" });
  }

  if (file) {
    const { secure_url: url, public_id } = await cloudinary.uploader.upload(
      file.path
    );
    post.thumbnail = { url, public_id };
  }

  await post.save();

  if (featured) {
    await addToFeaturedPost(post._id);
  } else {
    await removeFromFeaturedPost(post._id);
  }

  res.status(201).json({
    post: {
      id: post._id,
      thumbnail: post.thumbnail?.url,
      title,
      meta,
      slug,
      tags,
      featured,
      author: post.author,
      content,
    },
  });
};

exports.deletePost = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id))
    return res.status(401).json({ error: "Invalid post id!" });

  const post = await Post.findById(id);
  if (!post) return res.status(404).json({ error: "Post not found!" });

  const public_id = post.thumbnail?.public_id;
  if (public_id) {
    const { result } = await cloudinary.uploader.destroy(public_id);
    if (result !== "ok")
      return res.status(500).json({ error: "Could not delete thumbnail!" });
  }

  await Post.findByIdAndDelete(id);
  res.json({
    message: "Post removed successfully!",
  });
};

exports.getPost = async (req, res) => {
  const { slug } = req.params;

  const post = await Post.findOne({ slug });
  if (!post) return res.status(404).json({ error: "Post not found!" });

  const { title, meta, content, thumbnail, tags, author } = post;

  const featuredPost = await isFeaturedPost(post._id);

  res.status(201).json({
    post: {
      id: post._id,
      thumbnail: thumbnail?.url,
      title,
      meta,
      content,
      slug,
      tags,
      author,
      featured: featuredPost,
    },
  });
};

exports.getPosts = async (req, res) => {
  const { pageNo, limit = 9 } = req.query;

  const posts = await Post.find({})
    .sort({ createdAt: -1 })
    .skip(parseInt(pageNo) * limit)
    .limit(limit);

  const postCount = await Post.countDocuments();

  res.json({
    posts: posts.map((post) => {
      return {
        id: post._id,
        thumbnail: post.thumbnail?.url,
        title: post.title,
        meta: post.meta,
        slug: post.slug,
        tags: post.tags,
        author: post.author,
        createdAt: post.createdAt,
      };
    }),
    postCount,
  });
};

exports.searchPost = async (req, res) => {
  const { query } = req;
  const result = await Post.find({
    title: { $regex: query.title, $options: "i" },
  });

  res.json({
    posts: result.map((post) => ({
      id: post._id,
      thumbnail: post.thumbnail?.url,
      title: post.title,
      meta: post.meta,
      slug: post.slug,
      tags: post.tags,
      author: post.author,
    })),
  });
};

exports.getFeaturedPosts = async (req, res) => {
  const posts = await FeaturedPost.find({})
    .sort({ createdAt: -1 })
    .limit(4)
    .populate("post");

  res.json({
    posts: posts.map(({ post }) => ({
      id: post._id,
      title: post.title,
      meta: post.meta,
      slug: post.slug,
      thumbnail: post.thumbnail?.url,
    })),
  });
};

exports.getLatestPosts = async (req, res) => {
  const posts = await Post.find({}).sort({ createdAt: -1 }).limit(5);

  res.json({
    posts: posts.map((post) => ({
      id: post._id,
      title: post.title,
      meta: post.meta,
      slug: post.slug,
      thumbnail: post.thumbnail?.url,
      author: post.author,
      createdAt: Date(posts[0].createdAt),
    })),
  });
};

exports.getRelatedPosts = async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findById(postId).select("tags");
  const posts = await Post.find({
    tags: { $in: [...post.tags] },
    _id: { $ne: post._id },
  })
    .sort("-createdAt")
    .limit(5);

  res.json({
    posts: posts.map((post) => ({
      id: post._id,
      title: post.title,
      meta: post.meta,
      slug: post.slug,
      thumbnail: post.thumbnail?.url,
      author: post.author,
      createdAt: posts[0].createdAt,
    })),
  });
};
