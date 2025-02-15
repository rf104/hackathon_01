// routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../db/user");
const flash = require("connect-flash");
const MongooseConnection = require("../db/MongooseConnection");
const Transaction = require("../db/transaction"); // Add this line

// Signup Form
router.get("/signup", (req, res) => {
  res.render("home/signin", { error: req.flash("error") });
});

// Signup Handler
router.post("/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    await MongooseConnection();

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash("error", "Email already exists");
      return res.redirect("/signup");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      personalInfo: { name },
      financials: {
        balance: 0,
        monthlyExpenses: 0,
        totalSaved: 0,
      },
    });

    await newUser.save();

    req.flash("success", "Account created successfully! Please login");
    res.redirect("/login");
  } catch (err) {
    console.error(err);
    req.flash("error", "Registration failed");
    res.redirect("/signup");
  }
});

// Login Form
router.get("/login", (req, res) => {
  res.render("home/signin", { error: req.flash("error") });
});

// Login Handler
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    await MongooseConnection();

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      req.flash("error", "Invalid credentials");
      return res.redirect("/login");
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash("error", "Invalid credentials");
      return res.redirect("/login");
    }

    // Check if banned
    if (user.security.isBanned) {
      req.flash("error", "Account is suspended");
      return res.redirect("/login");
    }

    // Set session
    req.session.UserId = user._id;
    req.session.accountType = "user";

    // Update login history
    user.security.lastLogin = new Date();
    user.security.loginHistory.push({
      timestamp: new Date(),
      ipAddress: req.ip,
      device: req.headers["user-agent"],
    });

    await user.save();
    if (user.email == "kingaref13@gmail.com") {
      return res.redirect("/admin/");
    }
    const transactions = await Transaction.find({ userId: user._id });
    console.log(transactions);
    if (transactions.length > 0) {
        req.session.transactions = transactions;
        const transactionQuery = transactions.map(t => `transactionId=${t._id}`).join('&');
        return res.redirect(`/user/?${transactionQuery}`);
      }

    res.redirect("/user/");
  } catch (err) {
    console.error(err);
    req.flash("error", "Login failed");
    res.redirect("/login");
  }
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

module.exports = router;