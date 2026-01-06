const express = require("express");
const router = express.Router();
const { signup, login, profile } = require("../controllers/authController"); // 👈 Add profile here

// Change "/signup" to "/register" to match Signup.jsx
router.post("/register", signup); 
router.post("/login", login);
router.get("/profile", profile); // 👈 ADD THIS LINE

module.exports = router;