import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { schoolData, setActivePage } = useSchool();

  const handleNavClick = (id: string) => {
    setActivePage(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const rawWhatsapp = schoolData.settings.whatsappNumber || '08022872299';
  const cleanWhatsapp = rawWhatsapp.replace(/[^0-9]/g, '');

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900 select-none">
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={schoolData.settings.logoUrl || "https://i.ibb.co/vCJKQJg9/brihgt-star.png"}
                alt={schoolData.settings.schoolName || "Bright Star College"}
                className="h-12 w-auto object-contain rounded-md bg-white p-1"
              />
              <span className="font-extrabold text-base text-white tracking-tight leading-tight">
                {schoolData.settings.schoolName || 'BRIGHT STAR COLLEGE'}
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {schoolData.settings.tagline || 'Building Bright Minds for a Brighter Future'}
            </p>

            <div className="pt-2">
              <div className="inline-block px-3 py-1.5 rounded-lg bg-blue-950/70 border border-blue-900 text-amber-300 text-xs font-semibold">
                Lekki, Lagos · Nigeria
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h5 className="text-sm font-bold text-white tracking-wider uppercase border-b border-slate-800 pb-2">
              Quick Navigation
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleNavClick('home')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Home</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('mission')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Mission</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('vision')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Vision</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('gallery')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>School Gallery</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('contact')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Contact &amp; Admissions</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Academic Excellence */}
          <div className="space-y-3">
            <h5 className="text-sm font-bold text-white tracking-wider uppercase border-b border-slate-800 pb-2">
              Academic Excellence
            </h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bright Star College is committed to delivering qualitative education in Lekki, combining Nigerian and British educational curricula to prepare students for leadership, integrity, and future success.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Hello Bright Star College Admissions, I would like to make an inquiry.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebd5a] text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-colors shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                <span>Chat Admissions on WhatsApp</span>
              </a>
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
                  15, Prince Ade street, PEACE ESTATE, Lekki, Lagos
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <a
                  href="tel:08022872299"
                  className="hover:text-amber-300 transition-colors"
                >
                  08022872299
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <a
                  href={`https://wa.me/${cleanWhatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 transition-colors"
                >
                  WhatsApp: 08022872299
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="break-all">
                  {schoolData.settings.emailPlaceholder || 'info@brightstarcollege.ng'}
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
            <span>15, Prince Ade street, PEACE ESTATE, Lekki, Lagos</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
