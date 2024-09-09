const express = require("express");
const mongoose = require("mongoose");

const app = express();
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

app.use(express.json());

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() =>
    console.log("DB connection success")
  );

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(
    `Server is running on port ${port}`
  );
});
