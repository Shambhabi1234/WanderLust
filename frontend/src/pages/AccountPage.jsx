import { useEffect, useState } from "react";
import { Navigate, useParams, Link } from "react-router-dom";

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [redirect, setRedirect] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false); // Prevents flash of empty profile

  // Get the subpage from the URL (e.g., /account/places)
  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = 'profile';
  }

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== "undefined") {
      setUser(JSON.parse(storedUser));
    }
    setIsLoaded(true);
  }, []);

  // 🔥 LOGOUT LOGIC: Clears storage and resets the app
  async function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Using window.location forces a full refresh so the Header clears
    window.location.href = '/login'; 
  }

  // 🔥 REDIRECT LOGIC: If user isn't logged in, send them to Login
  if (isLoaded && !user && !redirect) {
    return <Navigate to={'/login'} />;
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  // Helper function to style active vs inactive tabs
  function linkClasses(type = null) {
    let classes = 'py-2 px-6 rounded-full inline-flex gap-2 items-center transition-all ';
    if (type === subpage) {
      classes += 'bg-[#ff385c] text-white shadow-md'; // Primary Airbnb Red
    } else {
      classes += 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    }
    return classes;
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* --- NAVIGATION TABS --- */}
      <nav className="w-full flex justify-center mt-12 gap-2 mb-12">
        <Link className={linkClasses('profile')} to={'/account'}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.105a8.25 8.25 0 0115.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" />
          </svg>
          My profile
        </Link>
        <Link className={linkClasses('bookings')} to={'/account/bookings'}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          My bookings
        </Link>
        <Link className={linkClasses('places')} to={'/account/places'}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5-1.5l-3-1m-5.01 4.49l1.102-.401m-4.431 1.61l1.102-.401m-1.102 3.141l1.102-.401" />
          </svg>
          My accommodations
        </Link>
      </nav>

      {/* --- PROFILE SUBPAGE --- */}
      {subpage === 'profile' && (
        <div className="text-center max-w-lg mx-auto border p-8 rounded-3xl shadow-sm">
          <p className="text-lg mb-6">
            Logged in as <span className="font-bold text-xl block">{user?.name}</span> 
            <span className="text-gray-500 text-sm">({user?.email})</span>
          </p>
          <button onClick={logout} className="bg-[#ff385c] text-white p-3 w-full rounded-full font-bold hover:bg-opacity-90 transition">
            Logout
          </button>
        </div>
      )}

      {/* --- PLACES SUBPAGE --- */}
      {subpage === 'places' && (
        <div className="text-center mt-10">
           <Link className="inline-flex gap-1 bg-[#ff385c] text-white py-2 px-6 rounded-full font-bold" to={'/account/places/new'}>
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
               <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
             </svg>
             Add new place
           </Link>
           <div className="mt-8 text-gray-500 italic">
             Your added properties will appear here.
           </div>
        </div>
      )}
    </div>
  );
}