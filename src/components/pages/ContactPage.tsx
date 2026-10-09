import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageCircle
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { schoolData, submitContactForm } = useSchool();
  const { settings } = schoolData;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastMailtoUrl, setLastMailtoUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const targetEmail = 'Bclem291@gmail.com';
  const cleanWhatsapp = '2348022872299';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validations
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address (e.g. name@example.com).');
      return;
    }
    if (!message.trim()) {
      setErrorMessage('Please enter your message.');
      return;
    }

    setIsSubmitting(true);

    const emailSubject = `Bright Star College Admission Inquiry: ${subject.trim() || 'Prospective Student Application'} - ${fullName.trim()}`;
    const emailBody = `Admission & Enrollment Inquiry - Bright Star College, Lekki

Applicant / Parent Name: ${fullName.trim()}
Email Address: ${email.trim()}
Phone Number: ${phone.trim() || 'Not specified'}
Subject: ${subject.trim() || 'Admissions Inquiry'}

Message Details:
${message.trim()}

---
Submitted via Bright Star College Admissions Portal
Campus: 15, Prince Ade street, PEACE ESTATE, Lekki, Lagos`;

    const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    setLastMailtoUrl(mailtoUrl);

    try {
      await submitContactForm({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        subject: subject.trim() || 'Admission Inquiry',
        message: message.trim(),
      });
    } catch (err) {
      console.warn('Form submission local note:', err);
    }

    setIsSubmitting(false);
    setIsSuccess(true);

    // Trigger email client directly
    try {
      window.location.href = mailtoUrl;
    } catch (err) {
      console.warn('Mail client redirect note:', err);
    }

    // Reset form fields
    setFullName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Header Banner */}
      <section className="bg-linear-to-b from-blue-950 to-blue-900 text-white py-16 md:py-20 border-b border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            CONTACT &amp; ADMISSIONS
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-blue-100/90 leading-relaxed">
            Reach out to Bright Star College, Lekki, Lagos. We look forward to welcoming you and answering all your questions.
          </p>
        </div>
      </section>

      {/* Main Content: Info & Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              <div>
                <span className="text-xs font-bold text-orange-600 uppercase tracking-wider block">
                  CAMPUS DIRECTORY
                </span>
                <h2 className="text-2xl font-extrabold text-blue-950 mt-1">
                  Bright Star College
                </h2>
                <p className="text-xs text-amber-600 font-semibold mt-0.5">
                  Peace Estate, Lekki, Lagos, Nigeria
                </p>
              </div>

              <div className="space-y-5 pt-2">
                {/* Address */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center shrink-0 border border-blue-100">
                    <MapPin className="w-5 h-5 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Campus Location
                    </h3>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5">
                      15, Prince Ade street, PEACE ESTATE
                    </p>
                    <p className="text-xs text-slate-500">
                      Lekki, Lagos, Nigeria
                    </p>
                  </div>
                </div>

                {/* Telephone */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center shrink-0 border border-blue-100">
                    <Phone className="w-5 h-5 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Telephone / Admissions Desk
                    </h3>
                    <a
                      href="tel:08022872299"
                      className="text-sm font-semibold text-blue-900 hover:text-orange-600 transition-colors mt-0.5 block"
                    >
                      08022872299
                    </a>
                    <span className="text-[11px] text-slate-400">
                      Direct admissions calls
                    </span>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-100">
                    <MessageCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Official WhatsApp
                    </h3>
                    <a
                      href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Hello Bright Star College Lekki, I would like to inquire about admissions.')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors mt-0.5 inline-flex items-center gap-1.5"
                    >
                      <span>08022872299</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <span className="text-[11px] text-slate-400 block">
                      Direct WhatsApp chat available
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center shrink-0 border border-blue-100">
                    <Mail className="w-5 h-5 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Official Email
                    </h3>
                    <a
                      href={`mailto:${targetEmail}`}
                      className="text-sm font-semibold text-blue-900 hover:text-orange-600 transition-colors mt-0.5 block break-all"
                    >
                      {targetEmail}
                    </a>
                    <span className="text-[11px] text-slate-400">
                      Admissions application correspondence
                    </span>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center shrink-0 border border-blue-100">
                    <Clock className="w-5 h-5 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Administrative Office Hours
                    </h3>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5">
                      {settings.officeHours || 'Monday – Friday: 7:30 AM – 4:30 PM'}
                    </p>
                    <span className="text-[11px] text-slate-400">
                      West Africa Time (WAT)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Admission Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200/80 shadow-xs">
              <div className="mb-6">
                <span className="text-xs font-bold text-orange-600 uppercase tracking-wider block">
                  ADMISSIONS FORM
                </span>
                <h2 className="text-2xl font-extrabold text-blue-950 mt-1">
                  Apply &amp; Send Inquiry to Email
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Fill in your details below. Your admission form will be submitted and sent directly to our admissions email ({targetEmail}).
                </p>
              </div>

              {/* Status Notifications */}
              {isSuccess && (
                <div className="mb-6 p-5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 space-y-3 animate-in fade-in">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm">
                      <span className="font-bold block text-emerald-950">Thank you for submitting the admission form!</span>
                      Your application inquiry has been processed and prepared to send directly to our admissions office email ({targetEmail}).
                    </div>
                  </div>

                  {lastMailtoUrl && (
                    <div className="pt-2 border-t border-emerald-200 flex flex-wrap items-center justify-between gap-3">
                      <span className="text-xs text-emerald-800">
                        Did your email app not open automatically?
                      </span>
                      <a
                        href={lastMailtoUrl}
                        className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs py-2 px-4 rounded-lg inline-flex items-center gap-1.5 shadow-xs transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        <span>Send via Email App</span>
                      </a>
                    </div>
                  )}
                </div>
              )}

              {errorMessage && (
                <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 animate-in fade-in">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm font-medium">
                    {errorMessage}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Mr. & Mrs. Adeleke"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                      required
                    />
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="parent@example.com"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="08022872299"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Admissions inquiry / Enrolment grade"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Admission Inquiry / Details <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please specify child's age, intended class/grade, previous school records, or specific questions..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm resize-none"
                    required
                  />
                </div>

                {/* Notice that admission form sends to email */}
                <div className="p-3 bg-blue-50/70 rounded-lg border border-blue-200 text-[11px] text-blue-900 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-700 shrink-0" />
                  <span>Submitting this form forwards your completed admission inquiry directly to our admissions desk email ({targetEmail}).</span>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-blue-900 hover:bg-blue-800 disabled:bg-slate-400 text-white font-bold px-8 py-3.5 rounded-xl shadow-md transition-all text-xs tracking-wider uppercase inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>SENDING ADMISSION FORM...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>SEND ADMISSION FORM TO EMAIL</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* MAP SECTION: 15, Prince Ade street, PEACE ESTATE, Lekki, lagos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                CAMPUS LOCATION
              </span>
              <h3 className="text-xl font-bold text-blue-950 mt-0.5">
                Peace Estate, Lekki, Lagos
              </h3>
              <p className="text-xs text-slate-500">
                15, Prince Ade street, PEACE ESTATE, Lekki, Lagos, Nigeria.
              </p>
            </div>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                '15 Prince Ade Street, Peace Estate, Lekki, Lagos, Nigeria'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="self-start sm:self-auto bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-semibold px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              <span>View on Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Location Visual Box */}
          <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-blue-900 text-amber-400 flex items-center justify-center shadow-lg mb-3">
              <MapPin className="w-7 h-7" />
            </div>

            <h4 className="text-base font-bold text-blue-950">
              BRIGHT STAR COLLEGE CAMPUS
            </h4>
            <p className="text-xs font-semibold text-slate-700 mt-1 max-w-md">
              15, Prince Ade street, PEACE ESTATE, Lekki, Lagos
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Contact &amp; WhatsApp: 08022872299 · Admissions Email: {targetEmail}
            </p>

            <span className="mt-3 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full font-medium">
              Peace Estate · Lekki · Lagos State
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
