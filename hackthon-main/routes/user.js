require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const MongooseConnection = require("../db/MongooseConnection");
const express = require("express");
const { default: mongoose, model } = require("mongoose");
const router = express.Router();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Transaction = require("../db/transaction");


// Import the Transaction

router.get("/transaction", async (req, res) => {
  try {
    if (!req.session || !req.session.UserId) {
      return res.status(400).json({ error: "User not authenticated" });
    }

    const transactionId = uuidv4();
    const name = "Transaction"; // Replace with actual course name
    const image =
      "https://res.cloudinary.com/da7hqzvvf/image/upload/v1739618552/6_rzwsdk.svg";
    const amount = req.query.amount*100;
    const recipient = req.query.recipient;

    console.log("Session Data:", req.session); // Debugging session data

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: req.session.email,
      client_reference_id: transactionId,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: recipient,
              images: image ? [image] : [],
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:3000/user/`,
      cancel_url: `http://localhost:3000/user/`,
    });

    // Store transaction details in MongoDB
    const newTransaction = new Transaction({
      userId: req.session.UserId, // Ensure this is defined
      amount: amount * 100, // Convert cents properly
      recipient: recipient,
      type: "income",
      category: "other",
      date: new Date(),
      status: "pending",
      metadata: {
        stripeSessionId: session.id,
        email: req.session.email || "unknown",
        ipAddress: req.ip,
        location: {
          type: "Point",
          coordinates: [0, 0],
        },
        device: req.headers["user-agent"],
      },
      fraudAnalysis: {
        isFraud: false,
        confidence: 100,
        modelUsed: "BasicModel",
        triggers: [],
      },
    });

    await newTransaction.save();
    res.redirect(session.url);
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    res.status(500).json({ error: "Something went wrong", details: error.message });
  }
});


router.get("/", (req, res) => {
  console.log(req.session.user);
  let transactionIds = [];
  if (req.query.transactionId) {
    if (Array.isArray(req.query.transactionId)) {
      transactionIds = req.query.transactionId;
    } else {
      transactionIds = [req.query.transactionId];
    }
  }
  res.render("user/user", { user: req.session.user, transactionIds });
});
module.exports = router;