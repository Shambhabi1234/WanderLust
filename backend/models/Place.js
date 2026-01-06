const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    address: { type: String, required: true },
    photos: [String],
    description: String,
    perks: [String], 
    extraInfo: String, 
    checkIn: Number, 
    checkOut: Number, 
    maxGuests: Number, 
    price: { type: Number, required: true },
    // ADDED: This allows the database to store which category a place belongs to
    category: { 
      type: String, 
      required: true,
      default: "all" 
    }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Place", placeSchema);