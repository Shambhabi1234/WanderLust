// routes/placeRoutes.js
const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { createBooking, getUserBookings } = require('../controllers/bookingController');
const {
  addPlace,
  getPlaces, // 🔥 This is the function we will update in the controller
  getPlaceById,
  getUserPlaces,
  updatePlace,
  deletePlace
} = require("../controllers/placeController");

// Single entry point for all places (Public)
router.get("/places", getPlaces);

router.get("/places/user-places", protect, getUserPlaces); 

router.post("/places", protect, addPlace);
router.put("/places/:id", protect, updatePlace);
router.delete("/places/:id", protect, deletePlace);

router.get("/places/:id", getPlaceById);

router.post('/bookings', protect, createBooking);
router.get('/bookings', protect, getUserBookings);

module.exports = router;