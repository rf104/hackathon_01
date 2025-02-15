require("dotenv").config();

const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("connect-flash");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const mongoose = require("mongoose");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const { Cloudinary } = require("cloudinary");
const MongooseConnection = require("./db/MongooseConnection");
const admin = require("./routes/admin");
const user = require("./routes/user");
const hashPass = require("./function/hashing");
const app = express();
const sendOtpEmail = require("./routes/email");
const { PASSWORD_RESET_REQUEST_TEMPLATE } = require("./routes/EmailTemp");
const getWirelessIP = require("./routes/GetWirelessIp");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const requireLogin = require("./routes/RequireLoginMiddleware");
const auth = require('./routes/auth');
const PORT = process.env.PORT || 3001;
///connect .env file

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(flash());

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "public", "ejs"));

app.set("view engine", "ejs");

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.localhost = `http://${getWirelessIP()}:${PORT}`;

  res.locals.UserId = req.session.UserId;
  res.locals.accountType = req.session.accountType;
  next();
});
app.use("/admin", admin);
app.use("/user", user);


app.get("/", (req, res) => {
  
  res.render("home/home");
});





app.use('/auth', auth);

// Update existing route
app.get("/login", (req, res) => {
  res.redirect('/auth/login');
});

app.get("/signup", (req, res) => {
  res.redirect('/auth/signup');
});

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
      if (err) {
          return res.status(500).send('Logout failed');
      }
      res.clearCookie('connect.sid'); // Clear the session cookie
      res.status(200).send('Logout successful');
  });
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}/`);
});