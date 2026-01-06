import React, { useState } from "react";

export default function FilterModal({ isOpen, onClose, onApply }) {
  // Local state to hold the user's choices before they click "Show places"
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // If the modal isn't open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      {/* Modal Container */}
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="font-bold text-lg">Filters</h2>
          <div className="w-9"></div> {/* Balancer */}
        </div>

        {/* Content Area */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-2">Price range</h3>
            <p className="text-gray-500 mb-6 text-sm">Nightly prices before fees and taxes</p>
            
            <div className="flex items-center gap-4">
              <div className="flex-1 border rounded-xl p-3 focus-within:ring-2 ring-black">
                <label className="text-xs text-gray-500 block">Minimum</label>
                <div className="flex items-center">
                  <span className="mr-1">₹</span>
                  <input 
                    type="number" 
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full outline-none text-sm" 
                  />
                </div>
              </div>
              <div className="w-4 h-[1px] bg-gray-400"></div>
              <div className="flex-1 border rounded-xl p-3 focus-within:ring-2 ring-black">
                <label className="text-xs text-gray-500 block">Maximum</label>
                <div className="flex items-center">
                  <span className="mr-1">₹</span>
                  <input 
                    type="number" 
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full outline-none text-sm" 
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-between items-center bg-white">
          <button 
            onClick={() => { setMinPrice(""); setMaxPrice(""); }}
            className="underline font-semibold text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-lg transition"
          >
            Clear all
          </button>
          <button 
            onClick={() => onApply({ minPrice, maxPrice })}
            className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition active:scale-95"
          >
            Show places
          </button>
        </div>
      </div>
    </div>
  );
}