import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "./api/api";
import toast from "react-hot-toast"; // ✅ Added this

export default function Home() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]); 
  const [searchQuery, setSearchQuery] = useState(""); // ✅ Added state for search

  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");

  useEffect(() => {
    setLoading(true);
    // ✅ Use relative paths: baseURL in api.js already handles "/api"
    const fetchUrl = category ? `/places?category=${category}` : '/places';

    Promise.all([
      api.get(fetchUrl),
      api.get("/auth/profile").catch(() => null) 
    ]).then(([placesRes, profileRes]) => {
      setPlaces(Array.isArray(placesRes.data) ? placesRes.data : []);
      
      // ✅ Properly sync state with MongoDB on load
      if (profileRes?.data?.favorites) {
        setFavorites(profileRes.data.favorites);
      }
    }).catch((err) => {
      console.error("Error fetching data:", err);
    }).finally(() => {
      setLoading(false);
    });
  }, [category]);

  // ✅ Search Logic: Filters the list based on address or title
  const filteredPlaces = places.filter(place => 
    place.address?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    place.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFavorite = async (e, placeId) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      // ✅ FIXED: Removed "/api" prefix. 
      // api.js baseURL + "/favorites" = http://localhost:5000/api/favorites
      const response = await api.post("/favorites", { placeId });
      
      if (response.data.status === "added") {
        setFavorites((prev) => [...prev, placeId]);
        toast.success("Added to favourites!"); // ✅ Added this
      } else {
        setFavorites((prev) => prev.filter((id) => id !== placeId));
        toast("Removed from favourites"); // ✅ Optional: Added for feedback
      }
    } catch (err) {
      // ✅ Only alert on 401 Unauthorized to avoid confusing the user
      if (err.response && err.response.status === 401) {
        toast.error("Please login to add favorites"); // ✅ Changed to toast
      } else {
        console.error("Favorite failed:", err.response?.status, err.message);
      }
    }
  };

  return (
    <div className="w-full pb-10">
      {/* ✅ Search Bar Section */}
      <div className="max-w-xl mx-auto mt-6 px-4">
        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-full py-2 px-6 shadow-md shadow-gray-200">
          <input 
            type="text" 
            placeholder="Search by city or title..." 
            className="flex-grow outline-none text-sm py-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="bg-rose-500 text-white p-2 rounded-full hover:bg-rose-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-8 px-4 md:px-10 lg:px-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-x-6 gap-y-12">
        {loading ? (
          <div className="col-span-full text-center py-20 text-gray-400 animate-pulse font-medium">
            Searching for magic...
          </div>
        ) : filteredPlaces.length === 0 ? ( // ✅ Updated to check filtered results
          <div className="col-span-full text-center py-20">
            <h2 className="text-xl font-semibold text-gray-600">
                {searchQuery ? `No results found for "${searchQuery}"` : `No ${category || "available"} properties found.`}
            </h2>
          </div>
        ) : (
          filteredPlaces.map((place) => { // ✅ Mapping over filteredPlaces
            const isFav = favorites.includes(place._id);

            return (
              <Link
                key={place._id}
                to={'/place/' + place._id}
                className="group flex flex-col cursor-pointer"
              >
                <div className="relative aspect-[11/10] overflow-hidden rounded-2xl bg-gray-200 shadow-sm">
                   {place.photos?.[0] ? (
                     <img
                       src={`http://localhost:5000/uploads/${place.photos[0]}`}
                       alt={place.title}
                       className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                     />
                   ) : (
                     <div className="flex h-full w-full items-center justify-center text-gray-400 text-sm">No Image</div>
                   )}
                   
                   <button 
                     onClick={(e) => handleFavorite(e, place._id)} 
                     className={`absolute top-4 right-4 drop-shadow-md transition-all hover:scale-110 z-10 ${
                       isFav ? "text-rose-500" : "text-white/80 hover:text-rose-500"
                     }`}
                   >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill={isFav ? "currentColor" : "none"} 
                        viewBox="0 0 24 24" 
                        strokeWidth={2.5} 
                        stroke="currentColor" 
                        className="w-6 h-6"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                   </button>
                </div>

                <div className="mt-4">
                  <h2 className="truncate text-[16px] font-bold text-gray-900">{place.address}</h2>
                  <p className="truncate text-[15px] text-gray-500">{place.title}</p>
                  <p className="mt-2 text-[16px]">
                    <span className="font-bold text-black">₹{place.price}</span> night
                  </p>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}