import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-12 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Support Section */}
        <div>
          <h5 className="font-bold text-gray-900 mb-4">Support</h5>
          <ul className="space-y-3 text-gray-600 text-sm">
            <li className="hover:underline cursor-pointer">Help Centre</li>
            <li className="hover:underline cursor-pointer">AirCover</li>
            <li className="hover:underline cursor-pointer">Anti-discrimination</li>
            <li className="hover:underline cursor-pointer">Disability support</li>
          </ul>
        </div>

        {/* Hosting Section */}
        <div>
          <h5 className="font-bold text-gray-900 mb-4">Hosting</h5>
          <ul className="space-y-3 text-gray-600 text-sm">
            <li className="hover:underline cursor-pointer">WanderLust your home</li>
            <li className="hover:underline cursor-pointer">AirCover for Hosts</li>
            <li className="hover:underline cursor-pointer">Hosting resources</li>
            <li className="hover:underline cursor-pointer">Community forum</li>
          </ul>
        </div>

        {/* Airbnb Section */}
        <div>
          <h5 className="font-bold text-gray-900 mb-4">WanderLust</h5>
          <ul className="space-y-3 text-gray-600 text-sm">
            <li className="hover:underline cursor-pointer">Newsroom</li>
            <li className="hover:underline cursor-pointer">New features</li>
            <li className="hover:underline cursor-pointer">Careers</li>
            <li className="hover:underline cursor-pointer">Investors</li>
          </ul>
        </div>

        {/* Social / Legal Section */}
        <div>
          <h5 className="font-bold text-gray-900 mb-4">Follow us</h5>
          <div className="flex gap-4 text-gray-600">
            {/* You can add SVG icons here for FB, IG, Twitter */}
            <span>Facebook</span>
            <span>Instagram</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <div className="flex gap-2">
          <span>© 2026 WanderLust, Inc.</span>
          <span>·</span>
          <span className="hover:underline cursor-pointer">Privacy</span>
          <span>·</span>
          <span className="hover:underline cursor-pointer">Terms</span>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0 font-semibold text-gray-900">
          <span className="flex items-center gap-1 cursor-pointer">
            🌐 English (IN)
          </span>
          <span className="cursor-pointer">₹ INR</span>
        </div>
      </div>
    </footer>
  );
}