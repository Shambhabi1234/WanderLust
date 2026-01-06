import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import api from "../api/api"; 
import { UserContext } from "../UserContext"; 
import toast from "react-hot-toast"; // ✅ Added for feedback

export default function PlacePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [place, setPlace] = useState(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // ✅ Review States
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  useEffect(() => {
    if (!id) return;
    api.get(`/places/${id}`).then(response => {
      setPlace(response.data);
    }).catch(err => {
      console.error("404 Error: Could not find the place details.", err);
    });

    // ✅ Fetch existing reviews for this place
    api.get(`/reviews/${id}`).then(response => {
      setReviews(response.data);
    }).catch(err => console.error("Error fetching reviews", err));
  }, [id]);

  let numberOfNights = 0;
  if (checkIn && checkOut) {
    const differenceInTime = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    numberOfNights = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  }

  async function bookThisPlace() {
    if (!user) {
      alert("Please login to book this place.");
      return navigate('/login');
    }
    
    try {
      const response = await api.post('/bookings', {
        checkIn, checkOut, numberOfGuests, name, phone,
        place: place._id,
        price: numberOfNights * place.price,
      });
      const bookingId = response.data._id;
      navigate(`/account/bookings/${bookingId}`);
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Something went wrong with the booking.");
    }
  }

  // ✅ Submit Review Function
  async function submitReview(ev) {
    ev.preventDefault();
    if (!user) return toast.error("Please login to leave a review");
    if (!comment) return toast.error("Please add a comment");

    try {
      await api.post('/reviews', {
        place: id, rating, comment
      });
      toast.success("Review submitted!");
      setComment("");
      // Refresh reviews list
      const res = await api.get(`/reviews/${id}`);
      setReviews(res.data);
    } catch (e) {
      toast.error("Submit failed. You may need to book first.");
    }
  }

  if (!place) return <div className="p-8 text-center text-xl">Loading...</div>;

  return (
    <div className="mt-4 bg-gray-50 -mx-8 px-8 pt-8 min-h-screen">
      <h1 className="text-3xl font-bold">{place.title}</h1>
      <div className="my-2 block font-semibold underline text-gray-700">{place.address}</div>
      
      <div className="mt-4 overflow-hidden rounded-3xl max-w-5xl mx-auto shadow-lg">
        {place.photos?.[0] && (
          <img 
            className="aspect-video object-cover w-full" 
            src={`http://localhost:5000/uploads/${place.photos[0]}`} 
            alt={place.title} 
          />
        )}
      </div>

      <div className="mt-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr] max-w-5xl mx-auto pb-12">
        <div className="text-left">
          <div className="my-4 bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="font-bold text-2xl mb-2">Description</h2>
            <p className="text-gray-600 leading-relaxed">{place.description}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border-t mt-4">
            <h3 className="font-bold text-xl mb-2">House Rules & Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600">
                <div><b>Check-in:</b> {place.checkIn}</div>
                <div><b>Check-out:</b> {place.checkOut}</div>
                <div><b>Max guests:</b> {place.maxGuests}</div>
            </div>
          </div>

          {/* ✅ REVIEWS SECTION START */}
          <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Reviews ({reviews.length})</h2>
            
            {/* Review Input */}
            <form onSubmit={submitReview} className="mb-8 border-b pb-6">
              <label className="block text-sm font-bold mb-2 uppercase text-gray-500">Your Rating</label>
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map(star => (
                  <button 
                    key={star} 
                    type="button" 
                    onClick={() => setRating(star)}
                    className={`text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
                  >★</button>
                ))}
              </div>
              <textarea 
                className="w-full border rounded-xl p-3 h-24 outline-none focus:border-primary" 
                placeholder="Share your experience staying here..."
                value={comment}
                onChange={ev => setComment(ev.target.value)}
              />
              <button className="bg-primary text-white py-2 px-6 rounded-xl mt-2 font-bold hover:bg-opacity-90 transition-all">
                Submit Review
              </button>
            </form>

            {/* Review List */}
            <div className="space-y-6">
              {reviews.length > 0 ? reviews.map(review => (
                <div key={review._id} className="border-b last:border-0 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold">{review.user?.name || "Guest"}</span>
                    <span className="text-yellow-400 text-sm">{"★".repeat(review.rating)}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{review.comment}</p>
                  <div className="text-xs text-gray-400 mt-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
              )) : (
                <p className="text-gray-400 italic">No reviews yet. Be the first to leave one!</p>
              )}
            </div>
          </div>
          {/* ✅ REVIEWS SECTION END */}
        </div>

        {/* Booking Box */}
        <div className="bg-white shadow-xl p-6 rounded-3xl h-fit border border-gray-100 sticky top-8">
          <div className="text-2xl text-center font-bold text-gray-800">
            ₹{place.price} <span className="text-gray-500 text-base font-normal">/ night</span>
          </div>
          <div className="mt-4 border rounded-2xl overflow-hidden">
             <div className="p-3 border-b">
                <label className="text-xs font-black uppercase">Check-in</label>
                <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} className="w-full text-sm p-1 outline-none" />
             </div>
             <div className="p-3">
                <label className="text-xs font-black uppercase">Check-out</label>
                <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} className="w-full text-sm p-1 outline-none" />
             </div>
             <div className="p-3 border-t">
                <label className="text-xs font-black uppercase">Number of guests</label>
                <input type="number" value={numberOfGuests} onChange={e => setNumberOfGuests(e.target.value)} className="w-full text-sm p-1 outline-none" />
             </div>
             
             {numberOfNights > 0 && (
               <div className="p-3 border-t">
                  <label className="text-xs font-black uppercase">Your full name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" className="w-full text-sm p-1 outline-none border mb-2 rounded" />
                  <label className="text-xs font-black uppercase">Phone number</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 0000000000" className="w-full text-sm p-1 outline-none border rounded" />
               </div>
             )}
          </div>
          
          <button onClick={bookThisPlace} className="bg-primary text-white w-full py-3 rounded-2xl mt-4 font-bold text-lg hover:bg-opacity-90 transition-all">
            Reserve 
            {numberOfNights > 0 && (
              <span> ₹{numberOfNights * place.price}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}