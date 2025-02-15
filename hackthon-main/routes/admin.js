require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const MongooseConnection = require("../db/MongooseConnection");
const express = require("express");
const { default: mongoose, model } = require("mongoose");
const router = express.Router();
router.get("/", (req, res) => {
  res.render("admin/admin");
});
module.exports = router;
