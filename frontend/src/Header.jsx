import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import CategoriesNav from "./CategoriesNav"; 

export default function Header() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData && userData !== "undefined") {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error("JSON parse error:", e);
        localStorage.removeItem("user"); 
      }
    }
  }, []);

  const isHomePage = location.pathname === "/";

  return (
    <header className="flex flex-col border-b border-gray-200 sticky top-0 bg-white z-50">
      <div className="flex justify-between items-center p-4">
        {/* Logo Section */}
        <Link to={'/'} className="flex items-center gap-1 text-[#ff385c]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 -rotate-90">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
          <span className="font-bold text-xl hidden sm:block">Wanderlust</span>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex gap-2 border border-gray-300 rounded-full py-2 px-4 shadow-sm">
          <button className="font-semibold px-2">Anywhere</button>
          <div className="border-l border-gray-300"></div>
          <button className="font-semibold px-2">Any week</button>
          <div className="border-l border-gray-300"></div>
          <button className="text-gray-500 px-2">Add guests</button>
        </div>

        {/* User Menu Section */}
        <Link to={user ? '/account' : '/login'} className="flex items-center gap-2 border border-gray-300 rounded-full py-2 px-4 shadow-sm hover:shadow-md transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
          <div className="bg-gray-500 text-white rounded-full border border-gray-500 overflow-hidden w-8 h-8 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 relative top-[2px]">
              <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
            </svg>
          </div>
          {!!user && (
            <span className="font-semibold hidden lg:block">{user.name}</span>
          )}
        </Link>
      </div>

      {/* Conditionally show categories ONLY on Home Page */}
      {isHomePage && (
        <div className="px-8 pb-2">
           <CategoriesNav /> 
        </div>
      )}
    </header>
  );
}