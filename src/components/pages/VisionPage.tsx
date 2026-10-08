import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  Compass,
  Sparkles,
  Users,
  Lightbulb,
  BookOpen,
  GraduationCap,
  ArrowRight,
  Target,
  ShieldCheck,
  Star
} from 'lucide-react';

export const VisionPage: React.FC = () => {
  const { schoolData, setActivePage } = useSchool();
  const { vision } = schoolData;

  const navigateToContact = () => {
    setActivePage('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const outcomeIcons = [
    { key: 'confident', icon: ShieldCheck, color: 'text-blue-700 bg-blue-50' },
    { key: 'responsible', icon: Users, color: 'text-emerald-700 bg-emerald-50' },
    { key: 'leaders', icon: Target, color: 'text-amber-700 bg-amber-50' },
    { key: 'creative', icon: Lightbulb, color: 'text-orange-700 bg-orange-50' },
    { key: 'lifelong', icon: BookOpen, color: 'text-indigo-700 bg-indigo-50' },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Page Header Banner */}
      <section className="bg-linear-to-b from-slate-950 to-blue-950 text-white py-16 md:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-amber-400/40 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ASPIRATION & PURPOSE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            {vision.title || 'Our Vision'}
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed">
            Nurturing young minds to shine brightly across Nigeria and the world through foundational wisdom, character, and lifelong curiosity.
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
              <span className="text-xs font-bold text-orange-600 uppercase tracking-wider block">
                OUR VISIONARY HORIZON
              </span>
              <span className="text-xs text-slate-400">
                BRIGHT STAR COLLEGE · LEKKI, LAGOS
              </span>
            </div>
          </div>

          <blockquote className="border-l-4 border-orange-500 pl-6 py-2 text-lg sm:text-xl font-semibold text-blue-950 leading-relaxed italic bg-orange-50/40 rounded-r-xl">
            "{vision.leadStatement}"
          </blockquote>

          <div className="text-sm sm:text-base text-slate-600 leading-relaxed space-y-4 pt-2">
            <p>{vision.fullContent}</p>
          </div>
        </div>
      </section>

      {/* The 5 Graduate Outcomes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
            THE FIVE CORNERSTONES
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 mt-1">
            Who a Bright Star College Graduate Becomes
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Every academic lesson, athletic endeavor, and disciplinary measure is tuned to form these 5 dimensions in each child.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vision.coreOutcomes.map((outcome, idx) => {
            const conf = outcomeIcons[idx % outcomeIcons.length];
            const Icon = conf.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${conf.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-blue-950">
                    {outcome.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    {outcome.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-amber-600">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>Lifelong Standard</span>
                </div>
              </div>
            );
          })}

          {/* Educational Promise Card */}
          <div className="bg-linear-to-br from-blue-900 to-blue-950 text-white rounded-xl p-6 flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-12 h-12 rounded-lg bg-blue-800 text-amber-400 flex items-center justify-center mb-4 border border-blue-700">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Global Competence
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 mt-2 leading-relaxed">
                Equipping graduates with universal academic competencies, technological acumen, and intercultural fluency to thrive anywhere in the world.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-blue-800 text-xs text-amber-300 font-semibold">
              Lekki, Lagos Standard of Excellence
            </div>
          </div>
        </div>
      </section>

      {/* Vision Call To Action */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-10 shadow-lg border border-slate-800 space-y-4">
          <h3 className="text-2xl font-bold text-white">
            Discover How Bright Star College Can Transform Your Child's Journey
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            Book an informative admissions consultation with our school administration in Lekki today.
          </p>
          <div className="pt-2">
            <button
              onClick={navigateToContact}
              className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-7 py-3 rounded-xl shadow-md transition-all text-xs tracking-wide uppercase inline-flex items-center gap-2"
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
