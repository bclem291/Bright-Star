import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles
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
  const [errorMessage, setErrorMessage] = useState('');

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
    const result = await submitContactForm({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      subject: subject.trim() || 'General Inquiry',
      message: message.trim(),
    });

    setIsSubmitting(false);

    if (result.success) {
      setIsSuccess(true);
      setFullName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } else {
      setErrorMessage(result.error || 'Failed to submit form. Please try again.');
    }
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Header Banner */}
      <section className="bg-linear-to-b from-blue-950 to-blue-900 text-white py-16 md:py-20 border-b border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-800/80 border border-amber-400/40 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ADMISSIONS & INQUIRIES</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            CONTACT US
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
                  Lekki, Lagos, Nigeria
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
                      {settings.address || 'Lekki Peninsula Corridor'}
                    </p>
                    <p className="text-xs text-slate-500">
                      {settings.cityState || 'Lekki, Lagos'}, {settings.country || 'Nigeria'}
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
                      Telephone / Admissions
                    </h3>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5">
                      {settings.phonePlaceholder}
                    </p>
                    <span className="text-[11px] text-slate-400">
                      Editable by administrator in Settings
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
                    <p className="text-sm font-semibold text-slate-800 mt-0.5 break-all">
                      {settings.emailPlaceholder}
                    </p>
                    <span className="text-[11px] text-slate-400">
                      Official correspondence & admissions desk
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

            {/* Note on Admissions */}
            <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-5 text-xs text-amber-900 leading-relaxed">
              <span className="font-bold block mb-1">
                Parental Campus Visits:
              </span>
              Campus walk-throughs and diagnostic entrance tests are conducted by appointment on weekdays. Please submit the form or contact the administration directly.
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200/80 shadow-xs">
              <div className="mb-6">
                <span className="text-xs font-bold text-orange-600 uppercase tracking-wider block">
                  SEND AN INQUIRY
                </span>
                <h2 className="text-2xl font-extrabold text-blue-950 mt-1">
                  How Can We Help You?
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Fill in your details below and our administrative office will respond promptly.
                </p>
              </div>

              {/* Status Notifications */}
              {isSuccess && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-3 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm">
                    <span className="font-bold block">Thank you for contacting Bright Star College!</span>
                    Your inquiry has been received by our administration. We will get in touch with you shortly.
                  </div>
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
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 800 000 0000"
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
                      placeholder="Admissions inquiry / Campus tour"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please tell us about your child's current grade, academic interests, or any questions about admissions..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm resize-none"
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-orange-600 hover:bg-orange-500 disabled:bg-slate-400 text-white font-bold px-8 py-3.5 rounded-xl shadow-md transition-all text-xs tracking-wider uppercase inline-flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>SENDING MESSAGE...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>SEND MESSAGE</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* MAP SECTION: Lekki, Lagos, Nigeria */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                CAMPUS LOCATION
              </span>
              <h3 className="text-xl font-bold text-blue-950 mt-0.5">
                Lekki, Lagos, Nigeria
              </h3>
              <p className="text-xs text-slate-500">
                Conveniently situated in the Lekki educational corridor. Exact street address can be configured via Admin Dashboard.
              </p>
            </div>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                settings.mapQuery || 'Lekki, Lagos, Nigeria'
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
            <p className="text-xs text-slate-600 mt-1 max-w-md">
              {settings.address || 'Lekki Peninsula Corridor'}, {settings.cityState || 'Lekki, Lagos, Nigeria'}
            </p>

            <span className="mt-3 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full font-medium">
              Lekki Peninsula · Lagos State
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
