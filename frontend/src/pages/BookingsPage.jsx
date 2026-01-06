import {useEffect, useState} from "react";
import AccountNav from "../AccountNav";
import api from "../api/api";
import BookingImg from "../BookingImg";
import {format} from "date-fns"; // ✅ Removed differenceInCalendarDays to fix warning
import {Link} from "react-router-dom";
import toast from "react-hot-toast"; // ✅ Added for consistent feedback

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  
  // Fetch all stored bookings
  useEffect(() => {
    fetchBookings();
  }, []);

  function fetchBookings() {
    api.get('/bookings').then(response => {
      setBookings(response.data);
    });
  }

  // Function to remove a booking from the database
  async function handleCancel(ev, bookingId) {
    ev.preventDefault(); // Prevents the <Link> from navigating to the details page
    const confirmed = window.confirm("Are you sure you want to cancel this booking?");
    if (confirmed) {
      try {
        await api.delete(`/bookings/${bookingId}`);
        // Refresh the list after successful deletion
        setBookings(prev => prev.filter(b => b._id !== bookingId));
        toast.success("Booking cancelled successfully"); // ✅ Replaced alert with toast
      } catch (err) {
        toast.error("Could not cancel booking. Please try again.");
      }
    }
  }

  return (
    <div>
      <AccountNav />
      <div className="max-w-4xl mx-auto mt-8 px-4">
        {bookings?.length > 0 ? bookings.map(booking => (
          <div key={booking._id} className="relative group">
            <Link 
              to={`/account/bookings/${booking._id}`} 
              className="flex gap-4 bg-gray-100 rounded-2xl overflow-hidden mb-4 hover:bg-gray-200 transition-all border border-gray-200"
            >
              <div className="w-48 flex-shrink-0">
                <BookingImg place={booking.place} className="object-cover h-full" />
              </div>

              <div className="py-4 pr-3 grow">
                <h2 className="text-xl font-bold truncate">{booking.place.title}</h2>
                
                <div className="flex gap-2 items-center text-gray-600 border-t border-gray-300 mt-2 pt-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  <span>
                    {format(new Date(booking.checkIn), 'MMM d, yyyy')} &rarr; {format(new Date(booking.checkOut), 'MMM d, yyyy')}
                  </span>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <div className="flex gap-2 items-center text-gray-700">
                    <span className="text-lg font-semibold">
                      Total: ₹{booking.price}
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Cancel Button - Positioned absolutely inside the group */}
            <button 
              onClick={(ev) => handleCancel(ev, booking._id)}
              className="absolute top-4 right-4 p-2 bg-white text-gray-400 hover:text-red-500 rounded-full shadow-md transition-colors z-20"
              title="Cancel Booking"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          </div>
        )) : (
          <div className="text-center py-10">
            <h2 className="text-gray-500 text-xl italic">You haven't made any bookings yet!</h2>
          </div>
        )}
      </div>
    </div>
  );
}