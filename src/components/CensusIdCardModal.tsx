import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';
import { CensusRecord } from '../types/census';
import { ShieldCheck, Printer, X, Users, Phone, MapPin, CheckCircle2, QrCode } from 'lucide-react';

interface CensusIdCardModalProps {
  record: CensusRecord | null;
  onClose: () => void;
}

export const CensusIdCardModal: React.FC<CensusIdCardModalProps> = ({ record, onClose }) => {
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const barcodeCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (record) {
      // 1. Generate Real QR Code containing the direct verifiable link
      if (qrCanvasRef.current) {
        const verificationUrl = `${window.location.origin}/?card=${encodeURIComponent(record.regNumber)}`;
        QRCode.toCanvas(
          qrCanvasRef.current,
          verificationUrl,
          {
            width: 100,
            margin: 1,
            color: {
              dark: '#0f172a',
              light: '#ffffff'
            }
          },
          err => {
            if (err) console.error('QR code generation error:', err);
          }
        );
      }

      // 2. Generate Real 1D Barcode with JsBarcode for the Registration Number
      if (barcodeCanvasRef.current) {
        try {
          JsBarcode(barcodeCanvasRef.current, record.regNumber, {
            format: 'CODE128',
            lineColor: '#0f172a',
            width: 1.5,
            height: 38,
            displayValue: true,
            fontSize: 11,
            font: 'monospace',
            fontOptions: 'bold',
            textMargin: 2,
            margin: 2,
            background: '#ffffff'
          });
        } catch (e) {
          console.error('Barcode generation error:', e);
        }
      }
    }
  }, [record]);

  if (!record) return null;

  const handlePrint = () => {
    window.print();
  };

  const verificationUrl = `${window.location.origin}/?card=${encodeURIComponent(record.regNumber)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Modal Top Bar */}
        <div className="bg-slate-800 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base">Digital Citizen Census ID Card (नागरिक प्रमाण पत्र)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PRINTABLE AREA */}
        <div className="p-6">
          <div
            id="printable-census-card"
            className="relative bg-white rounded-2xl border-2 border-slate-800 p-6 shadow-sm overflow-hidden"
          >
            {/* Top District Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-slate-800 pb-3 mb-4 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-700 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-xs">
                  SM
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                    सवाई माधोपुर जनसँख्या व नागरिक परिषद • 2026
                  </h4>
                  <p className="text-[11px] font-semibold text-emerald-700 uppercase">
                    Official Digital Citizen & Household Census Card
                  </p>
                </div>
              </div>

              {/* Status and Admin OTP Verified */}
              <div className="text-right">
                <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded border border-slate-300 inline-block font-mono">
                  {record.regNumber}
                </span>
                <span className="text-[10px] text-emerald-700 font-bold mt-0.5 flex items-center justify-end gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Admin OTP Verified
                </span>
              </div>
            </div>

            {/* MAIN CARD BODY: Left (Photo), Center (Info), Right (Real QR & Real Barcode Side by Side) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              {/* Left Column: Photo Only (No barcode underneath) */}
              <div className="md:col-span-3 flex flex-col items-center">
                <div className="w-24 h-32 rounded-xl bg-slate-100 border-2 border-slate-300 overflow-hidden flex items-center justify-center shadow-xs">
                  {record.photoUrl ? (
                    <img src={record.photoUrl} alt={record.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-2 text-slate-400">
                      <Users className="w-10 h-10 mx-auto text-slate-300" />
                      <span className="text-[9px] block text-slate-400 mt-1">नागरिक फोटो</span>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 font-semibold mt-1.5 text-center">
                  मुखिया पहचान
                </span>
              </div>

              {/* Center Column: Citizen Personal Details */}
              <div className="md:col-span-5 space-y-2 text-xs text-slate-700">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">मुखिया का नाम:</span>
                  <span className="font-bold text-sm text-slate-900">{record.fullName}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">पिता/पति:</span>
                    <span className="font-semibold text-slate-800">{record.fatherOrHusbandName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">आयु / लिंग:</span>
                    <span className="font-semibold text-slate-800">
                      {record.age} वर्ष / {record.gender === 'Male' ? 'पुरुष' : 'महिला'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">तहसील:</span>
                    <span className="font-bold text-emerald-800">{record.tehsil}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">गाँव / वार्ड:</span>
                    <span className="font-semibold text-slate-800 truncate block">{record.villageOrColony}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">मोबाइल:</span>
                    <span className="font-mono text-slate-800">{record.mobile}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">रक्त समूह:</span>
                    <span className="font-bold text-red-600">{record.bloodGroup || 'N/A'}</span>
                  </div>
                </div>

                <div className="pt-1 text-[11px] font-bold text-slate-800 border-t border-slate-100">
                  कुल परिवार सदस्य: <span className="text-emerald-700">{record.totalFamilyCount} व्यक्ति</span>
                </div>
              </div>

              {/* Right Column (Side Placement): Real QR Code & Real Barcode */}
              <div className="md:col-span-4 flex flex-col items-center justify-center p-3 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-2">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <QrCode className="w-3.5 h-3.5 text-emerald-700" /> Real Digital QR Scan
                </div>

                {/* Real Live QR Code Canvas */}
                <div className="bg-white p-1 rounded-lg border border-slate-300 shadow-2xs inline-block">
                  <canvas ref={qrCanvasRef} className="rounded"></canvas>
                </div>
                <span className="text-[9px] text-slate-500 leading-tight block">
                  मोबाइल कैमरे से स्कैन करें (Scan to verify card online)
                </span>

                {/* Real 1D Barcode Canvas */}
                <div className="w-full pt-2 border-t border-slate-200">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">
                    Official Security Barcode
                  </span>
                  <div className="bg-white px-2 py-1 rounded border border-slate-200 flex justify-center">
                    <canvas ref={barcodeCanvasRef} className="max-w-full"></canvas>
                  </div>
                </div>
              </div>
            </div>

            {/* Family Members Strip */}
            {record.familyMembers && record.familyMembers.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1.5">
                  पंजीकृत परिवार के अन्य सदस्य:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px] text-slate-700">
                  {record.familyMembers.map((m, idx) => (
                    <div key={m.id || idx} className="bg-slate-50 px-2 py-1 rounded border border-slate-200 truncate">
                      <span className="font-semibold text-slate-900">{m.name}</span>{' '}
                      <span className="text-[10px] text-slate-500">({m.relation})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Card Footer */}
            <div className="mt-4 pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[9px] text-slate-500 gap-1">
              <span>जारी तिथि: {new Date(record.registeredAt).toLocaleDateString('hi-IN')}</span>
              <span>अधिकृत सत्यापन कोड: {record.verifiedByOtp}</span>
              <span>जिला कलेक्ट्रेट, सवाई माधोपुर (राजस्थान)</span>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer"
          >
            बंद करें (Close)
          </button>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-100"
            >
              <Printer className="w-4 h-4" />
              प्रिंट कार्ड (Print ID Card)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
