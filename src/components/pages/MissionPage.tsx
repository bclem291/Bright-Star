import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  BookOpen,
  ArrowRight
} from 'lucide-react';

export const MissionPage: React.FC = () => {
  const { schoolData, setActivePage } = useSchool();
  const { mission } = schoolData;

  const navigateToContact = () => {
    setActivePage('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Page Header Banner */}
      <section className="bg-linear-to-b from-blue-950 to-blue-900 text-white py-16 md:py-20 border-b border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            {mission.title || 'Our Mission'}
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-blue-100/90 leading-relaxed">
            Guiding every student at Bright Star College toward academic distinction, moral rectitude, and purposeful leadership in Nigeria and globally.
          </p>
        </div>
      </section>

      {/* Main Mission Statement Card */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-xl border border-slate-200/80 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center border border-blue-100">
              <BookOpen className="w-6 h-6 text-blue-800" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                BRIGHT STAR COLLEGE · LEKKI, LAGOS
              </span>
            </div>
          </div>

          <blockquote className="border-l-4 border-amber-500 pl-6 py-2 text-lg sm:text-xl font-semibold text-blue-950 leading-relaxed italic bg-amber-50/40 rounded-r-xl">
            &quot;{mission.leadStatement}&quot;
          </blockquote>

          <div className="text-sm sm:text-base text-slate-600 leading-relaxed space-y-4 pt-2">
            <p>{mission.fullContent}</p>
          </div>
        </div>
      </section>

      {/* Core Mission Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 mt-1">
            How We Deliver Our Mission
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Our mission translates into concrete, daily educational practices and principles within the Bright Star College community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mission.pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-bold text-blue-950">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Community Commitment */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100/80 rounded-2xl p-8 sm:p-10 border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h4 className="text-base font-bold text-blue-950">
              Rigour &amp; Intellectual Depth
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              We teach our learners the value of consistent preparation, analytical clarity, and self-motivated research.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-base font-bold text-blue-950">
              Personal Welfare &amp; Safety
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every child is known, protected, and encouraged in a compassionate environment where emotional health is safeguarded.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-base font-bold text-blue-950">
              Civic Honour &amp; Global Mindset
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Grounded in moral ethics and community responsibility, ready to excel in national examinations and international universities.
            </p>
          </div>
        </div>
      </section>

      {/* Mission CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-blue-900 text-white rounded-2xl p-8 sm:p-10 shadow-lg border border-blue-800 space-y-4">
          <h3 className="text-2xl font-bold text-white">
            Partner with Us in Shaping Your Child&apos;s Future
          </h3>
          <p className="text-xs sm:text-sm text-blue-100/90 max-w-lg mx-auto">
            Experience our disciplined learning atmosphere firsthand. Speak with the admissions officer today.
          </p>
          <div className="pt-2">
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
