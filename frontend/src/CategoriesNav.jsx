import React, { useRef, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import FilterModal from "./FilterModal";

const categories = [
  { label: "All Magic", value: "all", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3" },
  { label: "Castles", value: "castles", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5" },
  { label: "Enchanted", value: "enchanted", icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.143-7.714L1 12l6.857-2.143L11 3z" },
  { label: "Palaces", value: "palaces", icon: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3" },
  { label: "Forests", value: "forests", icon: "M12 3l8 14H4L12 3z M12 21V12" },
  { label: "Gardens", value: "gardens", icon: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v12M6 12h12" },
  { label: "Islands", value: "islands", icon: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707" },
  { label: "Carriages", value: "carriages", icon: "M8 19a2 2 0 100-4 2 2 0 000 4z M16 19a2 2 0 100-4 2 2 0 000 4z M2 9h20M5 9V7a2 2 0 012-2h10a2 2 0 012 2v2" },
  { label: "Hidden Gems", value: "hidden", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
  { label: "Royal Rooms", value: "rooms", icon: "M3 12h18M3 6h18M3 18h18" },
  { label: "Lakeside", value: "Lakeside", icon: "M2 12s3-3 10-3 10 3 10 3M2 16s3-3 10-3 10 3 10 3" },
  { label: "Towers", value: "towers", icon: "M9 22V12h6v10M8 6h8L12 2z" },
  { label: "Magic Pools", value: "pools", icon: "M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { label: "Design", value: "design", icon: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" },
  { label: "Caves", value: "caves", icon: "M12 2L2 7v10l10 5 10-5V7L12 2z" },
  { label: "Countryside", value: "countryside", icon: "M2 20h20M5 20V8l7-5 7 5v12" },
  { label: "Cabins", value: "cabins", icon: "M3 20h18M3 10l9-7 9 7v10H3V10z" },
  { label: "Tiny Homes", value: "tiny", icon: "M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3m10-11l2 2" },
  { label: "Farms", value: "farms", icon: "M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5" },
  { label: "Amazing Views", value: "views", icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
];

export default function CategoriesNav() {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // State to control the Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const active = searchParams.get("category") || "all";

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      setTimeout(checkScroll, 400); 
    }
  };

  const handleClick = (val) => {
    if (val === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", val);
    }
    setSearchParams(searchParams);
  };

  const handleApplyFilters = (filters) => {
    if (filters.minPrice) {
      searchParams.set("minPrice", filters.minPrice);
    } else {
      searchParams.delete("minPrice");
    }

    if (filters.maxPrice) {
      searchParams.set("maxPrice", filters.maxPrice);
    } else {
      searchParams.delete("maxPrice");
    }

    setSearchParams(searchParams);
    setIsModalOpen(false); 
  };

  return (
    <>
      <div className="flex items-center bg-white px-4 md:px-10 lg:px-16 py-4 border-b sticky top-[80px] z-20 gap-4">
        
        {/* LEFT SIDE: Category Label */}
        <div className="hidden xl:flex flex-col flex-shrink-0 pr-6 border-r mr-2">
          <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Category</span>
          <span className="text-sm font-extrabold text-black">Magic</span>
        </div>

        {/* CENTER: Horizontal Icon Scroll */}
        <div className="relative flex items-center flex-grow overflow-hidden">
          {showLeftArrow && (
            <div className="absolute left-0 flex items-center bg-gradient-to-r from-white via-white/90 to-transparent pr-12 h-full z-30">
              <button onClick={() => scroll("left")} className="p-1 border rounded-full bg-white shadow-md hover:scale-110 transition">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
              </button>
            </div>
          )}

          <div ref={scrollRef} onScroll={checkScroll} className="flex gap-10 items-center overflow-x-auto no-scrollbar whitespace-nowrap flex-grow scroll-smooth">
            {categories.map((cat) => (
              <div 
                key={cat.value} 
                onClick={() => handleClick(cat.value)} 
                className={`flex flex-col items-center gap-2 cursor-pointer pb-2 flex-shrink-0 transition-all ${
                  active === cat.value 
                  ? "opacity-100 border-b-2 border-black scale-105" 
                  : "opacity-60 hover:opacity-100 border-b-2 border-transparent hover:border-gray-300"
                }`}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={cat.icon} />
                </svg>
                <span className="text-[12px] font-semibold">{cat.label}</span>
              </div>
            ))}
          </div>

          {showRightArrow && (
            <div className="absolute right-0 flex items-center bg-gradient-to-l from-white via-white/90 to-transparent pl-12 h-full z-30">
              <button onClick={() => scroll("right")} className="p-1 border rounded-full bg-white shadow-md hover:scale-110 transition">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
              </button>
            </div>
          )}
        </div>

        {/* RIGHT SIDE: Filters Button */}
        <div className="hidden md:flex items-center gap-3 ml-4">
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold hover:shadow-md transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0m-6.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 12H13.5" />
            </svg>
            Filters
          </button>
        </div>
      </div>

      {/* Modal Component */}
      <FilterModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onApply={handleApplyFilters} 
      />
    </>
  );
}