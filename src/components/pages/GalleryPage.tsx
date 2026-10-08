import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  Image as ImageIcon,
  Sparkles,
  Calendar,
  Eye,
  Camera,
  Filter
} from 'lucide-react';

interface GalleryPageProps {
  onOpenLightbox: (index: number) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ onOpenLightbox }) => {
  const { schoolData } = useSchool();
  const { gallery } = schoolData;
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Campus Life', 'Academics & Labs', 'Sports & Athletics', 'Events & Assemblies'];

  const filteredImages = gallery.filter((item) => {
    if (selectedCategory === 'All') return true;
    return item.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="space-y-12 pb-20">
      {/* Header Banner */}
      <section className="bg-linear-to-b from-blue-950 to-blue-900 text-white py-16 md:py-20 border-b border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-800/80 border border-amber-400/40 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5" />
            <span>OFFICIAL ARCHIVE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            SCHOOL GALLERY
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-blue-100/90 leading-relaxed">
            Moments of discovery, sportsmanship, and student achievement captured across our Lekki campus.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Filter Controls */}
        {gallery.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-2 uppercase tracking-wider">
              <Filter className="w-3.5 h-3.5" />
              Filter:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:text-blue-900 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Gallery Grid or Empty State */}
        {gallery.length === 0 ? (
          /* Empty State strictly following user prompt instructions */
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 sm:p-16 text-center max-w-2xl mx-auto shadow-xs space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center mx-auto border border-blue-100">
              <ImageIcon className="w-8 h-8 text-blue-700" />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-blue-950">
              No gallery images have been uploaded yet.
            </h2>

            <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Official school photographs of our students, classrooms, laboratories, and school activities will be uploaded by the administrator.
            </p>

            <div className="pt-2 text-xs text-amber-700 font-semibold bg-amber-50 py-2 px-4 rounded-lg inline-block border border-amber-200/60">
              Bright Star College · Lekki, Lagos
            </div>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            No photographs found under the &quot;{selectedCategory}&quot; category.
          </div>
        ) : (
          /* Modern Responsive Photo Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredImages.map((img) => {
              // Find real index in overall gallery array for lightbox
              const realIndex = gallery.findIndex((g) => g.id === img.id);

              return (
                <div
                  key={img.id}
                  onClick={() => onOpenLightbox(realIndex !== -1 ? realIndex : 0)}
                  className="group relative cursor-pointer bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  {/* Image Container with Hover Zoom */}
                  <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                    <img
                      src={img.url}
                      alt={img.altText || img.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="p-3 rounded-full bg-white/20 backdrop-blur-xs text-white border border-white/40 shadow-lg scale-90 group-hover:scale-100 transition-transform">
                        <Eye className="w-5 h-5" />
                      </span>
                    </div>

                    {img.category && (
                      <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        {img.category}
                      </span>
                    )}
                  </div>

                  {/* Caption & Metadata Below */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-blue-950 group-hover:text-blue-700 transition-colors">
                        {img.title}
                      </h3>
                      {img.caption && (
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                          {img.caption}
                        </p>
                      )}
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        {img.uploadedAt}
                      </span>
                      <span className="text-blue-700 font-medium group-hover:underline">
                        View Photo
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
