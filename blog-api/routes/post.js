const multer = require("../middlewares/multer");
const { validatePost, validateError } = require("../middlewares/validator");
const { parseData } = require("../middlewares");
const {
  createPost,
  uploadImage,
  updatePost,
  deletePost,
  getPost,
  getPosts,
  searchPost,
  getFeaturedPosts,
  getLatestPosts,
  getRelatedPosts,
} = require("../controllers/post");

const router = require("express").Router();

router.post("/create",multer.single("thumbnail"),parseData,validatePost,validateError,createPost);
router.put("/:id",multer.single("thumbnail"),parseData,validatePost,validateError,updatePost);

router.delete("/:id", deletePost);
router.get("/single/:slug", getPost);
router.get("/posts", getPosts);
router.get("/search", searchPost);
router.get("/featured-posts", getFeaturedPosts);
router.get("/latest-posts", getLatestPosts);
router.get("/related-posts/:postId", getRelatedPosts);

router.post("/upload-image", multer.single("image"), uploadImage);

module.exports = router;
