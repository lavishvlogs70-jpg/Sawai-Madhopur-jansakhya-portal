import React, { useState } from 'react';
import { CensusStorageService } from '../services/censusStorage';
import { AccessOtp } from '../types/census';
import {
  KeyRound,
  ShieldCheck,
  AlertCircle,
  CheckCircle,
  PhoneCall,
  Lock,
  ArrowRight,
  X
} from 'lucide-react';

interface OtpVerificationModalProps {
  isOpen: boolean;
  onVerified: (otp: AccessOtp) => void;
  onClose: () => void;
  onRequestOtp: () => void;
}

export const OtpVerificationModal: React.FC<OtpVerificationModalProps> = ({
  isOpen,
  onVerified,
  onClose,
  onRequestOtp
}) => {
  const [otpCode, setOtpCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setErrorMsg('कृपया 6-अंकों का वैध एडमिन OTP कोड दर्ज करें।');
      return;
    }

    setIsChecking(true);
    setErrorMsg('');

    setTimeout(() => {
      const result = CensusStorageService.verifyOtp(otpCode.trim());
      setIsChecking(false);

      if (result.valid && result.otp) {
        onVerified(result.otp);
      } else {
        setErrorMsg(result.message || 'अमान्य OTP कोड! कृपया जिला एडमिन से सही OTP प्राप्त करें।');
      }
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
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
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Admin Access Verification</h3>
              <p className="text-xs text-slate-400 mt-0.5">सवाई माधोपुर जनगणना - अधिकृत OTP सत्यापन</p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          <p className="text-xs text-slate-600 leading-relaxed">
            सटीक व प्रामाणिक डेटा संकलन हेतु फॉर्म केवल <strong>जिला/ब्लॉक एडमिन द्वारा जारी 6-अंकों के OTP</strong> से ही भरा जा सकता है। एडमिन से कॉल पर प्राप्त कोड नीचे दर्ज करें।
          </p>

          <form onSubmit={handleVerify} className="space-y-4">
            {/* Amber OTP Box */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
              <label className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
                Enter Admin Access OTP *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  placeholder="6-अंकों का OTP"
                  value={otpCode}
                  onChange={e => {
                    setOtpCode(e.target.value.replace(/\D/g, ''));
                    setErrorMsg('');
                  }}
                  className="flex-1 px-4 py-2.5 bg-white border border-amber-300 rounded-lg text-lg font-mono font-bold tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900"
                />
                <button
                  type="submit"
                  disabled={isChecking}
                  className="px-5 py-2.5 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700 transition cursor-pointer shadow-sm"
                >
                  {isChecking ? '...' : 'Verify'}
                </button>
              </div>
              <p className="text-[11px] text-amber-700 italic">
                * केवल जिला एडमिन से कॉल द्वारा प्राप्त 6-अंकों का कोड ही मान्य होगा।
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isChecking}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-100 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>सत्यापित करें एवं फॉर्म खोलें (Proceed to Form)</span>
            </button>
          </form>

          {/* Direct Help Desk for citizens needing OTP */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-800 block">OTP कोड नहीं मिला?</span>
              <span className="text-[11px] text-slate-500">एडमिन से तुरंत कॉल करके टोकन प्राप्त करें</span>
            </div>
            <button
              type="button"
              onClick={onRequestOtp}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>एडमिन को कॉल करें</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
