'use client';

import { useState, useRef, MouseEvent, TouchEvent } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductGallery({ images, name, discount, stock }: { images: string[], name: string, discount: number, stock: number }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, show: false });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    setZoomPos({ x: x * 100, y: y * 100, show: true });
  };

  const handleMouseLeave = () => setZoomPos({ ...zoomPos, show: false });

  // Mobile swipe support
  const touchStartX = useRef(0);
  const handleTouchStart = (e: TouchEvent) => (touchStartX.current = e.touches[0].clientX);
  const handleTouchEnd = (e: TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 50) setCurrentIndex((i) => Math.min(i + 1, images.length - 1));
    if (diff < -50) setCurrentIndex((i) => Math.max(i - 1, 0));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div 
        ref={containerRef}
        className="relative aspect-[4/5] sm:aspect-square bg-navy-50 rounded-[2rem] overflow-hidden cursor-zoom-in border border-border shadow-sm group"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            <Image
              src={images[currentIndex]}
              alt={`${name} - View ${currentIndex + 1}`}
              fill
              priority
              sizes="(max-width:768px) 100vw, 50vw"
              className={`object-cover transition-opacity duration-300 ${zoomPos.show ? 'opacity-0' : 'opacity-100'}`}
            />
            {/* Magnifier Effect */}
            {zoomPos.show && (
              <div 
                className="absolute inset-0 z-10 pointer-events-none hidden sm:block bg-no-repeat"
                style={{
                  backgroundImage: `url(${images[currentIndex]})`,
                  backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                  backgroundSize: '250%' // Mag level
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Badges */}
        {discount > 0 && (
          <div className="absolute top-5 left-5 bg-gradient-to-br from-primary-400 to-primary-600 text-white shadow-glow-saffron rounded-full px-3.5 py-1.5 text-xs font-black z-20">
            {discount}% OFF
          </div>
        )}
        {stock === 0 && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center z-20">
            <span className="bg-navy-900 border border-white/20 shadow-2xl text-white px-5 py-2.5 rounded-full font-bold tracking-widest text-sm">
              OUT OF STOCK
            </span>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 snap-x">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`relative flex-shrink-0 w-20 sm:w-24 aspect-square rounded-xl overflow-hidden border-2 transition-all snap-start ${
                i === currentIndex ? 'border-primary-500 shadow-md ring-2 ring-primary-500/20' : 'border-transparent opacity-60 hover:opacity-100 bg-navy-50'
              }`}
            >
              <Image src={img} alt={`Thumbnail ${i + 1}`} fill className="object-cover" sizes="96px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
