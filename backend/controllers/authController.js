const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });
    
    // Generate token with user details
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name }, 
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Set cookie AND send token in JSON for frontend localStorage
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, 
    }).status(201).json({
      token, // 👈 Added: Frontend needs this to stop 401 errors
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = jwt.sign(
        { id: user._id, email: user.email, name: user.name }, 
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      // Send token in response so Login.jsx can save it
      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
      }).json({
        token, // 👈 Added: Essential for your axios interceptor
        _id: user._id,
        name: user.name,
        email: user.email
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.profile = async (req, res) => {
  // Check for token in cookies OR Authorization header for maximum compatibility
  let token = req.cookies.token;
  
  if (!token && req.headers.authorization) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
      if (err) return res.status(401).json({message: "Invalid token"});
      
      const user = await User.findById(userData.id).select("-password");
      if (!user) return res.status(404).json({message: "User not found"});
      
      res.json(user);
    });
  } else {
    res.json(null);
  }
};

exports.logout = (req, res) => {
  // Clear the cookie and notify frontend to clear localStorage
  res.cookie('token', '', { 
    expires: new Date(0),
    sameSite: 'lax', 
    secure: false 
  }).json(true);
};