import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  Compass,
  ArrowRight
} from 'lucide-react';

export const VisionPage: React.FC = () => {
  const { schoolData, setActivePage } = useSchool();
  const { vision } = schoolData;

  const navigateToContact = () => {
    setActivePage('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Page Header Banner */}
      <section className="bg-linear-to-b from-slate-950 to-blue-950 text-white py-16 md:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            {vision.title || 'Our Vision'}
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed">
            Nurturing young minds to shine brightly across Nigeria and the world through foundational wisdom, character, and enduring intellectual curiosity.
          </p>
        </div>
      </section>

      {/* Main Vision Statement Card */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-xl border border-slate-200/80 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100">
              <Compass className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                BRIGHT STAR COLLEGE · PEACE ESTATE, LEKKI, LAGOS
              </span>
            </div>
          </div>

          <blockquote className="border-l-4 border-orange-500 pl-6 py-2 text-lg sm:text-xl font-semibold text-blue-950 leading-relaxed italic bg-orange-50/40 rounded-r-xl">
            &quot;{vision.leadStatement}&quot;
          </blockquote>

          <div className="text-sm sm:text-base text-slate-600 leading-relaxed space-y-4 pt-2">
            <p>{vision.fullContent}</p>
          </div>
        </div>
      </section>

      {/* Student Outcomes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 mt-1">
            Who Bright Star College Students Become
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Our holistic educational curriculum cultivates young women and men equipped with purpose and capability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vision.coreOutcomes.map((outcome, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-bold text-blue-950">
                  {outcome.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  {outcome.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Vision Call To Action */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-10 shadow-lg border border-slate-800 space-y-4">
          <h3 className="text-2xl font-bold text-white">
            Discover How Bright Star College Can Transform Your Child&apos;s Journey
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            Book an informative admissions consultation with our school administration in Peace Estate, Lekki today.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={navigateToContact}
              className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-7 py-3 rounded-xl shadow-md transition-all text-xs tracking-wide uppercase inline-flex items-center gap-2 cursor-pointer"
            >
              <span>CONTACT BRIGHT STAR COLLEGE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
