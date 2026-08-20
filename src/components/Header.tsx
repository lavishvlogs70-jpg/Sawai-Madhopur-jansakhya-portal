import React, { useState } from 'react';
import { DistrictNotice } from '../types/census';
import {
  MapPin,
  Phone,
  Mail,
  Search,
  Globe,
  Lock,
  Menu,
  X,
  FileText,
  Users,
  BarChart3,
  Download,
  Home,
  Info,
  Shield,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  notices: DistrictNotice[];
  onOpenOtpGate: () => void;
  onOpenAdminModal: () => void;
  lang: 'hi' | 'en';
  setLang: (lang: 'hi' | 'en') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  notices,
  onOpenOtpGate,
  onOpenAdminModal,
  lang,
  setLang
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const marqueeText = notices.map(n => n.title).join('  •  ');

  return (
    <header className="w-full bg-white border-b border-slate-200 select-none sticky top-0 z-40">
      {/* 1. TOP NOTICE MARQUEE - Clean Minimalist Slate Banner */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 overflow-hidden flex items-center border-b border-slate-800">
        <div className="flex items-center gap-2 bg-emerald-700 text-white px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
          Live Notice
        </div>
        <div className="overflow-hidden whitespace-nowrap ml-3 w-full">
          <div className="inline-block animate-marquee text-slate-200 font-medium text-xs">
            {marqueeText || 'सवाई माधोपुर जिला जनसँख्या एवं परिवार सर्वेक्षण 2026: सभी नागरिक अपना प्रामाणिक विवरण दर्ज कराएं | फॉर्म भरने के लिए एडमिन OTP प्राप्त करें।'}
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3 text-[11px] text-slate-400 shrink-0 ml-4">
          <span>सत्र: 2026-27</span>
          <span>•</span>
          <span>राजस्थान सरकार</span>
        </div>
      </div>

      {/* 2. MAIN BRANDING & INFO BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Left: District Title & Logo Badge */}
        <div 
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-3.5 cursor-pointer group"
        >
          <div className="w-11 h-11 bg-emerald-700 rounded-full flex items-center justify-center text-white font-bold text-base shadow-sm ring-4 ring-emerald-50 shrink-0">
            SM
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 uppercase">
                सवाई माधोपुर (Sawai Madhopur)
              </h1>
              <span className="hidden sm:inline bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-semibold px-2 py-0.5 rounded">
                जिला पोर्टल
              </span>
            </div>
            <p className="text-[11px] font-semibold text-emerald-700 tracking-wider uppercase">
              Digital Census & Population Registry • 2026
            </p>
          </div>
        </div>

        {/* Right Info Quick Contacts */}
        <div className="hidden lg:flex items-center gap-6 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
              <MapPin className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="leading-tight">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">मुख्यालय</div>
              <div className="font-medium text-slate-800">कलेक्ट्रेट, मानटाउन</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
              <Phone className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="leading-tight">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">हेल्पलाइन</div>
              <div className="font-bold text-slate-900">+91-9414012345</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
              <Mail className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="leading-tight">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">ईमेल</div>
              <div className="font-medium text-slate-800">swm.census@gmail.com</div>
            </div>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenOtpGate}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'पंजीकरण (OTP)' : 'Register'}</span>
          </button>

          <button
            onClick={onOpenAdminModal}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">{lang === 'hi' ? 'एडमिन' : 'Admin'}</span>
          </button>

          <button
            onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            title="Toggle Language"
          >
            <Globe className="w-4 h-4" />
            <span className="text-[11px] uppercase">{lang === 'hi' ? 'EN' : 'हिं'}</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 3. CLEAN MINIMALIST NAVIGATION STRIP */}
      <nav className="bg-slate-50 border-t border-slate-200 text-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between overflow-x-auto scrollbar-none">
          <div className="hidden lg:flex items-center space-x-1 py-1 text-xs font-semibold">
            {[
              { id: 'home', labelHi: 'होम', labelEn: 'Home', icon: Home },
              { id: 'about', labelHi: 'सवाई माधोपुर', labelEn: 'About District', icon: Info },
              { id: 'form', labelHi: 'जनगणना फॉर्म (OTP)', labelEn: 'Census Form (OTP)', icon: FileText, action: onOpenOtpGate },
              { id: 'directory', labelHi: 'नागरिक डायरेक्टरी', labelEn: 'Citizen Directory', icon: Users },
              { id: 'statistics', labelHi: 'तहसील आँकड़े', labelEn: 'Statistics', icon: BarChart3 },
              { id: 'downloads', labelHi: 'डाउनलोड व कार्ड', labelEn: 'Downloads & ID Card', icon: Download },
              { id: 'contact', labelHi: 'संपर्क', labelEn: 'Contact', icon: Phone }
            ].map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.action) item.action();
                    else onSelectTab(item.id);
                  }}
                  className={`px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-emerald-800 shadow-sm border border-slate-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-700' : 'text-slate-500'}`} />
                  <span>{lang === 'hi' ? item.labelHi : item.labelEn}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center text-[11px] text-slate-500 font-medium py-1">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-700" />
              100% Admin OTP Verified Database
            </span>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-200 p-4 space-y-1.5 text-xs font-semibold">
            {[
              { id: 'home', label: 'होम (Home)', icon: Home },
              { id: 'about', label: 'सवाई माधोपुर परिचय (About District)', icon: Info },
              { id: 'directory', label: 'नागरिक डायरेक्टरी (Citizen Search)', icon: Users },
              { id: 'statistics', label: 'तहसील अनुसार आँकड़े (Statistics)', icon: BarChart3 },
              { id: 'downloads', label: 'फॉर्म व कार्ड डाउनलोड (Downloads)', icon: Download },
              { id: 'contact', label: 'संपर्क एवं सहायता (Contact Us)', icon: Phone }
            ].map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2.5 px-3 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                >
                  <Icon className="w-4 h-4 text-emerald-700" />
                  {item.label}
                </button>
              );
            })}
            <div className="pt-2 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => {
                  onOpenOtpGate();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2.5 bg-emerald-700 text-white rounded-lg text-xs font-bold text-center"
              >
                📝 फॉर्म भरें (OTP)
              </button>
              <button
                onClick={() => {
                  onOpenAdminModal();
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 px-4 bg-slate-100 text-slate-800 border border-slate-200 rounded-lg text-xs font-bold"
              >
                🔐 एडमिन
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
