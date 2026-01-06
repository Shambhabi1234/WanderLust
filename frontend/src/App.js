import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Home from './Home'; 
import Signup from './pages/Signup';
import Login from './pages/Login';
import PlacesPage from "./pages/PlacesPage";
import PlacesFormPage from "./pages/PlacesFormPage"; 
import PlacePage from "./pages/PlacePage"; 
import AccountPage from "./pages/AccountPage";
import BookingsPage from "./pages/BookingsPage"; // 👈 Required from your pages folder
import BookingPage from "./pages/BookingPage";   // 👈 Required for individual booking view
import { UserContextProvider } from "./UserContext";
import axios from "axios";
import { Toaster } from 'react-hot-toast'; // ✅ Added this for notifications

// Global axios configuration
axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      {/* ✅ Added Toaster here so notifications can pop up on any page */}
      <Toaster position="bottom-center" reverseOrder={false} />
      
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* Main Public Pages */}
              <Route index element={<Home />} /> 
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Public Single Place View */}
              <Route path="/place/:id" element={<PlacePage />} />

              {/* User Accommodation Management */}
              <Route path="/account/places" element={<PlacesPage />} />
              <Route path="/account/places/new" element={<PlacesFormPage />} />
              <Route path="/account/places/:id" element={<PlacesFormPage />} />
              
              {/* User Booking Management */}
              <Route path="/account/bookings" element={<BookingsPage />} />
              <Route path="/account/bookings/:id" element={<BookingPage />} /> 

              {/* General Account Profile Route */}
              <Route path="/account/:subpage?" element={<AccountPage />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </UserContextProvider>
  );
}

export default App;