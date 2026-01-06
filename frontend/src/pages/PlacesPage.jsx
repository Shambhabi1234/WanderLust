import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccountNav from "../AccountNav"; 
import api from "../api/api"; 

export default function PlacesPage() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get the token to verify identity
    const token = localStorage.getItem('token');
    
    // 2. 🔥 Stop the API call if no token exists to avoid 401 errors
    if (!token) {
      setLoading(false);
      return;
    }

    // 3. Fetch user-specific places
    api.get('/places/user-places')
      .then(({ data }) => {
        setPlaces(data);
        setLoading(false);
      })
      .catch((err) => {
        // If the token is expired, the interceptor handles it, but we log here for safety
        console.error("Failed to load user places:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <AccountNav />
      <div className="text-center">
        {/* Link to the form where you'll add the Udaipur Palace */}
        <Link 
          className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full hover:bg-opacity-90 transition-all shadow-md" 
          to={'/account/places/new'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add new place
        </Link>
      </div>
      
      <div className="mt-8 max-w-4xl mx-auto px-4">
        {loading && <div className="text-center text-gray-500">Loading your places...</div>}
        
        {!loading && places.length === 0 && (
          <div className="text-center mt-8 text-gray-500 italic">
            No accommodations found. Click the button above to add your first one!
          </div>
        )}

        {/* Displaying the saved places */}
        {places.length > 0 && places.map(place => (
          <Link 
            key={place._id} 
            to={'/account/places/' + place._id} 
            className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl mb-4 hover:bg-gray-200 transition-all border border-gray-200"
          >
            <div className="flex w-32 h-32 bg-gray-300 grow shrink-0 rounded-xl overflow-hidden">
              {place.photos && place.photos.length > 0 ? (
                <img 
                  className="object-cover w-full h-full" 
                  src={'http://localhost:5000/uploads/' + place.photos[0]} 
                  alt={place.title}
                />
              ) : (
                <div className="flex items-center justify-center w-full text-gray-500">No Image</div>
              )}
            </div>
            <div className="grow-0 shrink overflow-hidden text-left">
              <h2 className="text-xl font-bold truncate">{place.title}</h2>
              <p className="text-sm mt-2 text-gray-600 line-clamp-3 leading-relaxed">
                {place.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}