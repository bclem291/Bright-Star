import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  Sparkles,
  ArrowRight,
  Video as VideoIcon,
  Image as ImageIcon,
  CheckCircle2,
  PhoneCall,
  ExternalLink,
  Play
} from 'lucide-react';

interface HomePageProps {
  onOpenLightbox: (index: number) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenLightbox }) => {
  const { schoolData, setActivePage } = useSchool();
  const { home, mission, vision, gallery, videos } = schoolData;

  const navigateTo = (page: string) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Featured video or first video
  const featuredVideo = videos.find((v) => v.isFeatured) || videos[0];

  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION WITH BACKGROUND PICTURE */}
      <section className="relative text-white overflow-hidden py-24 md:py-32 min-h-[580px] flex items-center">
        {/* Background School Picture */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-100 transition-transform duration-700"
          style={{
            backgroundImage: `url(${home.heroImageUrl || 'https://i.ibb.co/PvLmXqc3/312891.jpg'})`,
          }}
        />
        {/* Deep, Balanced Overlays for Superior Photo Visibility & Pristine Text Contrast */}
        <div className="absolute inset-0 bg-linear-to-r from-blue-950/85 via-blue-950/75 to-slate-950/70" />
        <div className="absolute inset-0 bg-linear-to-t from-blue-950/90 via-transparent to-black/40" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900/80 border border-amber-400/50 text-amber-300 text-xs font-semibold tracking-wider uppercase backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>BRIGHT STAR COLLEGE · PEACE ESTATE, LEKKI, LAGOS</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl drop-shadow-md">
            {home.heroTitle || 'Building Bright Minds for a Brighter Future'}
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-blue-100 max-w-3xl font-normal leading-relaxed drop-shadow-sm">
            {home.heroSubtitle ||
              'Providing qualitative education in a nurturing, disciplined, and technologically enriched learning environment in Peace Estate, Lekki, Lagos.'}
          </p>

          {/* CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                const aboutSection = document.getElementById('about-section');
                aboutSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white hover:bg-slate-100 text-blue-950 font-bold px-7 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm tracking-wide uppercase inline-flex items-center gap-2 cursor-pointer"
            >
              <span>{home.heroCtaPrimary || 'LEARN MORE'}</span>
              <ArrowRight className="w-4 h-4 text-blue-900" />
            </button>

            <button
              onClick={() => navigateTo('contact')}
              className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg hover:shadow-orange-600/30 transition-all duration-200 text-sm tracking-wide uppercase inline-flex items-center gap-2 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{home.heroCtaSecondary || 'CONTACT US'}</span>
            </button>

            <a
              href="https://wa.me/2348022872299?text=Hello%20Bright%20Star%20College%20Lekki%2C%20I%20would%20like%20to%20inquire%20about%20admissions."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold px-6 py-3.5 rounded-xl shadow-lg transition-all duration-200 text-sm tracking-wide uppercase inline-flex items-center gap-2 cursor-pointer"
            >
              <span>WHATSAPP US</span>
            </a>
          </div>

          {/* Quick Pillars Strip */}
          <div className="pt-4 border-t border-blue-800/60 flex flex-wrap items-center gap-6 text-xs text-blue-200">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Nigerian &amp; British Curriculum</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>15, Prince Ade Street, Peace Estate, Lekki</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Tel / WhatsApp: 08022872299</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT THE SCHOOL */}
      <section id="about-section" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs space-y-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-blue-950 tracking-tight">
            {home.aboutTitle || 'Welcome to Bright Star College'}
          </h2>

          {/* OUR CLASSES */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-950 rounded-2xl p-6 sm:p-7 text-white shadow-md border border-blue-800/60">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <h3 className="text-lg sm:text-xl font-black tracking-wider text-amber-300 uppercase">
                OUR CLASSES
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-4.5 hover:bg-white/15 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Basic Education</span>
                  <span className="text-[11px] font-semibold bg-amber-400/20 text-amber-200 px-2.5 py-0.5 rounded-full">3 Years</span>
                </div>
                <h4 className="text-base sm:text-lg font-extrabold text-white mt-1">
                  JUNIOR SECONDARY
                </h4>
                <p className="text-blue-100 text-sm font-semibold tracking-wide mt-1">
                  ( JSS1 – JSS3 )
                </p>
                <p className="text-xs text-blue-200/80 mt-2 leading-relaxed">
                  Solid foundation in science, arts, languages, and technical education preparing students for BECE certification.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-4.5 hover:bg-white/15 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Post-Basic Education</span>
                  <span className="text-[11px] font-semibold bg-amber-400/20 text-amber-200 px-2.5 py-0.5 rounded-full">3 Years</span>
                </div>
                <h4 className="text-base sm:text-lg font-extrabold text-white mt-1">
                  SENIOR SECONDARY
                </h4>
                <p className="text-blue-100 text-sm font-semibold tracking-wide mt-1">
                  ( SSS1 – SSS3 )
                </p>
                <p className="text-xs text-blue-200/80 mt-2 leading-relaxed">
                  Specialized academic tracks in Science, Arts, and Commercial departments preparing students for WAEC, NECO, and JAMB.
                </p>
              </div>
            </div>
          </div>

          <p className="text-base text-slate-600 leading-relaxed">
            {home.aboutContent ||
              'Bright Star College is committed to providing quality education, developing confident learners and preparing students for future success.'}
          </p>

          {/* Highlights List */}
          {home.aboutHighlights && home.aboutHighlights.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {home.aboutHighlights.map((highlight, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-700 font-medium">
                    {highlight}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="pt-4 flex items-center gap-4 border-t border-slate-100">
            <button
              onClick={() => navigateTo('mission')}
              className="bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs tracking-wide px-6 py-3 rounded-xl shadow-xs transition-colors uppercase inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Read Full Mission &amp; Vision</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. WHY CHOOSE BRIGHT STAR COLLEGE */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-blue-950 mt-1">
              Why Choose Bright Star College
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-3">
              We provide a balanced ecosystem where intellectual curiosity flourishes alongside character, leadership, and emotional resilience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {home.features.map((feature) => (
              <div
                key={feature.id}
                className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-bold text-blue-950">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. MISSION & VISION PREVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission Preview Card */}
          <div className="bg-linear-to-br from-blue-900 to-blue-950 text-white rounded-2xl p-8 shadow-md flex flex-col justify-between border border-blue-800">
            <div>
              <h3 className="text-2xl font-bold text-white mt-1">
                {mission.title || 'Our Mission'}
              </h3>
              <p className="text-sm text-blue-100/90 mt-3 leading-relaxed">
                {mission.leadStatement}
              </p>
            </div>

            <div className="pt-6">
              <button
                onClick={() => navigateTo('mission')}
                className="inline-flex items-center gap-2 text-xs font-bold text-blue-950 bg-amber-500 hover:bg-amber-400 px-4 py-2.5 rounded-lg transition-colors uppercase tracking-wider"
              >
                <span>Read More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Vision Preview Card */}
          <div className="bg-linear-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-8 shadow-md flex flex-col justify-between border border-slate-800">
            <div>
              <h3 className="text-2xl font-bold text-white mt-1">
                {vision.title || 'Our Vision'}
              </h3>
              <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                {vision.leadStatement}
              </p>
            </div>

            <div className="pt-6">
              <button
                onClick={() => navigateTo('vision')}
                className="inline-flex items-center gap-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 px-4 py-2.5 rounded-lg transition-colors uppercase tracking-wider"
              >
                <span>Read More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. GALLERY PREVIEW SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 mt-1">
              School Gallery Preview
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Visual glimpses into academic sessions, practical labs, and co-curricular moments.
            </p>
          </div>

          <button
            onClick={() => navigateTo('gallery')}
            className="self-start sm:self-auto bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold tracking-wider px-4 py-2.5 rounded-lg transition-colors uppercase inline-flex items-center gap-2"
          >
            <span>VIEW FULL GALLERY</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Gallery Grid or Professional Empty State */}
        {gallery.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.slice(0, 6).map((img, index) => (
              <div
                key={img.id}
                onClick={() => onOpenLightbox(index)}
                className="group relative cursor-pointer overflow-hidden rounded-xl bg-slate-100 border border-slate-200 aspect-4/3 shadow-xs hover:shadow-lg transition-all"
              >
                <img
                  src={img.url}
                  alt={img.altText || img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="p-3 rounded-full bg-white/20 backdrop-blur-xs text-white border border-white/40 shadow-lg scale-90 group-hover:scale-100 transition-transform">
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Strictly Professional Branded Empty State */
          <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-10 text-center max-w-2xl mx-auto space-y-3">
            <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center mx-auto">
              <ImageIcon className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-blue-950">
              School gallery images will appear here.
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Photographs will be uploaded by the school administrator through the management dashboard. No random stock photos are used.
            </p>
          </div>
        )}
      </section>

      {/* 6. SCHOOL VIDEO SECTION */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
              <VideoIcon className="w-4 h-4" />
              <span>OFFICIAL BROADCASTS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
              School Video Showcase
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              Official video tours and special campus presentations supplied by the school administration.
            </p>
          </div>

          {videos.length > 0 && featuredVideo ? (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Responsive Video Container */}
              <div className="relative aspect-16/9 w-full bg-black rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
                <iframe
                  src={featuredVideo.embedUrl}
                  title={featuredVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      {featuredVideo.source === 'youtube' ? 'YouTube' : 'Google Drive'}
                    </span>
                    <span className="text-slate-500">·</span>
                    <span className="text-xs text-slate-400">{featuredVideo.createdAt}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">
                    {featuredVideo.title}
                  </h3>
                  {featuredVideo.description && (
                    <p className="text-xs text-slate-300 mt-1 max-w-xl">
                      {featuredVideo.description}
                    </p>
                  )}
                </div>

                <a
                  href={featuredVideo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-xs text-amber-300 hover:text-white inline-flex items-center gap-1.5 border border-slate-600 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <span>Open Video Link</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Extra videos grid if more than 1 */}
              {videos.length > 1 && (
                <div className="pt-6 border-t border-slate-800">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                    Additional Videos ({videos.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {videos.map((vid) => (
                      <div
                        key={vid.id}
                        className="bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-amber-400/50 transition-colors"
                      >
                        <span className="text-[10px] font-bold text-amber-400 uppercase">
                          {vid.source}
                        </span>
                        <h5 className="text-sm font-semibold text-white mt-1 truncate">
                          {vid.title}
                        </h5>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {vid.description || 'Bright Star College video recording.'}
                        </p>
                        <a
                          href={vid.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 text-xs text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 font-medium"
                        >
                          <Play className="w-3 h-3" />
                          <span>Watch video</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Clean Branded Empty State */
            <div className="bg-slate-800/60 border border-dashed border-slate-700 rounded-2xl p-10 text-center max-w-xl mx-auto space-y-3">
              <div className="w-14 h-14 rounded-full bg-slate-700 text-amber-400 flex items-center justify-center mx-auto">
                <VideoIcon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">
                School videos will appear here.
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Official school tour videos, speech and prize-giving ceremonies, and sports day recordings will be linked by the administrator.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 7. CONTACT CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-linear-to-r from-blue-900 via-blue-950 to-blue-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-blue-800 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
              ADMISSIONS & ENROLMENT
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {home.contactCtaTitle || 'Give Your Child a Bright Future'}
            </h2>
            <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
              {home.contactCtaSubtitle ||
                'Speak with our admissions team today to schedule an exploratory campus visit or obtain enrolment documentation.'}
            </p>
            <div className="pt-3">
              <button
                onClick={() => navigateTo('contact')}
                className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition-all text-sm tracking-wide uppercase inline-flex items-center gap-2"
              >
                <span>CONTACT US</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
