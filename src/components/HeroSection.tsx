import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  KeyRound,
  Users,
  Search,
  CheckCircle,
  Sparkles,
  MapPin,
  ChevronRight,
  ChevronLeft,
  PhoneCall,
  Download,
  Building,
  BarChart3,
  Award
} from 'lucide-react';
import lordVishwakarmaImg from '../assets/images/lord_vishwakarma_hero_1787072417072.jpg';

interface HeroSectionProps {
  onOpenOtpGate: () => void;
  onRequestOtp: () => void;
  onOpenDirectory: () => void;
  onOpenStats: () => void;
  stats: {
    totalPopulation: number;
    totalFamilies: number;
    totalMales: number;
    totalFemales: number;
  };
  lang: 'hi' | 'en';
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenOtpGate,
  onRequestOtp,
  onOpenDirectory,
  onOpenStats,
  stats,
  lang
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 'vishwakarma',
      tag: '॥ ॐ श्री विश्वकर्मणे नमः ॥',
      title: 'भगवान श्री विश्वकर्मा जी की असीम कृपा से',
      subtitle: 'सवाई माधोपुर जिला जनसँख्या एवं परिवार कल्याण सर्वेक्षण 2026',
      description: 'शिल्प, सृजन व निर्माण के अधिष्ठाता देव भगवान श्री विश्वकर्मा जी के आशीर्वाद से जिले के समस्त 8 तहसीलों के नागरिकों व परिवारों का प्रामाणिक व सुरक्षित डिजिटल डेटा संकलन।',
      image: lordVishwakarmaImg,
      badge: 'सर्व देव शिल्पकार',
      primaryActionText: 'जनगणना पंजीकरण फॉर्म भरें (OTP द्वारा)',
      primaryAction: onOpenOtpGate,
      secondaryActionText: 'एडमिन को कॉल कर OTP प्राप्त करें',
      secondaryAction: onRequestOtp
    },
    {
      id: 'census-security',
      tag: '100% ADMIN OTP PROTECTED',
      title: 'सवाई माधोपुर जनसँख्या पंजीकरण पोर्टल',
      subtitle: 'सटीक, प्रामाणिक एवं केवल अधिकृत एडमिन OTP द्वारा नियंत्रित प्रणाली',
      description: 'फर्जी व अनधिकृत प्रविष्टियों की रोकथाम हेतु केवल जिला/ब्लॉक एडमिन से कॉल द्वारा प्राप्त 6-अंकों के यूनिक कोड से ही पंजीकरण संभव है।',
      image: lordVishwakarmaImg,
      badge: 'सुरक्षित जिला पोर्टल',
      primaryActionText: 'पंजीकरण शुरू करें (Enter OTP)',
      primaryAction: onOpenOtpGate,
      secondaryActionText: 'नागरिक डायरेक्टरी खोजें',
      secondaryAction: onOpenDirectory
    },
    {
      id: 'digital-card',
      tag: 'REAL QR & BARCODE VERIFICATION',
      title: 'डिजिटल नागरिक जनगणना पहचान पत्र',
      subtitle: 'स्मार्टफोन से स्कैन करते ही खुलेगा आपका सत्यापित प्रमाण पत्र',
      description: 'पंजीकरण के उपरांत प्रत्येक परिवार को वास्तविक QR कोड व बारकोड युक्त डिजिटल परिवार पहचान पत्र प्रदान किया जाता है जिसे कभी भी प्रिंट व सत्यापित किया जा सकता है।',
      image: lordVishwakarmaImg,
      badge: 'तुरंत डिजिटल कार्ड',
      primaryActionText: 'नागरिक कार्ड खोजें व प्रिंट करें',
      primaryAction: onOpenDirectory,
      secondaryActionText: 'तहसील सांख्यिकी देखें',
      secondaryAction: onOpenStats
    }
  ];

  // Auto advance slide every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

  const activeSlide = slides[currentSlide];

  return (
    <div className="relative">
      {/* MAIN CAROUSEL SLIDER - Clean Slate/Emerald Minimal Design */}
      <div className="relative overflow-hidden bg-slate-900 border-b border-slate-800">
        <div className="relative min-h-[460px] md:min-h-[500px] flex items-center">
          {/* Background image with overlay gradient */}
          <div className="absolute inset-0 z-0">
            <img
              src={activeSlide.image}
              alt={activeSlide.title}
              className="w-full h-full object-cover object-center transition-all duration-700 opacity-25 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/95 to-slate-900/80" />
            {/* Subtle Grid Lines Overlay */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            />
          </div>

          {/* Slider Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Text Side */}
              <div className="lg:col-span-7 space-y-4 animate-in fade-in duration-500">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{activeSlide.tag}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
                  {activeSlide.title}
                </h1>

                <h2 className="text-base sm:text-lg font-semibold text-emerald-400">
                  {activeSlide.subtitle}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                  {activeSlide.description}
                </p>

                {/* Call to Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <button
                    onClick={activeSlide.primaryAction}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-950 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>{activeSlide.primaryActionText}</span>
                  </button>

                  <button
                    onClick={activeSlide.secondaryAction}
                    className="px-5 py-3 bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4 text-emerald-400" />
                    <span>{activeSlide.secondaryActionText}</span>
                  </button>
                </div>
              </div>

              {/* Visual Showcase Card (Right Column) */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative rounded-2xl overflow-hidden border-2 border-slate-700/80 shadow-2xl bg-slate-800/60 backdrop-blur-xs max-w-md w-full p-3 group">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden relative">
                    <img
                      src={activeSlide.image}
                      alt={activeSlide.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-bold text-amber-300 border border-amber-400/30">
                      {activeSlide.badge}
                    </div>
                  </div>
                  <div className="mt-2.5 px-1 flex items-center justify-between text-xs text-slate-300">
                    <span className="font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> सवाई माधोपुर 8 तहसीलें
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      सत्र 2026
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Navigation Arrows & Dots */}
        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide Indicator Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentSlide === idx
                  ? 'w-7 bg-emerald-500'
                  : 'w-2 bg-slate-600 hover:bg-slate-500'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* METRIC STRIP BELOW SLIDER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6 relative z-30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-xl shadow-md border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                कुल जनसँख्या
              </span>
              <span className="text-2xl font-bold font-mono text-slate-900 mt-0.5 block">
                {stats.totalPopulation}
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold">सत्यापित नागरिक</span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-md border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                पंजीकृत परिवार
              </span>
              <span className="text-2xl font-bold font-mono text-slate-900 mt-0.5 block">
                {stats.totalFamilies}
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">मुखिया रिकॉर्ड</span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-md border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                जिले की तहसीलें
              </span>
              <span className="text-2xl font-bold font-mono text-slate-900 mt-0.5 block">
                8 ब्लॉक
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold">100% कवरेज</span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-md border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                सत्यापन सुरक्षा
              </span>
              <span className="text-2xl font-bold font-mono text-slate-900 mt-0.5 block">
                Admin OTP
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold">QR + बारकोड कार्ड</span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
