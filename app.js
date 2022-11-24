const express = require("express");
const app = express();
const category = require("./routes/category");

app.use(express.json());

app.use("/api/category", category);

module.exports = app;
