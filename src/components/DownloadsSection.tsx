import React, { useState } from 'react';
import { CensusRecord } from '../types/census';
import { FileText, Download, Printer, Search, IdCard, CheckCircle, Shield, Phone, HelpCircle, Sparkles } from 'lucide-react';

interface DownloadsSectionProps {
  records: CensusRecord[];
  onViewCard: (record: CensusRecord) => void;
  onOpenOtpGate: () => void;
  onRequestOtp: () => void;
}

export const DownloadsSection: React.FC<DownloadsSectionProps> = ({
  records,
  onViewCard,
  onOpenOtpGate,
  onRequestOtp
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = searchQuery.trim()
    ? records.filter(
        r =>
          r.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.mobile.includes(searchQuery) ||
          r.regNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.aadharLast4.includes(searchQuery)
      )
    : [];

  const handlePrintBlankForm = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header - Clean Minimalism */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 mb-1">
            <Download className="w-3.5 h-3.5" /> Downloads & ID Card Lookup
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            डाउनलोड केंद्र - सवाई माधोपुर जनगणना पोर्टल
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            अपना डिजिटल नागरिक प्रमाण पत्र खोजें, प्रिंट करें या ऑफलाइन सर्वेक्षण प्रपत्र डाउनलोड करें
          </p>
        </div>
      </div>

      {/* ID Card Search Box */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <div className="max-w-2xl">
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Quick Lookup
          </span>
          <h3 className="text-lg md:text-xl font-bold tracking-tight text-slate-900 mt-1">
            डिजिटल नागरिक जनगणना पहचान पत्र (Census Card) खोजें व प्रिंट करें
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            अपना 10-अंकों का मोबाइल नंबर, पूरा नाम या पंजीकरण संख्या (उदा. SWM-2026-0001) दर्ज करें:
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
          <div className="relative flex-grow">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="उदा. 9414012345 या राजेश जांगिड़..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Results for Card Download */}
        {searchQuery.trim() && (
          <div className="space-y-3 pt-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              प्राप्त परिणाम ({searchResults.length}):
            </div>
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {searchResults.map(r => (
                  <div
                    key={r.id}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3"
                  >
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        {r.regNumber}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 mt-0.5">{r.fullName}</h4>
                      <p className="text-xs text-slate-500">
                        तहसील {r.tehsil} • {r.villageOrColony}
                      </p>
                      <p className="text-[11px] text-slate-500">मो: {r.mobile} • परिवार: {r.totalFamilyCount} सदस्य</p>
                    </div>

                    <button
                      onClick={() => onViewCard(r)}
                      className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <IdCard className="w-4 h-4" /> कार्ड प्रिंट
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 text-center">
                इस विवरण से कोई नागरिक कार्ड नहीं मिला।{' '}
                <button
                  onClick={onOpenOtpGate}
                  className="text-emerald-700 font-bold hover:underline ml-1 cursor-pointer"
                >
                  यहाँ क्लिक कर नया फॉर्म भरें
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Other Documents */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center mb-3">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">
              सवाई माधोपुर जनगणना ऑफलाइन प्रपत्र (Blank Survey Form)
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              गाँवों और शिविरों में हाथ से डेटा संग्रह हेतु आधिकारिक प्रिंट प्रपत्र प्रारूप
            </p>
          </div>

          <button
            onClick={handlePrintBlankForm}
            className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            प्रपत्र प्रिंट करें (Print Form)
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center mb-3">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">
              नागरिक पंजीकरण मार्गदर्शिका 2026 (Guidelines)
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              एडमिन OTP सत्यापन, आवश्यक दस्तावेज एवं परिवार मैपिंग संबंधी नियम
            </p>
          </div>

          <button
            onClick={() => alert('सवाई माधोपुर जनसँख्या मार्गदर्शिका: फॉर्म भरने से पहले मुखिया का आधार कार्ड, राशन/वोटर कार्ड व परिवार के सदस्यों की आयु तैयार रखें।')}
            className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            नियम पढ़ें (Read Rules)
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
              <Phone className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">
              8 तहसीलों के ब्लॉक प्रतिनिधि हेल्पलाइन (Help Desk)
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              मानटाउन, गंगापुर सिटी, बामनवास, बौंली, खंडार ब्लॉक प्रभारियों के संपर्क सूत्र
            </p>
          </div>

          <button
            onClick={onRequestOtp}
            className="w-full py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            OTP हेतु प्रतिनिधि से संपर्क
          </button>
        </div>
      </div>
    </div>
  );
};
