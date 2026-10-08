import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Star, Shield, MapPin, Phone, Mail, Clock, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onOpenAdminLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdminLogin }) => {
  const { schoolData, setActivePage, isAdminLoggedIn } = useSchool();

  const handleNavClick = (page: string) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = schoolData.settings.socialLinks || {};
  // Only keep social media links that have actual URLs entered by the administrator
  const activeSocials = Object.entries(socialLinks).filter(
    ([_, url]) => url && url.trim().length > 0 && !url.includes('example.com')
  );

  return (
    <footer className="bg-slate-950 text-slate-300 border-t-4 border-orange-500">
      {/* Upper Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: School Identity */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex items-center gap-3">
              {schoolData.settings.logoUrl ? (
                <img
                  src={schoolData.settings.logoUrl}
                  alt={schoolData.settings.schoolName}
                  className="h-12 w-auto object-contain rounded-md bg-white p-1"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-linear-to-b from-blue-900 to-blue-950 border border-amber-400/80 flex flex-col items-center justify-center text-white shrink-0">
                  <div className="flex items-center gap-0.5 text-amber-400 -mb-0.5">
                    <Star className="w-2.5 h-2.5 fill-amber-400" />
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    <Star className="w-2.5 h-2.5 fill-amber-400" />
                  </div>
                  <span className="font-extrabold text-sm tracking-wider">BSC</span>
                </div>
              )}
              <div>
                <h4 className="font-extrabold text-base text-white tracking-tight">
                  {schoolData.settings.schoolName || 'BRIGHT STAR COLLEGE'}
                </h4>
                <p className="text-xs text-amber-400 font-medium">Lekki, Lagos, Nigeria</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {schoolData.settings.tagline}
            </p>

            <div className="pt-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Motto: </span>
              <span className="italic text-amber-300">{schoolData.settings.motto}</span>
            </div>

            {/* Official Social Links (Rendered ONLY if provided by admin) */}
            {activeSocials.length > 0 && (
              <div className="pt-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Official Channels
                </p>
                <div className="flex items-center gap-3">
                  {activeSocials.map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 text-xs rounded bg-slate-900 hover:bg-blue-900 text-slate-300 hover:text-white border border-slate-800 transition-colors capitalize"
                    >
                      {platform}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h5 className="text-sm font-bold text-white tracking-wider uppercase border-b border-slate-800 pb-2">
              Quick Navigation
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleNavClick('home')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <span>Home</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('mission')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <span>Our Mission</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('vision')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <span>Our Vision</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('gallery')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <span>School Gallery</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('contact')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <span>Contact & Admissions</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Academic & Campus Overview */}
          <div className="space-y-3">
            <h5 className="text-sm font-bold text-white tracking-wider uppercase border-b border-slate-800 pb-2">
              Academic Standards
            </h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bright Star College is committed to delivering qualitative education in Lekki, combining British and Nigerian educational standards to prepare students for academic excellence and ethical leadership.
            </p>
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800/80">
              <span className="text-[11px] font-semibold text-amber-400 block mb-1">
                Admissions Policy
              </span>
              <span className="text-[11px] text-slate-400">
                Open to prospective students across Lagos and Nigeria seeking disciplined, quality secondary education.
              </span>
            </div>
          </div>

          {/* Col 4: Campus Contact Details */}
          <div className="space-y-3">
            <h5 className="text-sm font-bold text-white tracking-wider uppercase border-b border-slate-800 pb-2">
              Campus Contact
            </h5>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  {schoolData.settings.address || 'Lekki'}, {schoolData.settings.cityState || 'Lagos, Nigeria'}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="break-words">
                  {schoolData.settings.phonePlaceholder}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="break-all">
                  {schoolData.settings.emailPlaceholder}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  {schoolData.settings.officeHours || 'Monday – Friday: 7:30 AM – 4:30 PM'}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="bg-black/80 py-4 px-4 sm:px-6 lg:px-8 border-t border-slate-900 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            {schoolData.settings.footerCopyright || `© ${new Date().getFullYear()} Bright Star College. All Rights Reserved.`}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (isAdminLoggedIn) {
                  setActivePage('admin');
                } else {
                  onOpenAdminLogin();
                }
              }}
              className="text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1 text-[11px]"
            >
              <span>{isAdminLoggedIn ? 'Admin Dashboard' : 'Staff Portal'}</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
            <span className="text-slate-700">·</span>
            <span>Lekki, Lagos State, Nigeria</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
