import React, { useState, useRef, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  MessageCircle,
  Sparkles,
  X,
  Send,
  Phone,
  ArrowRight,
  Shield,
  Bot,
  User,
  Clock,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const FloatingHelpWidget: React.FC = () => {
  const { schoolData } = useSchool();
  const [isWhatsappHovered, setIsWhatsappHovered] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const rawWhatsapp = schoolData.settings.whatsappNumber || '+2348000000000';
  const cleanWhatsapp = rawWhatsapp.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    'Hello Bright Star College Lekki, I would like to inquire about admissions and campus information.'
  )}`;

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: `Hello and welcome to Bright Star College, Lekki! 🌟\n\nI am **StarBot**, your AI Admissions & Campus Assistant. How can I help you today? You can ask about our British & Nigerian curriculum, admissions steps, Lekki campus location, or speak directly with our team on WhatsApp.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const quickPrompts = [
    'How do I apply for admission?',
    'What curriculum do you offer?',
    'Where is the Lekki campus located?',
    'What are the school hours?',
    'School fees & prospectus info',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAiModalOpen) {
      scrollToBottom();
    }
  }, [chatHistory, isAiModalOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoadingAi) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoadingAi(true);

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: ChatMessage = {
          id: 'ai-' + Date.now(),
          sender: 'ai',
          text: data.reply || 'Thank you for your question. You can also chat directly with our admissions counselor on WhatsApp.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setChatHistory((prev) => [...prev, aiMsg]);
      } else {
        throw new Error('Network response not ok');
      }
    } catch (e) {
      const fallbackMsg: ChatMessage = {
        id: 'ai-err-' + Date.now(),
        sender: 'ai',
        text: `Thank you for reaching out! Bright Star College is committed to providing quality education in Lekki, Lagos. For immediate personalized assistance, you can message our admissions desk directly on WhatsApp at **${schoolData.settings.whatsappNumber}** or call **${schoolData.settings.phonePlaceholder}**.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatHistory((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <>
      {/* FLOATING ACTION DOCK (BOTTOM-RIGHT) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto select-none">
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
                    <span>Online · Replies within minutes</span>
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
                  Have admissions or campus questions?
                </p>
                Chat directly with our admissions officer in Lekki on WhatsApp, or speak with our AI Assistant for instant answers!
              </div>

              {/* Direct Actions inside hover card */}
              <div className="space-y-2 pt-1">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Start WhatsApp Chat</span>
                </a>

                <button
                  onClick={() => {
                    setIsWhatsappHovered(false);
                    setIsAiModalOpen(true);
                  }}
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ask BSC AI Assistant</span>
                </button>
              </div>

              <div className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Office: {schoolData.settings.officeHours}</span>
              </div>
            </div>
          </div>
        )}

        {/* BUTTON CLUSTER: WHATSAPP + AI ASSISTANT BUTTON */}
        <div className="flex items-center gap-3">
          {/* AI Assistant Floating Button */}
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-2 bg-linear-to-r from-blue-900 via-blue-950 to-blue-900 text-white hover:shadow-blue-900/30 font-bold text-xs px-3.5 py-3 rounded-full shadow-xl border-2 border-amber-400/80 hover:scale-105 active:scale-95 transition-all group"
            title="Ask Bright Star College AI Assistant"
            aria-label="Open AI Assistant"
          >
            <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline font-bold tracking-wide">
              Ask AI Assistant
            </span>
          </button>

          {/* School WhatsApp Floating Button with Hover Listener */}
          <div
            className="relative"
            onMouseEnter={() => setIsWhatsappHovered(true)}
          >
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                // If on mobile, open directly
              }}
              className="w-13 h-13 rounded-full bg-[#25D366] hover:bg-[#1ebd5a] text-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 relative border-2 border-white"
              title="Chat with Bright Star College Admissions on WhatsApp"
              aria-label="Chat on WhatsApp"
            >
              <MessageCircle className="w-7 h-7 fill-white text-white" />
              {/* Notification Pulse Dot */}
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-[9px] font-black text-slate-950">
                1
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* AI ASSISTANT CHAT MODAL / DRAWER */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col h-[85vh] sm:h-[650px] overflow-hidden animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-linear-to-r from-blue-950 via-blue-900 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-blue-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-800 border border-amber-400/50 flex items-center justify-center text-amber-400">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                      StarBot · AI Assistant
                    </h3>
                    <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-1.5 py-0.2 rounded border border-amber-400/40">
                      AI Powered
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-200">
                    Bright Star College · Lekki, Lagos
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#1ebd5a] text-white p-2 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1"
                  title="Escalate to WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span className="hidden sm:inline text-[11px]">WhatsApp</span>
                </a>

                <button
                  onClick={() => setIsAiModalOpen(false)}
                  className="text-slate-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Close Assistant"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Conversation Flow */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60">
              {chatHistory.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-7 h-7 rounded-lg bg-blue-900 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold shadow-2xs">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-2xs ${
                      msg.sender === 'user'
                        ? 'bg-blue-900 text-white rounded-br-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-normal">
                      {msg.text}
                    </div>
                    <span
                      className={`block text-[10px] mt-1.5 ${
                        msg.sender === 'user' ? 'text-blue-200 text-right' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {isLoadingAi && (
                <div className="flex gap-2.5 items-center">
                  <div className="w-7 h-7 rounded-lg bg-blue-900 text-amber-400 flex items-center justify-center shrink-0 text-xs">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-xs p-3 text-xs text-slate-500 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
                    <span>StarBot is preparing an answer for you...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="p-2.5 bg-slate-100 border-t border-slate-200 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 px-1">
                Suggested:
              </span>
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  disabled={isLoadingAi}
                  className="shrink-0 bg-white hover:bg-blue-50 hover:text-blue-900 text-slate-700 border border-slate-200 text-[11px] font-medium py-1 px-2.5 rounded-full shadow-2xs transition-all disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Chat Input & Escalate to WhatsApp Footer */}
            <div className="p-3 bg-white border-t border-slate-200 space-y-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask a question about Bright Star College..."
                  disabled={isLoadingAi}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  disabled={isLoadingAi || !inputMessage.trim()}
                  className="bg-blue-900 hover:bg-blue-800 disabled:bg-slate-300 text-white font-bold p-2.5 rounded-xl transition-colors shadow-xs flex items-center justify-center shrink-0"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              {/* Seamless WhatsApp Handoff Bar */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                <span>Need immediate human assistance?</span>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#075E54] hover:underline font-bold inline-flex items-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-[#25D366] text-[#25D366]" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
