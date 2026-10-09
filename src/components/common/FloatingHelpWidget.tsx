import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { MessageCircle, X, Clock, Phone, Send } from 'lucide-react';

export const FloatingHelpWidget: React.FC = () => {
  const { schoolData } = useSchool();
  const [isWhatsappHovered, setIsWhatsappHovered] = useState(false);

  const rawWhatsapp = schoolData.settings.whatsappNumber || '08022872299';
  const cleanWhatsapp = rawWhatsapp.replace(/[^0-9]/g, '');
  const internationalNumber = cleanWhatsapp.startsWith('0')
    ? '234' + cleanWhatsapp.substring(1)
    : cleanWhatsapp.startsWith('234')
    ? cleanWhatsapp
    : '234' + cleanWhatsapp;

  const whatsappUrl = `https://wa.me/${internationalNumber}?text=${encodeURIComponent(
    'Hello Bright Star College Lekki, I would like to inquire about admissions and campus information.'
  )}`;

  return (
    <aside aria-label="Admissions WhatsApp Support" className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto select-none">
      {/* WHATSAPP HOVER CARD POPUP */}
      {isWhatsappHovered && (
        <div
          onMouseEnter={() => setIsWhatsappHovered(true)}
          onMouseLeave={() => setIsWhatsappHovered(false)}
          className="w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-150 mb-1 pointer-events-auto"
        >
          {/* Card Header */}
          <div className="bg-[#075E54] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm text-white">
                BSC
              </div>
              <div>
                <h4 className="text-xs font-bold leading-tight">
                  Bright Star College Admissions
                </h4>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-200 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Online · Direct WhatsApp Support</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsWhatsappHovered(false)}
              className="text-white/80 hover:text-white p-1"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Card Body */}
          <div className="p-4 space-y-3 bg-slate-50">
            <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed shadow-2xs">
              <p className="font-semibold text-slate-900 mb-1">
                Have admissions or campus inquiries?
              </p>
              Connect directly with our admissions counselor in Lekki, Lagos on WhatsApp for immediate support.
            </div>

            <div className="text-xs font-semibold text-slate-800 flex items-center gap-2 px-1">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp / Tel: 08022872299</span>
            </div>

            {/* Direct WhatsApp Action */}
            <div className="pt-1">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            <div className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Office: {schoolData.settings.officeHours || 'Monday – Friday: 7:30 AM – 4:30 PM'}</span>
            </div>
          </div>
        </div>
      )}

      {/* WHATSAPP FLOATING BUTTON */}
      <div
        className="relative"
        onMouseEnter={() => setIsWhatsappHovered(true)}
      >
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1ebd5a] text-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 relative border-2 border-white"
          title="Chat with Bright Star College Admissions on WhatsApp (08022872299)"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-7 h-7 fill-white text-white" />
          {/* Notification Pulse Dot */}
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-[9px] font-black text-slate-950">
            1
          </span>
        </a>
      </div>
    </aside>
  );
};
