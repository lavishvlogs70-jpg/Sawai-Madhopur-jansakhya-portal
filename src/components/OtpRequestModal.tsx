import React, { useState } from 'react';
import { CensusStorageService } from '../services/censusStorage';
import { TEHSILS_OF_SAWAI_MADHOPUR } from '../data/initialData';
import {
  Send,
  CheckCircle,
  Phone,
  X,
  MapPin,
  Clock,
  Shield,
  PhoneCall,
  UserCheck
} from 'lucide-react';

interface OtpRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAutoFillOtp: (code: string) => void;
}

export const OtpRequestModal: React.FC<OtpRequestModalProps> = ({
  isOpen,
  onClose,
  onAutoFillOtp
}) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [tehsil, setTehsil] = useState('सवाई माधोपुर');
  const [village, setVillage] = useState('');
  const [reason, setReason] = useState('नया परिवार जनसँख्या पंजीकरण (New Census Registration)');
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const adminContacts = [
    { title: 'जिला मुख्य समन्वयक (HQ सवाई माधोपुर)', phone: '+919461300991', incharge: 'मुख्य एडमिन' },
    { title: 'ब्लॉक प्रभारी (गंगापुर सिटी व वजीरपुर)', phone: '+919461300991', incharge: 'एडमिन सपोर्ट' },
    { title: 'ब्लॉक प्रभारी (बामनवास, बौंली व मलारना)', phone: '+919461300991', incharge: 'एडमिन सपोर्ट' },
    { title: 'ब्लॉक प्रभारी (खंडार व चौथ का बरवाड़ा)', phone: '+919461300991', incharge: 'एडमिन सपोर्ट' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim() || mobile.length < 10) {
      alert('कृपया अपना नाम एवं 10 अंकों का मोबाइल नंबर दर्ज करें।');
      return;
    }

    // Save as Pending request in Admin Portal (No auto-approval for user)
    CensusStorageService.createOtpRequest({
      applicantName: name.trim(),
      mobile: mobile.trim(),
      tehsil,
      villageOrCity: village.trim() || tehsil,
      reason
    });

    setSubmitted(true);
  };

  const handleReset = () => {
    setName('');
    setMobile('');
    setVillage('');
    setOtpCode('');
    setOtpError('');
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header - Clean Slate-800 */}
        <div className="bg-slate-800 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white font-bold text-lg shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Admin Access OTP Request</h3>
              <p className="text-xs text-slate-400 mt-0.5">जिला एडमिन से फोन पर संपर्क कर OTP कोड प्राप्त करें</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 leading-relaxed">
                <strong>महत्वपूर्ण सूचना:</strong> सटीक व प्रामाणिक जनगणना हेतु फॉर्म भरने के लिए 6-अंकों का OTP कोड केवल जिला एडमिन द्वारा कॉल पर सत्यापन के बाद ही दिया जाता है। अपना विवरण सबमिट करें और नीचे दिए गए एडमिन नंबरों पर संपर्क करें।
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-500 uppercase tracking-wider">
                  आवेदक / मुखिया का नाम *
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. महेश शर्मा"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-500 uppercase tracking-wider">
                  मोबाइल नंबर (10 अंक) *
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  placeholder="94140XXXXX"
                  value={mobile}
                  onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wider">तहसील *</label>
                  <select
                    value={tehsil}
                    onChange={e => setTehsil(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  >
                    {TEHSILS_OF_SAWAI_MADHOPUR.map(t => (
                      <option key={t.id} value={t.nameHi}>{t.nameHi}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wider">गाँव / मोहल्ला</label>
                  <input
                    type="text"
                    placeholder="उदा. सूरवाल"
                    value={village}
                    onChange={e => setVillage(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-100 transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Send className="w-4 h-4" />
                <span>एडमिन को अनुरोध भेजें (Send Request)</span>
              </button>
            </form>
          ) : (
            <div className="space-y-4 py-2 animate-in fade-in">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-base text-slate-900">
                  अनुरोध जिला एडमिन को प्रेषित कर दिया गया!
                </h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  अब कृपया नीचे दिए गए अपने ब्लॉक/तहसील के एडमिन नंबर पर कॉल करके 6-अंकों का <strong>Access OTP</strong> प्राप्त करें:
                </p>
              </div>

              {/* Admin helpline contact list with direct Click-to-Call buttons */}
              <div className="space-y-2 max-h-60 overflow-y-auto pt-1">
                {adminContacts.map((contact, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">{contact.title}</span>
                      <span className="text-[11px] text-slate-500">प्रभारी: {contact.incharge}</span>
                    </div>

                    <a
                      href={`tel:${contact.phone}`}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 shrink-0 shadow-xs"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      कॉल करें
                    </a>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 mt-4">
                <label className="font-bold text-emerald-900 text-[11px] uppercase tracking-wider block text-center">
                  एडमिन से प्राप्त 6-अंकों का OTP यहाँ दर्ज करें
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="XXXXXX"
                  value={otpCode}
                  onChange={e => {
                    setOtpCode(e.target.value.replace(/\D/g, ''));
                    setOtpError('');
                  }}
                  className="w-full px-4 py-3 bg-white border border-emerald-300 rounded-xl text-center text-xl font-mono font-bold tracking-[0.5em] text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {otpError && (
                  <p className="text-red-600 text-[10px] text-center font-bold">{otpError}</p>
                )}
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => {
                    if (otpCode.length !== 6) {
                      setOtpError('कृपया 6-अंकों का सही OTP दर्ज करें');
                      return;
                    }
                    const res = CensusStorageService.verifyOtp(otpCode);
                    if (res.valid && res.otp) {
                      onAutoFillOtp(otpCode);
                    } else {
                      setOtpError(res.message || 'अमान्य या समाप्त हो चुका OTP');
                    }
                  }}
                  className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
                >
                  फॉर्म खोलें (Verify & Open)
                </button>
                <button
                  onClick={handleReset}
                  className="py-3 px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  रद्द करें
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
