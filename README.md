# 🌲 WanderLust | Discover Stays Beyond Destinations
> **"Where every stay tells a story."**

WanderLust is a premium full-stack vacation rental platform built with the MERN stack. It offers a seamless experience for users to discover unique architectural gems, manage favorite stays, and book extraordinary travel experiences effortlessly.

## 🚀 Live Links
- **Frontend (UI):** [https://wander-lust123.vercel.app](https://wander-lust123.vercel.app)
- **Backend (API):** [https://wanderlust-uixv.onrender.com](https://wanderlust-uixv.onrender.com)
---

## 🚀 Key Features

### 🔍 Advanced Category Optimization
* **Smart Filtering**: Implemented a state-driven navigation system (Lakeside, Castles, Towers, Enchanted) that instantly updates UI listings without page reloads.
* **Slug Matching**: Synchronized frontend values with MongoDB queries to ensure 100% accuracy in property categorization.

### 📅 Effortless Booking Functionality
* **Real-Time Availability**: Users can select dates and view pricing logic for their stay.
* **Booking Management**: Integrated backend logic to handle reservation states and link them to user profiles.

### ❤️ Personalized Experience (Favorites)
* **Wishlist Integration**: Users can "Favorite" listings like the *Falcon Peak Tower* or *Moonspell Haven*.
* **Persistent State**: Favorites are stored in MongoDB, ensuring a user's collection is saved across different devices.

### 🔐 Secure Authentication
* **Identity Management**: Secure Login/Signup flow using **JWT (JSON Web Tokens)** and **bcrypt** for password hashing.
* **Protected Routes**: Sensitive actions (like booking or hosting) are guarded by custom middleware.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React.js | Dynamic UI & State Management |
| **Styling** | Tailwind CSS | Responsive, Modern "Mobile-First" Design |
| **Backend** | Node.js & Express | RESTful API Architecture |
| **Database** | MongoDB | Scalable NoSQL Data Modeling |
| **Auth** | JWT & Cookie-parser | Secure Session Handling |
|*Deployment:**| Vercel (Frontend) & Render (Backend)
---

## 📸 Featured Stays
* **The Emerald Lake Cabin**: Showcasing the "Lakeside" optimization. A sanctuary of stone and wood with tranquil water views.
* **Falcon Peak Tower**: A cantilevered engineering marvel, demonstrating high-fidelity image handling and dynamic pricing.

---

## 💻 Technical Highlights & Challenges

### 1. The Naming Consistency Challenge
**Problem**: Initially faced a mismatch where the UI "Lakeside" filter didn't match the database string "lake".
**Solution**: Standardized the `allCategories` configuration object to ensure strict string equality, resulting in a 0ms lag in filtering.

### 2. Scalable Data Structure
**Problem**: Handling multiple property types with varying amenities.
**Solution**: Designed a flexible Mongoose Schema that allows for dynamic expansion of property categories and features.

---

## 🏗️ Installation & Setup

1. **Clone the Repo**:
   ```bash
   git clone [https://github.com/YOUR_USERNAME/WanderLust.git](https://github.com/YOUR_USERNAME/WanderLust.git)
