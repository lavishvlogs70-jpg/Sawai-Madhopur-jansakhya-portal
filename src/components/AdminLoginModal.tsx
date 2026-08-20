import React, { useState } from 'react';
import { Lock, Shield, AlertCircle, KeyRound, CheckCircle, X, User } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onLoginSuccess: () => void;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onLoginSuccess,
  onClose
}) => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if ((adminId === 'admin' && password === 'admin123') || (adminId === 'swm2026' && password === 'swm2026')) {
      onLoginSuccess();
      onClose();
    } else {
      setError('अमान्य एडमिन आईडी या पासवर्ड! (Invalid Admin Credentials)');
    }
  };

  const handleQuickLogin = () => {
    onLoginSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-sm w-full shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header - Clean Slate-800 */}
        <div className="bg-slate-800 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-11 h-11 rounded-xl bg-emerald-700 flex items-center justify-center mx-auto mb-2 text-white shadow-sm">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg">District Admin Portal</h3>
          <p className="text-xs text-slate-400 mt-0.5">सवाई माधोपुर जनगणना नियंत्रण कक्ष</p>
        </div>

        <div className="p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Admin ID (यूजर आईडी)
              </label>
              <input
                type="text"
                autoFocus
                placeholder="उदा. admin"
                value={adminId}
                onChange={e => {
                  setAdminId(e.target.value);
                  setError('');
                }}
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50 focus:bg-white text-center font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5" /> Password (पासवर्ड)
              </label>
              <input
                type="password"
                placeholder="पासवर्ड दर्ज करें"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50 focus:bg-white text-center tracking-widest font-mono"
              />
            </div>

            {error && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
            >
              लॉगिन करें (Sign In)
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
            <button
              type="button"
              onClick={handleQuickLogin}
              className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Shield className="w-4 h-4 text-emerald-700" />
              1-क्लिक टेस्ट एडमिन लॉगिन (Demo)
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-1.5 text-xs text-slate-400 hover:text-slate-600 cursor-pointer text-center"
            >
              रद्द करें (Close)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
