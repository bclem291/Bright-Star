import React from 'react';
import { Star, Shield, Award, Sparkles, BookOpen } from 'lucide-react';

interface BrandedPlaceholderProps {
  title?: string;
  subtitle?: string;
  aspect?: 'hero' | 'card' | 'banner';
  className?: string;
}

export const BrandedPlaceholder: React.FC<BrandedPlaceholderProps> = ({
  title = 'BRIGHT STAR COLLEGE',
  subtitle = 'Lekki, Lagos, Nigeria · Excellence · Integrity · Discipline',
  aspect = 'hero',
  className = '',
}) => {
  if (aspect === 'card') {
    return (
      <div
        className={`relative w-full aspect-4/3 bg-linear-to-br from-blue-900 via-blue-950 to-slate-900 rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 text-center border border-blue-800/40 shadow-inner select-none ${className}`}
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#facc15_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10 w-14 h-14 rounded-full bg-blue-800/60 border border-amber-400/30 flex items-center justify-center mb-3 text-amber-400 shadow-md">
          <BookOpen className="w-7 h-7" />
        </div>

        <div className="relative z-10 font-bold text-white tracking-wide text-sm">
          {title}
        </div>
        <div className="relative z-10 text-xs text-blue-200/80 mt-1 line-clamp-2">
          {subtitle}
        </div>
        <div className="relative z-10 mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-950/80 border border-blue-700/50 text-[11px] text-amber-300 font-medium">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          Official School Gallery
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full min-h-[380px] md:min-h-[440px] bg-linear-to-br from-blue-950 via-slate-900 to-blue-900 rounded-2xl overflow-hidden flex flex-col items-center justify-center p-8 md:p-12 text-center border border-blue-800/50 shadow-2xl select-none ${className}`}
    >
      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#facc15_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
      
      {/* Subtle Gold Rays */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Crest Badge */}
      <div className="relative z-10 mb-5">
        <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-linear-to-b from-blue-800 to-blue-950 border-2 border-amber-400/60 shadow-xl flex flex-col items-center justify-center text-white p-3">
          <div className="flex items-center gap-1 text-amber-400 mb-1">
            <Star className="w-4 h-4 fill-amber-400" />
            <Shield className="w-6 h-6 text-amber-400" />
            <Star className="w-4 h-4 fill-amber-400" />
          </div>
          <span className="font-extrabold tracking-widest text-xl text-white">BSC</span>
          <span className="text-[10px] uppercase tracking-wider text-amber-300/90 font-medium">Lekki · Lagos</span>
        </div>
      </div>

      {/* School Headline */}
      <div className="relative z-10 max-w-xl">
        <div className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold tracking-wider text-amber-400 uppercase mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Citadel of Academic Excellence</span>
          <Sparkles className="w-4 h-4" />
        </div>
        <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          {title}
        </h3>
        <p className="text-sm md:text-base text-blue-100/90 mt-2 font-normal leading-relaxed">
          {subtitle}
        </p>

        {/* Feature Highlights Bar */}
        <div className="mt-6 pt-5 border-t border-blue-800/60 grid grid-cols-3 gap-3 text-center">
          <div className="flex flex-col items-center">
            <span className="text-amber-400 font-bold text-xs md:text-sm">British & Nigerian</span>
            <span className="text-blue-300/80 text-[11px]">Curriculum</span>
          </div>
          <div className="flex flex-col items-center border-x border-blue-800/60">
            <span className="text-amber-400 font-bold text-xs md:text-sm">Lekki Campus</span>
            <span className="text-blue-300/80 text-[11px]">Secure & Serene</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-amber-400 font-bold text-xs md:text-sm">Moral Discipline</span>
            <span className="text-blue-300/80 text-[11px]">Pastoral Care</span>
          </div>
        </div>
      </div>
    </div>
  );
};
