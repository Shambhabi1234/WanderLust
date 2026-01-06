const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  // Link to the specific accommodation being booked
  place: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Place'},
  // Link to the user who is making the booking
  user: {type: mongoose.Schema.Types.ObjectId, required: true},
  checkIn: {type: Date, required: true},
  checkOut: {type: Date, required: true},
  name: {type: String, required: true},
  phone: {type: String, required: true},
  price: Number,
});

const BookingModel = mongoose.model('Booking', bookingSchema);
module.exports = BookingModel;