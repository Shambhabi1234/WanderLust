const Booking = require('../models/Booking');

// Logic to create a new booking
exports.createBooking = async (req, res) => {
  try {
    const userData = req.user; // Retrieved from your authMiddleware
    const { place, checkIn, checkOut, name, phone, price } = req.body;
    
    const bookingDoc = await Booking.create({
      place, checkIn, checkOut, name, phone, price,
      user: userData._id,
    });
    res.json(bookingDoc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Logic to fetch all bookings for the logged-in user
exports.getUserBookings = async (req, res) => {
  try {
    const userData = req.user;
    // .populate('place') allows you to see the property details (title, photos, etc.)
    res.json(await Booking.find({user: userData._id}).populate('place'));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};