const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const imageDownloader = require("image-downloader");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Route Imports
const authRoutes = require("./routes/authRoutes");
const placeRoutes = require("./routes/placeRoutes");
const Booking = require("./models/Booking"); 
const User = require("./models/User"); // ✅ Added User import for Favorites
const Review = require("./models/Review"); // ✅ Added Review import

const app = express();

/* ---------- MIDDLEWARE ---------- */
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173", "http://localhost:3000"], 
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ---------- DIRECTORY SETUP ---------- */
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

/* ---------- MONGODB CONNECTION ---------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

/* ---------- PHOTO UPLOAD ROUTES ---------- */
app.post("/api/upload-by-link", async (req, res) => {
  try {
    const { link } = req.body;
    const newName = "photo" + Date.now() + ".jpg";
    await imageDownloader.image({
      url: link,
      dest: path.join(__dirname, "uploads", newName),
    });
    res.json(newName);
  } catch (error) {
    res.status(500).json({ message: "Failed to upload by link", error: error.message });
  }
});

const photosMiddleware = multer({ dest: "uploads/" });
app.post("/api/upload", photosMiddleware.array("photos", 100), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path: filePath, originalname } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = filePath + "." + ext;
    fs.renameSync(filePath, newPath);
    uploadedFiles.push(path.basename(newPath));
  }
  res.json(uploadedFiles);
});

/* ---------- ⭐ REVIEW ROUTES (Placed Higher to Avoid 404) ---------- */

// GET Reviews for a specific place
app.get("/api/reviews/:placeId", async (req, res) => {
  try {
    const { placeId } = req.params;
    const reviews = await Review.find({ place: placeId })
      .populate("user", "name")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json("Error fetching reviews");
  }
});

// POST a new review
app.post("/api/reviews", async (req, res) => {
  let token = req.cookies.token;
  if (!token && req.headers.authorization) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) return res.status(401).json("Unauthorized");

  try {
    const userData = jwt.verify(token, process.env.JWT_SECRET);
    const { place, rating, comment } = req.body;
    
    const reviewDoc = await Review.create({
      place,
      user: userData.id,
      rating,
      comment,
    });
    res.json(reviewDoc);
  } catch (err) {
    res.status(422).json(err);
  }
});

/* ---------- BUSINESS ROUTES ---------- */
app.use("/api/auth", authRoutes);
app.use("/api", placeRoutes); 

/**
 * 💖 NEW: TOGGLE FAVORITES ROUTE
 * Supports BOTH Cookies and Bearer Tokens
 */
app.post("/api/favorites", async (req, res) => {
  let token = req.cookies.token;
  if (!token && req.headers.authorization) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) return res.status(401).json("Unauthorized");

  try {
    const userData = jwt.verify(token, process.env.JWT_SECRET);
    const { placeId } = req.body;

    const user = await User.findById(userData.id);
    const isFavorite = user.favorites.includes(placeId);

    if (isFavorite) {
      // ✅ Using $pull to remove from array
      await User.findByIdAndUpdate(userData.id, { $pull: { favorites: placeId } });
      res.json({ status: "removed" });
    } else {
      // ✅ Using $addToSet to prevent duplicates
      await User.findByIdAndUpdate(userData.id, { $addToSet: { favorites: placeId } });
      res.json({ status: "added" });
    }
  } catch (err) {
    res.status(401).json("Invalid token");
  }
});

/**
 * 🔥 DELETE BOOKING ROUTE
 */
app.delete("/api/bookings/:id", async (req, res) => {
  let token = req.cookies.token;
  
  if (!token && req.headers.authorization) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json("Unauthorized: No token provided");
  }

  try {
    const userData = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = req.params;

    const result = await Booking.deleteOne({ _id: id, user: userData.id });

    if (result.deletedCount === 1) {
      res.json("ok");
    } else {
      res.status(404).json("Booking not found");
    }
  } catch (err) {
    res.status(401).json("Unauthorized: Invalid token");
  }
});

/* ---------- TEST ROUTE ---------- */
app.get("/test", (req, res) => {
  res.json("test ok");
});

/* ---------- SERVER START ---------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});