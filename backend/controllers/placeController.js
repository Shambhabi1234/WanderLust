const Place = require("../models/Place"); 

/**
 * 1. Get all places (Home Page)
 * Handles filtering by Category and Price Range via URL queries.
 */
const getPlaces = async (req, res) => {
  try {
    const { category, minPrice, maxPrice } = req.query;
    let filter = {};

    // Filter by Category: Matches exact string (case-insensitive)
    if (category && category !== "all" && category !== "undefined") {
      filter.category = category.toLowerCase(); 
    }

    // Filter by Price Range: Converts strings to Numbers for DB comparison
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice && !isNaN(minPrice)) {
        filter.price.$gte = Number(minPrice); // Greater than or equal
      }
      if (maxPrice && !isNaN(maxPrice)) {
        filter.price.$lte = Number(maxPrice); // Less than or equal
      }
    }

    // Executes the search. Note: Documents missing the 'price' field will be excluded.
    const places = await Place.find(filter).sort({ createdAt: -1 });
    res.json(places);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * 2. Add a new place
 */
const addPlace = async (req, res) => {
  try {
    const place = await Place.create({
      ...req.body,
      owner: req.user._id,
      category: req.body.category ? req.body.category.toLowerCase() : "all", 
    });
    res.status(201).json(place);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * 3. Update a place
 */
const updatePlace = async (req, res) => {
  try {
    const { id } = req.params;
    const place = await Place.findById(id);
    
    if (!place) return res.status(404).json({ message: "Not found" });
    
    if (place.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (req.body.category) {
        req.body.category = req.body.category.toLowerCase();
    }
    
    place.set(req.body);
    await place.save();
    res.json(place);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * 4. Get User Places
 */
const getUserPlaces = async (req, res) => {
  try {
    const { _id } = req.user;
    const userPlaces = await Place.find({ owner: _id }).sort({ createdAt: -1 });
    res.json(userPlaces); 
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * 5. Get Single Place
 */
const getPlaceById = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: "Not found" });
    res.json(place);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * 6. Delete Place
 */
const deletePlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: "Not found" });
    
    if (place.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    await Place.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { 
    addPlace, 
    updatePlace, 
    getPlaces, 
    getUserPlaces, 
    getPlaceById, 
    deletePlace 
};