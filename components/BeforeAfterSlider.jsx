"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeftRight } from "lucide-react";
import Image from "next/image";

export default function BeforeAfterSlider() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = (event) => {
    if (!containerRef.current) return;

    const { left, width } = containerRef.current.getBoundingClientRect();
    const pageX = event.touches ? event.touches[0].pageX : event.pageX;
    const position = ((pageX - left) / width) * 100;

    setSliderPosition(Math.min(100, Math.max(0, position)));
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleMove);
      window.addEventListener("touchend", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-blue-900 mb-6 font-serif"
          >
            Real Results
          </motion.h2>
          <div className="w-24 h-1 bg-cyan-500 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            See the transformative power of our cosmetic and restorative dental procedures.
          </p>
        </div>

        <div className="relative w-full max-w-4xl mx-auto aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl border-4 border-gray-100 select-none cursor-ew-resize"
             ref={containerRef}
             onMouseDown={handleMouseDown}
             onTouchStart={handleMouseDown}
             onClick={handleMove}
        >
          {/* After Image (Background) */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="/g11.jpg" 
              alt="After Treatment"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-blue-900 px-3 py-1 rounded-full text-sm font-bold shadow-sm z-10">
              AFTER
            </div>
          </div>

          {/* Before Image (Clipped) */}
          <div 
            className="absolute inset-0 w-full h-full overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            <Image
              src="/g2.jpg" 
              alt="Before Treatment"
              fill
              className="object-cover"
              priority
            />
             {/* Filter to make 'Before' look a bit duller/different for impact if images are similar */}
            <div className="absolute inset-0 bg-sepia-[.3] mix-blend-multiply opacity-20"></div>
            
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-gray-600 px-3 py-1 rounded-full text-sm font-bold shadow-sm z-10">
              BEFORE
            </div>
          </div>

          {/* Slider Handle */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_10px_rgba(0,0,0,0.3)]"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform">
              <ArrowLeftRight className="w-5 h-5 text-cyan-500" />
            </div>
          </div>
        </div>
        
        <p className="text-center text-gray-400 text-sm mt-6 italic">
          * Drag slider to compare results
        </p>
      </div>
    </section>
  );
}
