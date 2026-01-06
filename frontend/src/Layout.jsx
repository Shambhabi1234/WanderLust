import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer"; // ✅ Import Footer
import { UserContextProvider } from "./UserContext";

export default function Layout() {
  return (
    <div className="py-4 px-8 flex flex-col min-h-screen max-w-6xl mx-auto">
      <UserContextProvider>
        <Header />
        {/* flex-grow ensures the footer stays at the bottom even on short pages */}
        <main className="mt-4 flex-grow">
          <Outlet />
        </main>
        <Footer /> {/* ✅ Add Footer here */}
      </UserContextProvider>
    </div>
  );
}