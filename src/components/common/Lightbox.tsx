import React, { useEffect, useCallback } from 'react';
import { GalleryItem } from '../../types';
import { X, ChevronLeft, ChevronRight, Calendar, Tag } from 'lucide-react';

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
          {currentImage.category && (
            <span className="text-xs text-amber-300 font-medium">
              · {currentImage.category}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all focus:outline-none focus:ring-2 focus:ring-amber-400"
          aria-label="Close Lightbox"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Image Display */}
      <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden max-w-6xl w-full mx-auto">
        {images.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-2 md:left-4 z-20 p-3 rounded-full bg-black/60 hover:bg-amber-500 hover:text-slate-950 text-white transition-all backdrop-blur-xs border border-white/10 shadow-lg"
            aria-label="Previous photograph"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        <img
          src={currentImage.url}
          alt={currentImage.altText || currentImage.title}
          className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl transition-all"
        />

        {images.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-2 md:right-4 z-20 p-3 rounded-full bg-black/60 hover:bg-amber-500 hover:text-slate-950 text-white transition-all backdrop-blur-xs border border-white/10 shadow-lg"
            aria-label="Next photograph"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Caption & Metadata Bar */}
      <div className="w-full max-w-3xl mx-auto text-center text-white z-10 pb-2">
        <h3 className="text-lg md:text-xl font-bold tracking-tight text-white">
          {currentImage.title}
        </h3>
        {currentImage.caption && (
          <p className="text-sm text-slate-300 mt-1 max-w-2xl mx-auto">
            {currentImage.caption}
          </p>
        )}
        <div className="flex items-center justify-center gap-4 text-xs text-slate-400 mt-2">
          {currentImage.uploadedAt && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              {currentImage.uploadedAt}
            </span>
          )}
          {currentImage.fileSize && (
            <span className="inline-flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              {currentImage.fileSize}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
