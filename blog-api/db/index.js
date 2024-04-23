const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/blog")
  .then(() => {
    console.log("db is connected");
  })
  .catch((ex) => {
    console.log("db connection failed: ", ex.message || ex);
  });
