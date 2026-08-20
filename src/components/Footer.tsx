import React from 'react';
import { Shield, Phone, Mail, MapPin, Heart, KeyRound, Users, FileText, Lock } from 'lucide-react';
import { TEHSILS_OF_SAWAI_MADHOPUR } from '../data/initialData';

interface FooterProps {
  onSelectTab: (tab: string) => void;
  onOpenOtpGate: () => void;
  onRequestOtp: () => void;
  onOpenAdminModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectTab,
  onOpenOtpGate,
  onRequestOtp,
  onOpenAdminModal
}) => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-12 pb-6 border-t border-slate-800 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Column 1: Organization Branding */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-white font-bold text-base shadow-sm">
              SM
            </div>
            <div>
              <h3 className="font-bold text-white text-base leading-tight uppercase tracking-tight">
                Sawai Madhopur
              </h3>
              <p className="text-[11px] text-emerald-400 font-semibold uppercase tracking-wider">
                Digital Census Registry • 2026
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            सवाई माधोपुर जिले के सभी 8 तहसीलों के नागरिकों के डेटा संकलन व सामाजिक विकास हेतु समर्पित एक सुरक्षित एवं पारदर्शी डिजिटल मंच।
          </p>
          <div className="pt-1">
            <span className="inline-flex items-center gap-1.5 bg-slate-800 text-emerald-400 text-[11px] px-3 py-1 rounded-full border border-slate-700">
              <Shield className="w-3.5 h-3.5" /> 100% Admin OTP Protected
            </span>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
            महत्वपूर्ण लिंक (Quick Links)
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                onClick={() => onSelectTab('home')}
                className="hover:text-emerald-400 transition cursor-pointer flex items-center gap-1.5"
              >
                › होम पेज (Home)
              </button>
            </li>
            <li>
              <button
                onClick={onOpenOtpGate}
                className="text-emerald-400 font-semibold hover:text-emerald-300 transition cursor-pointer flex items-center gap-1.5"
              >
                › जनसँख्या पंजीकरण फॉर्म (OTP Gate)
              </button>
            </li>
            <li>
              <button
                onClick={onRequestOtp}
                className="hover:text-emerald-400 transition cursor-pointer flex items-center gap-1.5"
              >
                › एडमिन से OTP प्राप्त करें (Request OTP)
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectTab('directory')}
                className="hover:text-emerald-400 transition cursor-pointer flex items-center gap-1.5"
              >
                › नागरिक डायरेक्टरी (Search)
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectTab('statistics')}
                className="hover:text-emerald-400 transition cursor-pointer flex items-center gap-1.5"
              >
                › तहसील आँकड़े (Statistics)
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectTab('downloads')}
                className="hover:text-emerald-400 transition cursor-pointer flex items-center gap-1.5"
              >
                › नागरिक कार्ड डाउनलोड (ID Card)
              </button>
            </li>
            <li>
              <button
                onClick={onOpenAdminModal}
                className="text-slate-300 font-semibold hover:text-emerald-400 transition cursor-pointer flex items-center gap-1.5"
              >
                › 🔐 एडमिन पोर्टल लॉगिन (Admin Hub)
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Covered Tehsils */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
            जिले की 8 तहसीलें (Blocks)
          </h4>
          <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-400">
            {TEHSILS_OF_SAWAI_MADHOPUR.map(t => (
              <span key={t.id} className="hover:text-emerald-400 transition">
                • {t.nameHi}
              </span>
            ))}
          </div>
          <div className="pt-2 text-[11px] text-slate-500">
            मानटाउन, कलेक्ट्रेट चौराहा, हाउसिंग बोर्ड, सूरवाल, बहरावंडा, बाटोदा एवं समस्त ग्राम पंचायतें।
          </div>
        </div>

        {/* Column 4: Contact & Helpline */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
            हेल्पलाइन (District Office)
          </h4>
          <div className="space-y-2 text-xs text-slate-400">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>कलेक्ट्रेट रोड, मानटाउन, सवाई माधोपुर (राजस्थान) - 322001</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="font-bold text-white">+91-9461300991 / 07462-220000</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>sawaimadhopur.census@gmail.com</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onOpenAdminModal}
              className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-lg border border-slate-700 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              जिला एडमिन लॉगिन (ID: admin / Pass: admin123)
            </button>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
        <div>
          Government of Rajasthan | District Administration Sawai Madhopur • 2026
        </div>
        <div className="flex items-center gap-4">
          <span>सत्यमेव जयते</span>
          <span>•</span>
          <span>Digital Census Platform</span>
        </div>
      </div>
    </footer>
  );
};
