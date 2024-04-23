const multer = require("multer");

const storage = multer.diskStorage({});

const fileFilter = (_, file, cb) => {
  if (!file.mimetype.includes("image")) {
    return cb("Image file type is invalid!", false);
  }

  cb(null, true);

  console.log(file)
};

module.exports = multer({ storage, fileFilter });
