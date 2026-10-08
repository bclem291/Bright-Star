import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { BrandedPlaceholder } from '../common/BrandedPlaceholder';
import {
  GraduationCap,
  Users,
  ShieldCheck,
  HeartHandshake,
  Sparkles,
  Award,
  ArrowRight,
  BookOpen,
  Compass,
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

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap':
        return <GraduationCap className="w-6 h-6 text-blue-700" />;
      case 'Users':
        return <Users className="w-6 h-6 text-blue-700" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-blue-700" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-6 h-6 text-blue-700" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-blue-700" />;
      case 'Award':
      default:
        return <Award className="w-6 h-6 text-blue-700" />;
    }
  };

  // Featured video or first video
  const featuredVideo = videos.find((v) => v.isFeatured) || videos[0];

  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative bg-linear-to-b from-blue-950 via-blue-900 to-slate-900 text-white overflow-hidden py-16 md:py-24">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#facc15_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute top-1/4 right-5 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-5 left-5 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Copy */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-800/80 border border-amber-400/40 text-amber-300 text-xs font-semibold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>BRIGHT STAR COLLEGE · LEKKI, LAGOS</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {home.heroTitle || 'Building Bright Minds for a Brighter Future'}
              </h1>

              <p className="text-base sm:text-lg text-blue-100/90 max-w-2xl font-normal leading-relaxed">
                {home.heroSubtitle ||
                  'Providing quality education in a nurturing, disciplined, and technologically enriched learning environment in Lekki, Lagos.'}
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => {
                    const aboutSection = document.getElementById('about-section');
                    aboutSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-white hover:bg-slate-100 text-blue-950 font-bold px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm tracking-wide uppercase inline-flex items-center gap-2"
                >
                  <span>{home.heroCtaPrimary || 'LEARN MORE'}</span>
                  <ArrowRight className="w-4 h-4 text-blue-900" />
                </button>

                <button
                  onClick={() => navigateTo('contact')}
                  className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg hover:shadow-orange-600/30 transition-all duration-200 text-sm tracking-wide uppercase inline-flex items-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>{home.heroCtaSecondary || 'CONTACT US'}</span>
                </button>
              </div>

              {/* Quick Pillars Strip */}
              <div className="pt-4 border-t border-blue-800/60 flex items-center gap-6 text-xs text-blue-200">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Nigerian & British Curriculum</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Lekki Peninsula Campus</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Area: Displays Official School Image OR Clean Branded Placeholder */}
            <div className="lg:col-span-5">
              {home.heroImageUrl ? (
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 aspect-4/3">
                  <img
                    src={home.heroImageUrl}
                    alt={home.heroTitle}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                      Bright Star College Campus
                    </span>
                    <span className="text-sm font-semibold text-white">
                      Lekki, Lagos, Nigeria
                    </span>
                  </div>
                </div>
              ) : (
                <BrandedPlaceholder
                  title={schoolData.settings.schoolName || 'BRIGHT STAR COLLEGE'}
                  subtitle="Lekki, Lagos, Nigeria · Excellence · Integrity · Discipline"
                  aspect="hero"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT THE SCHOOL */}
      <section id="about-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-orange-600 uppercase">
              <span className="w-6 h-0.5 bg-orange-600" />
              <span>ABOUT OUR COLLEGE</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-blue-950 tracking-tight">
              {home.aboutTitle || 'Welcome to Bright Star College'}
            </h2>

            <p className="text-base text-slate-600 leading-relaxed">
              {home.aboutContent ||
                'Bright Star College is committed to providing quality education, developing confident learners and preparing students for future success.'}
            </p>

            {/* Highlights List */}
            {home.aboutHighlights && home.aboutHighlights.length > 0 && (
              <div className="space-y-3 pt-2">
                {home.aboutHighlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700 font-medium">
                      {highlight}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4 flex items-center gap-4">
              <button
                onClick={() => navigateTo('mission')}
                className="bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs tracking-wide px-5 py-3 rounded-lg shadow-sm transition-colors uppercase inline-flex items-center gap-2"
              >
                <span>Read Full Mission & Vision</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="border-b border-blue-200/80 pb-4">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
                  A Message to Prospective Parents
                </span>
                <h3 className="text-xl font-bold text-blue-950 mt-1">
                  Nurturing Confident, Responsible Leaders in Lagos
                </h3>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                We understand the aspirations of Nigerian families who seek rigorous academic grounding balanced with sound moral upbringing. At Bright Star College, we foster high standards of discipline, respectful collaboration, and academic curiosity.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-white rounded-xl border border-blue-100 shadow-xs">
                  <span className="text-2xl font-black text-blue-900 block">Lekki</span>
                  <span className="text-xs text-slate-500 font-medium">Safe & Accessible Location</span>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-100 shadow-xs">
                  <span className="text-2xl font-black text-orange-600 block">100%</span>
                  <span className="text-xs text-slate-500 font-medium">Commitment to Every Child</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHY CHOOSE BRIGHT STAR COLLEGE */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
              OUR DISTINCT ADVANTAGES
            </span>
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
                  <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
                    {getIcon(feature.iconName)}
                  </div>
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
              <div className="w-12 h-12 rounded-xl bg-blue-800/80 border border-amber-400/40 flex items-center justify-center mb-4 text-amber-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                CORE PURPOSE
              </span>
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
                className="inline-flex items-center gap-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-400 text-blue-950 px-4 py-2.5 rounded-lg transition-colors uppercase tracking-wider"
              >
                <span>Read More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Vision Preview Card */}
          <div className="bg-linear-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-8 shadow-md flex flex-col justify-between border border-slate-800">
            <div>
              <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-amber-400/40 flex items-center justify-center mb-4 text-amber-400">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                FORWARD HORIZON
              </span>
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
                className="inline-flex items-center gap-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 text-white px-4 py-2.5 rounded-lg transition-colors uppercase tracking-wider"
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
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
              CAMPUS & STUDENT LIFE
            </span>
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
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-xs font-bold block truncate">
                    {img.title}
                  </span>
                  {img.caption && (
                    <span className="text-[11px] text-slate-200 truncate block">
                      {img.caption}
                    </span>
                  )}
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
