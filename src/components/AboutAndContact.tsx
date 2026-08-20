import React, { useState } from 'react';
import { TEHSILS_OF_SAWAI_MADHOPUR } from '../data/initialData';
import {
  MapPin,
  Phone,
  Mail,
  Building,
  Users,
  Award,
  Send,
  CheckCircle,
  Clock,
  Shield,
  Landmark,
  MessageSquare
} from 'lucide-react';

interface AboutAndContactProps {
  viewMode: 'about' | 'contact';
  onOpenOtpGate: () => void;
  onRequestOtp: () => void;
}

export const AboutAndContact: React.FC<AboutAndContactProps> = ({
  viewMode,
  onOpenOtpGate,
  onRequestOtp
}) => {
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    tehsil: 'सवाई माधोपुर',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* ABOUT DISTRICT SECTION - Clean Minimalism */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full w-fit border border-emerald-200">
          <Landmark className="w-3.5 h-3.5" /> District Profile & Survey Objective
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
              ऐतिहासिक रणथम्भौर की पावन धरा - <span className="text-emerald-700">सवाई माधोपुर</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              सवाई माधोपुर जिला राजस्थान के पूर्वी भाग में स्थित एक गौरवशाली सांस्कृतिक, ऐतिहासिक एवं सामाजिक केंद्र है। इस जनगणना व नागरिक डेटा संकलन का मुख्य उद्देश्य जिले के सभी 8 तहसीलों के प्रत्येक नागरिक एवं परिवार का वास्तविक, अद्यतन व सुरक्षित रिकॉर्ड तैयार करना है।
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 text-xs block">🎯 सटीक जनसँख्या आंकलन</span>
                <span className="text-[11px] text-slate-500">प्रत्येक गाँव व वार्ड स्तर पर परिवारों की वास्तविक संख्या।</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 text-xs block">🛡️ सुरक्षित OTP एक्सेस</span>
                <span className="text-[11px] text-slate-500">एडमिन सत्यापन के बिना कोई भी अनधिकृत प्रविष्टि संभव नहीं।</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 text-xs block">📜 डिजिटल नागरिक कार्ड</span>
                <span className="text-[11px] text-slate-500">QR कोड युक्त परिवार प्रमाण पत्र एवं पंजीकरण स्लिप।</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 text-xs block">🤝 सामाजिक विकास</span>
                <span className="text-[11px] text-slate-500">शिक्षा, रोजगार व सहयोग का सुलभ वितरण।</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?w=600&auto=format&fit=crop&q=80"
                alt="Sawai Madhopur"
                className="w-full h-64 object-cover"
              />
              <div className="bg-slate-800 text-white p-3 text-center text-xs font-semibold">
                रणथम्भौर दुर्ग व श्री त्रिनेत्र गणेश जी की पावन धरा
              </div>
            </div>
          </div>
        </div>

        {/* Tehsil Badges */}
        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            जिले की सभी 8 तहसीलें व ब्लॉक:
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {TEHSILS_OF_SAWAI_MADHOPUR.map(t => (
              <div key={t.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <div className="font-bold text-slate-900">{t.nameHi}</div>
                <div className="text-[10px] text-slate-400">{t.nameEn} • {t.pincodes[0]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CONTACT & HELPDESK SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full w-fit border border-emerald-200">
          <Phone className="w-3.5 h-3.5" /> Helpline & Contact Desk
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              जिला जनगणना मुख्यालय, सवाई माधोपुर
            </h3>
            <p className="text-xs text-slate-500">
              किसी भी सहायता, OTP अनुरोध अथवा रिकॉर्ड सुधार हेतु नीचे दिए गए संपर्क सूत्रों पर संपर्क करें:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">मुख्य कार्यालय पता:</span>
                  <span className="text-slate-600">
                    कलेक्ट्रेट चौराहा, मानटाउन, सवाई माधोपुर (राजस्थान) - 322001
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <Phone className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">हेल्पलाइन:</span>
                  <a href="tel:+919461300991" className="text-emerald-700 font-bold block hover:underline">
                    +91-9461300991 / 07462-220000
                  </a>
                  <span className="text-[10px] text-slate-400">सोमवार से शनिवार: 9:00 AM - 7:00 PM</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <Mail className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">ईमेल सपोर्ट:</span>
                  <span className="text-slate-700 font-medium">sawaimadhopur.census@gmail.com</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onRequestOtp}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                🔑 एडमिन से OTP प्राप्त करने हेतु ऑनलाइन अनुरोध भेजें
              </button>
            </div>
          </div>

          {/* Direct Query Form */}
          <div className="lg:col-span-7 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-4">
              <MessageSquare className="w-4 h-4 text-emerald-700" />
              संदेश अथवा पूछताछ भेजें (Inquiry Form)
            </h3>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-500 uppercase mb-1">आपका नाम *</label>
                    <input
                      type="text"
                      required
                      placeholder="उदा. दिनेश शर्मा"
                      value={contactForm.name}
                      onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-500 uppercase mb-1">मोबाइल नंबर *</label>
                    <input
                      type="tel"
                      maxLength={10}
                      required
                      placeholder="94140XXXXX"
                      value={contactForm.phone}
                      onChange={e => setContactForm({ ...contactForm, phone: e.target.value.replace(/\D/g, '') })}
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-500 uppercase mb-1">तहसील चुनें</label>
                    <select
                      value={contactForm.tehsil}
                      onChange={e => setContactForm({ ...contactForm, tehsil: e.target.value })}
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {TEHSILS_OF_SAWAI_MADHOPUR.map(t => (
                        <option key={t.id} value={t.nameHi}>{t.nameHi}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-500 uppercase mb-1">विषय (Subject)</label>
                    <input
                      type="text"
                      placeholder="उदा. फॉर्म भरने में सहायता"
                      value={contactForm.subject}
                      onChange={e => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">संदेश (Message)</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="कृपया अपना प्रश्न या विवरण यहाँ लिखें..."
                    value={contactForm.message}
                    onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  संदेश भेजें (Send Inquiry)
                </button>
              </form>
            ) : (
              <div className="bg-white p-6 rounded-xl border border-slate-200 text-center space-y-2">
                <CheckCircle className="w-10 h-10 text-emerald-700 mx-auto" />
                <h4 className="font-bold text-base text-slate-900">आपका संदेश प्राप्त हुआ!</h4>
                <p className="text-xs text-slate-500">
                  जिला समन्वय टीम शीघ्र ही आपसे संपर्क करेगी। धन्यवाद!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
