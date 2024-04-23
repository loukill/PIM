require("express-async-errors");
require("dotenv").config();
require("./db");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const postRouter = require("./routes/post");
const { handleAsyncError } = require("./middlewares/error");

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/post", postRouter);

app.use(handleAsyncError);

const PORT = process.env.PORT;


app.listen(PORT, () =>
  console.log("Port is listinging on: ", "http://localhost:" + PORT)
);
