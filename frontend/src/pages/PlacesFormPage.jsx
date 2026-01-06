import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import api from "../api/api";
import PhotosUploader from "./PhotosUploader";
import Perks from "../Perks";
import AccountNav from "../AccountNav";

export default function PlacesFormPage() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [price, setPrice] = useState(100);
  const [redirect, setRedirect] = useState(false);
  const [category, setCategory] = useState(""); 

  // Full list of 20 categories matching your "Magic" navbar exactly
  const allCategories = [
    { label: "Castles", value: "castles" },
    { label: "Enchanted", value: "enchanted" },
    { label: "Palaces", value: "palaces" },
    { label: "Forests", value: "forests" },
    { label: "Gardens", value: "gardens" },
    { label: "Islands", value: "islands" },
    { label: "Carriages", value: "carriages" },
    { label: "Hidden Gems", value: "hidden" },
    { label: "Royal Rooms", value: "rooms" },
    // Change this line:
{ label: "Lakeside", value: "Lakeside" }, // Match the case exactly
    { label: "Towers", value: "towers" },
    { label: "Magic Pools", value: "pools" },
    { label: "Design", value: "design" },
    { label: "Caves", value: "caves" },
    { label: "Countryside", value: "countryside" },
    { label: "Cabins", value: "cabins" },
    { label: "Tiny Homes", value: "tiny" },
    { label: "Farms", value: "farms" },
    { label: "Amazing Views", value: "views" }
  ];

  useEffect(() => {
    if (!id) return;
    // Fetches data for editing
    api.get("/places/" + id).then(({ data }) => {
      // DEBUG: If this says 'undefined', the category wasn't saved in the DB!
      console.log("Category fetched from DB:", data.category);

      setTitle(data.title);
      setAddress(data.address);
      setAddedPhotos(data.photos);
      setDescription(data.description);
      setPerks(data.perks);
      setExtraInfo(data.extraInfo);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setMaxGuests(data.maxGuests);
      setPrice(data.price);
      // Syncs state so the correct button turns black
      setCategory(data.category || ""); 
    });
  }, [id]);

  async function savePlace(ev) {
    ev.preventDefault();
    const placeData = {
      title, address, photos: addedPhotos,
      description, perks, extraInfo,
      checkIn, checkOut, 
      maxGuests: Number(maxGuests), 
      price: Number(price),
      category, // Saved to the database
    };

    try {
      if (id) {
        // Update existing property
        await api.put(`/places/${id}`, placeData);
      } else {
        // Create new property
        await api.post("/places", placeData);
      }
      setRedirect(true);
    } catch (e) {
      alert("Error saving place");
    }
  }

  if (redirect) return <Navigate to={"/account/places"} />;

  return (
    <div>
      <AccountNav />
      <form onSubmit={savePlace} className="max-w-4xl mx-auto px-4 pb-8">
        <h2 className="text-2xl mt-4 font-bold">Title</h2>
        <input 
          className="border w-full p-2 rounded-xl mb-2" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          placeholder="e.g., Luxury Penthouse" 
          required 
        />
        
        <h2 className="text-2xl mt-4 font-bold">Address</h2>
        <input 
          className="border w-full p-2 rounded-xl mb-2" 
          value={address} 
          onChange={e => setAddress(e.target.value)} 
          placeholder="e.g., Wayanad Forest Reserve" 
          required 
        />

        {/* CATEGORY SELECTION SECTION */}
        <h2 className="text-2xl mt-6 font-bold">Category</h2>
        <p className="text-gray-500 text-sm mb-2">Select the magic type for this property</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {allCategories.map((cat) => (
            <button
              key={cat.value}
              type="button" 
              onClick={() => setCategory(cat.value)}
              // Highlights black if current state matches the button's value
              className={`p-3 border rounded-2xl text-xs font-semibold transition-all ${
                category === cat.value 
                ? "bg-black text-white border-black" 
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <h2 className="text-2xl mt-8 font-bold">Photos</h2>
        <PhotosUploader photos={addedPhotos} onChange={setAddedPhotos} />
        
        <h2 className="text-2xl mt-4 font-bold">Description</h2>
        <textarea 
          className="border w-full p-3 rounded-xl h-32" 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          required 
        />
        
        <h2 className="text-2xl mt-4 font-bold">Perks</h2>
        <Perks selected={perks} onChange={setPerks} />
        
        <h2 className="text-2xl mt-4 font-bold">Extra info</h2>
        <textarea 
          className="border w-full p-2 rounded-xl h-24" 
          value={extraInfo} 
          onChange={e => setExtraInfo(e.target.value)} 
        />
        
        <div className="grid gap-2 grid-cols-2 md:grid-cols-4 mt-6">
          <div><h3 className="font-bold text-sm">Check in</h3><input className="border w-full p-2 rounded-xl" type="text" value={checkIn} onChange={e => setCheckIn(e.target.value)} /></div>
          <div><h3 className="font-bold text-sm">Check out</h3><input className="border w-full p-2 rounded-xl" type="text" value={checkOut} onChange={e => setCheckOut(e.target.value)} /></div>
          <div><h3 className="font-bold text-sm">Guests</h3><input className="border w-full p-2 rounded-xl" type="number" value={maxGuests} onChange={e => setMaxGuests(e.target.value)} /></div>
          <div><h3 className="font-bold text-sm">Price</h3><input className="border w-full p-2 rounded-xl" type="number" value={price} onChange={e => setPrice(e.target.value)} /></div>
        </div>

        <button className="bg-[#FF385C] my-8 text-white w-full py-4 rounded-3xl font-bold text-xl hover:shadow-lg transition-all">
          Save Property
        </button>
      </form>
    </div>
  );
}