import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Menu, X, Star, Phone, MapPin } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { schoolData, activePage, setActivePage } = useSchool();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'HOME' },
    { id: 'mission', label: 'MISSION' },
    { id: 'vision', label: 'VISION' },
    { id: 'gallery', label: 'GALLERY' },
    { id: 'contact', label: 'CONTACT' },
  ];

  const handleNavClick = (id: string) => {
    setActivePage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Announcements & Contact Bar */}
      <div className="bg-blue-950 text-white text-xs py-2 px-4 border-b border-blue-900 hidden sm:block select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1.5 text-blue-200">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>15, Prince Ade street, PEACE ESTATE, Lekki, Lagos</span>
            </span>
            <a
              href="tel:08022872299"
              className="inline-flex items-center gap-1.5 text-blue-200 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>08022872299</span>
            </a>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-amber-300 font-semibold flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-300" />
              Admissions Open for New Academic Session
            </span>
            <button
              onClick={() => handleNavClick('contact')}
              className="text-xs bg-amber-500 hover:bg-amber-400 text-blue-950 font-bold px-2.5 py-0.5 rounded transition-colors cursor-pointer"
            >
              Enroll Now
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo and School Name */}
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 group text-left focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-lg p-1 cursor-pointer"
              aria-label="Bright Star College Home"
            >
              <img
                src={schoolData.settings.logoUrl || "https://i.ibb.co/vCJKQJg9/brihgt-star.png"}
                alt={schoolData.settings.schoolName || "Bright Star College"}
                className="h-14 w-auto object-contain rounded-md"
              />

              <div className="flex flex-col">
                <span className="font-extrabold text-lg sm:text-xl text-blue-950 tracking-tight leading-tight group-hover:text-blue-700 transition-colors">
                  {schoolData.settings.schoolName || 'BRIGHT STAR COLLEGE'}
                </span>
                <span className="text-[11px] font-semibold tracking-wider uppercase text-amber-600">
                  Peace Estate, Lekki, Lagos
                </span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => {
                const isActive = activePage === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`px-3.5 py-2 text-sm font-semibold tracking-wide transition-colors relative cursor-pointer ${
                      isActive
                        ? 'text-blue-900'
                        : 'text-slate-600 hover:text-blue-800'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-orange-600 rounded-full" />
                    )}
                  </button>
                );
              })}

              {/* Quick Contact CTA Button */}
              <button
                onClick={() => handleNavClick('contact')}
                className="ml-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs tracking-wide px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all uppercase cursor-pointer"
              >
                Admissions
              </button>
            </nav>

            {/* Mobile Actions: Hamburger Button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200 focus:outline-none cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 shadow-xl animate-in fade-in duration-150">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const isActive = activePage === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`text-left px-3 py-2.5 rounded-lg text-sm font-semibold tracking-wide transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-blue-50 text-blue-950 font-bold border-l-4 border-orange-500 pl-3'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}

              <div className="pt-3 border-t border-slate-200 mt-2 flex flex-col gap-2">
                <button
                  onClick={() => handleNavClick('contact')}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold text-center text-sm py-2.5 rounded-lg shadow-sm cursor-pointer"
                >
                  Contact Admissions
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
