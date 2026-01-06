import {useParams, Navigate} from "react-router-dom";
import {useEffect, useState} from "react";
import api from "../api/api";
// ✅ axios import removed from here to fix the "defined but never used" warning
import AccountNav from "../AccountNav";
import BookingImg from "../BookingImg";
import toast from "react-hot-toast";

export default function BookingPage() {
  const {id} = useParams();
  const [booking, setBooking] = useState(null);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (id) {
      api.get('/bookings').then(response => {
        const foundBooking = response.data.find(({_id}) => _id === id);
        if (foundBooking) {
          setBooking(foundBooking);
        }
      }).catch(err => {
        console.error("Error fetching booking details:", err);
      });
    }
  }, [id]);

  async function cancelBooking() {
    const confirmed = window.confirm("Are you sure you want to cancel this booking?");
    if (confirmed) {
      try {
        // ✅ We are using 'api' here, so 'axios' is not needed
        await api.delete(`/bookings/${id}`); 
        toast.success("Booking cancelled");
        setRedirect(true); 
      } catch (e) {
        toast.error("Failed to cancel booking");
      }
    }
  }

  if (redirect) {
    return <Navigate to={'/account/bookings'} />;
  }

  if (!booking) {
    return <div className="p-8 text-center">Loading booking details...</div>;
  }

  return (
    <div className="my-8 max-w-5xl mx-auto px-4">
      <AccountNav />
      
      <div className="flex justify-between items-end mb-4">
        <h1 className="text-3xl font-bold">{booking.place.title}</h1>
        <button 
          onClick={cancelBooking}
          className="bg-gray-100 text-gray-600 px-4 py-2 rounded-2xl hover:bg-red-500 hover:text-white transition-all flex gap-1 items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
          Cancel Booking
        </button>
      </div>

      <div className="bg-gray-200 p-6 my-6 rounded-2xl flex items-center justify-between shadow-sm">
        <div>
          <h2 className="text-2xl mb-4 font-semibold">Your booking information:</h2>
          <div className="text-gray-700 text-lg">
            <b>Check-in:</b> {new Date(booking.checkIn).toLocaleDateString()} <br />
            <b>Check-out:</b> {new Date(booking.checkOut).toLocaleDateString()}
          </div>
        </div>
        <div className="bg-primary p-6 text-white rounded-2xl text-center shadow-md">
          <div className="uppercase text-sm">Total price</div>
          <div className="text-3xl font-bold">₹{booking.price}</div>
        </div>
      </div>
      
      <div className="rounded-3xl overflow-hidden shadow-lg">
        <BookingImg place={booking.place} className="w-full object-cover aspect-video" />
      </div>
    </div>
  );
}