import React, { useEffect, useCallback } from 'react';
import { GalleryItem } from '../../types';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxProps {
  images: GalleryItem[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  images,
  currentIndex,
  onClose,
  onNavigate,
}) => {
  const currentImage = images[currentIndex];

  const handleNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
      onNavigate(currentIndex + 1);
    } else {
      onNavigate(0); // Loop
    }
  }, [currentIndex, images.length, onNavigate]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    } else {
      onNavigate(images.length - 1); // Loop
    }
  }, [currentIndex, images.length, onNavigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, handleNext, handlePrev]);

  if (!currentImage) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 md:p-6 select-none animate-in fade-in duration-200">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between text-white z-10 w-full max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold tracking-wide text-blue-300">
            {currentIndex + 1} / {images.length}
          </span>
        </div>

        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer border border-white/20"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image Stage */}
      <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
        {images.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-2 md:left-4 z-20 p-3 rounded-full bg-black/60 hover:bg-amber-500 hover:text-slate-950 text-white transition-all backdrop-blur-xs border border-white/10 shadow-lg cursor-pointer"
            aria-label="Previous photograph"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        <img
          src={currentImage.url}
          alt={currentImage.altText || currentImage.title || 'Bright Star College'}
          className="max-h-[85vh] max-w-full object-contain rounded-lg shadow-2xl transition-all"
        />

        {images.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-2 md:right-4 z-20 p-3 rounded-full bg-black/60 hover:bg-amber-500 hover:text-slate-950 text-white transition-all backdrop-blur-xs border border-white/10 shadow-lg cursor-pointer"
            aria-label="Next photograph"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Clean footer spacer */}
      <div className="w-full max-w-3xl mx-auto text-center text-white z-10 pb-2" />
    </div>
  );
};
