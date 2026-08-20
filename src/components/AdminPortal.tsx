import React, { useState } from 'react';
import { CensusRecord, AccessOtp, OtpRequest, DistrictNotice } from '../types/census';
import { CensusStorageService } from '../services/censusStorage';
import { TEHSILS_OF_SAWAI_MADHOPUR } from '../data/initialData';
import {
  ShieldCheck,
  KeyRound,
  Users,
  CheckCircle,
  Clock,
  Plus,
  Trash2,
  Eye,
  Edit,
  Download,
  Copy,
  Check,
  Send,
  AlertCircle,
  Bell,
  RefreshCw,
  Search,
  Filter,
  LogOut,
  Building,
  Printer,
  Sparkles,
  Phone,
  FileSpreadsheet
} from 'lucide-react';

interface AdminPortalProps {
  records: CensusRecord[];
  otps: AccessOtp[];
  requests: OtpRequest[];
  notices: DistrictNotice[];
  onRefreshData: () => void;
  onViewCard: (record: CensusRecord) => void;
  onEditRecord: (record: CensusRecord) => void;
  onLogout: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  records,
  otps,
  requests,
  notices,
  onRefreshData,
  onViewCard,
  onEditRecord,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'otp-hub' | 'records' | 'requests' | 'notices'>('overview');
  const [copiedOtp, setCopiedOtp] = useState<string | null>(null);

  // OTP Generator Form State
  const [genName, setGenName] = useState('');
  const [genPhone, setGenPhone] = useState('');
  const [genPurpose, setGenPurpose] = useState<'New Registration' | 'Update Record' | 'General Census'>('New Registration');
  const [genCustomCode, setGenCustomCode] = useState('');
  const [genValidityHours, setGenValidityHours] = useState(48);
  const [lastGeneratedOtp, setLastGeneratedOtp] = useState<AccessOtp | null>(null);

  // Notice Form State
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeContent, setNewNoticeContent] = useState('');

  // Search in Records
  const [recordSearch, setRecordSearch] = useState('');
  const [recordTehsilFilter, setRecordTehsilFilter] = useState('all');

  // Stats calculation
  const totalCitizens = records.reduce((acc, r) => acc + r.totalFamilyCount, 0);
  const activeOtpsCount = otps.filter(o => !o.isUsed && new Date(o.expiresAt).getTime() > Date.now()).length;
  const pendingRequestsCount = requests.filter(r => r.status === 'Pending').length;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedOtp(code);
    setTimeout(() => setCopiedOtp(null), 2000);
  };

  const handleGenerateOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const otp = CensusStorageService.generateOtp({
      applicantName: genName.trim() || undefined,
      mobile: genPhone.trim() || undefined,
      purpose: genPurpose,
      validHours: Number(genValidityHours),
      customCode: genCustomCode.trim() || undefined
    });

    setLastGeneratedOtp(otp);
    setGenName('');
    setGenPhone('');
    setGenCustomCode('');
    onRefreshData();
  };

  const handleApproveRequest = (requestId: string) => {
    const result = CensusStorageService.approveOtpRequest(requestId);
    if (result) {
      onRefreshData();
      alert(`OTP ${result.otp.otpCode} जनरेट किया गया और आवेदक ${result.request.applicantName} के लिए स्वीकृत हुआ!`);
    }
  };

  const handleRejectRequest = (requestId: string) => {
    CensusStorageService.rejectOtpRequest(requestId);
    onRefreshData();
  };

  const handleRevokeOtp = (id: string) => {
    if (confirm('क्या आप निश्चित रूप से इस OTP को रद्द करना चाहते हैं?')) {
      CensusStorageService.revokeOtp(id);
      onRefreshData();
    }
  };

  const handleDeleteRecord = (id: string) => {
    if (confirm('क्या आप निश्चित रूप से इस नागरिक जनगणना रिकॉर्ड को हटाना चाहते हैं?')) {
      CensusStorageService.deleteRecord(id);
      onRefreshData();
    }
  };

  const handleAddNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle.trim()) return;
    CensusStorageService.addNotice({
      title: newNoticeTitle.trim(),
      content: newNoticeContent.trim() || newNoticeTitle.trim(),
      isUrgent: false
    });
    setNewNoticeTitle('');
    setNewNoticeContent('');
    onRefreshData();
  };

  const handleDeleteNotice = (id: string) => {
    CensusStorageService.deleteNotice(id);
    onRefreshData();
  };

  const handleResetData = () => {
    if (confirm('क्या आप सभी डेटा को डिफ़ॉल्ट सवाई माधोपुर डेमो डेटा पर रीसेट करना चाहते हैं?')) {
      CensusStorageService.resetToDefaultData();
      onRefreshData();
      alert('डेटा सफलतापूर्वक रीसेट हो गया!');
    }
  };

  const filteredRecords = records.filter(r => {
    if (recordTehsilFilter !== 'all' && r.tehsil !== recordTehsilFilter) return false;
    if (recordSearch.trim()) {
      const q = recordSearch.toLowerCase();
      return (
        r.fullName.toLowerCase().includes(q) ||
        r.regNumber.toLowerCase().includes(q) ||
        r.mobile.includes(q) ||
        r.villageOrColony.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const exportAllCSV = () => {
    const headers = [
      'RegNumber',
      'Name',
      'Father/Husband',
      'Gender',
      'Age',
      'Mobile',
      'Tehsil',
      'Area',
      'Panchayat/Ward',
      'Village',
      'HouseNo',
      'Pincode',
      'Occupation',
      'FamilyMembersCount',
      'VerifiedOtp',
      'RegisteredAt'
    ];

    const rows = records.map(r => [
      `"${r.regNumber}"`,
      `"${r.fullName}"`,
      `"${r.fatherOrHusbandName}"`,
      `"${r.gender}"`,
      r.age,
      `"${r.mobile}"`,
      `"${r.tehsil}"`,
      `"${r.areaType}"`,
      `"${r.gramPanchayatOrWard}"`,
      `"${r.villageOrColony}"`,
      `"${r.houseNo}"`,
      `"${r.pincode}"`,
      `"${r.occupation.replace(/"/g, '""')}"`,
      r.totalFamilyCount,
      `"${r.verifiedByOtp}"`,
      `"${r.registeredAt}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SWM_Census_Master_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Admin Top Header - Clean Slate-800 */}
      <div className="bg-slate-800 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-700">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-sm shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] bg-slate-700 text-emerald-400 font-bold px-2 py-0.5 rounded border border-slate-600">
                District Admin Panel
              </span>
              <span className="text-xs text-slate-400">Sawai Madhopur HQ</span>
            </div>
            <h2 className="text-lg md:text-xl font-bold tracking-tight text-white mt-0.5">
              जिला जनगणना एवं OTP नियंत्रण कक्ष (Census & OTP Hub)
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={exportAllCSV}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4" /> मास्टर CSV
          </button>
          <button
            onClick={handleResetData}
            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold rounded-lg transition flex items-center gap-1 cursor-pointer"
            title="डेटा रीसेट"
          >
            <RefreshCw className="w-3.5 h-3.5" /> रीसेट
          </button>
          <button
            onClick={onLogout}
            className="px-3.5 py-2 bg-slate-700 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> लॉगआउट
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="bg-white rounded-2xl p-2 shadow-sm border border-slate-200 flex flex-wrap gap-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-slate-800 text-white shadow-sm font-bold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building className="w-4 h-4" /> डैशबोर्ड अवलोकन (Overview)
        </button>

        <button
          onClick={() => setActiveTab('otp-hub')}
          className={`px-4 py-2 rounded-lg transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'otp-hub'
              ? 'bg-slate-800 text-white shadow-sm font-bold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <KeyRound className="w-4 h-4" /> OTP प्रबंधन ({otps.length})
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-lg transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'requests'
              ? 'bg-slate-800 text-white shadow-sm font-bold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4" /> लंबित अनुरोध ({pendingRequestsCount})
          {pendingRequestsCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('records')}
          className={`px-4 py-2 rounded-lg transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'records'
              ? 'bg-slate-800 text-white shadow-sm font-bold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" /> मास्टर जनगणना रिकॉर्ड्स ({records.length})
        </button>

        <button
          onClick={() => setActiveTab('notices')}
          className={`px-4 py-2 rounded-lg transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'notices'
              ? 'bg-slate-800 text-white shadow-sm font-bold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <AlertCircle className="w-4 h-4" /> लाइव नोटिस ({notices.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in">
          {/* 4 Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">कुल दर्ज जनसंख्या</span>
                <span className="text-3xl font-bold text-slate-900 font-mono mt-1 block">{totalCitizens}</span>
                <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">नागरिक (Citizens)</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">पंजीकृत परिवार</span>
                <span className="text-3xl font-bold text-slate-900 font-mono mt-1 block">{records.length}</span>
                <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">मुखिया परिवार</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Building className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">सक्रिय OTPs</span>
                <span className="text-3xl font-bold text-slate-900 font-mono mt-1 block">{activeOtpsCount}</span>
                <span className="text-[11px] text-slate-500 font-semibold block mt-0.5">उपलब्ध टोकन</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <KeyRound className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">लंबित अनुरोध</span>
                <span className="text-3xl font-bold text-amber-600 font-mono mt-1 block">{pendingRequestsCount}</span>
                <span className="text-[11px] text-amber-700 font-semibold block mt-0.5">समीक्षा बाकी</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Bell className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Tehsil Breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-700" />
              सवाई माधोपुर 8 तहसील वार जनसँख्या स्थिति
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {TEHSILS_OF_SAWAI_MADHOPUR.map(t => {
                const count = records.filter(r => r.tehsil === t.nameHi).length;
                const pop = records
                  .filter(r => r.tehsil === t.nameHi)
                  .reduce((acc, r) => acc + r.totalFamilyCount, 0);
                return (
                  <div key={t.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="font-bold text-slate-900 text-xs">{t.nameHi}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{t.nameEn}</div>
                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="text-base font-bold text-slate-900 font-mono">{count}</span>
                      <span className="text-[11px] text-slate-500">परिवार ({pop} जन)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick OTP Generator */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                त्वरित 1-क्लिक OTP जनरेटर (Instant Code Generation)
              </h3>
              <form onSubmit={handleGenerateOtp} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="नागरिक का नाम"
                    value={genName}
                    onChange={e => setGenName(e.target.value)}
                    className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="मोबाइल नंबर"
                    value={genPhone}
                    onChange={e => setGenPhone(e.target.value)}
                    className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  नया 6-अंकों का Access OTP जनरेट करें
                </button>
              </form>

              {lastGeneratedOtp && (
                <div className="p-3 bg-white rounded-xl border border-emerald-300 flex items-center justify-between animate-in fade-in">
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">ताज़ा जनरेटेड OTP:</div>
                    <div className="text-xl font-mono font-bold text-emerald-800">{lastGeneratedOtp.otpCode}</div>
                    <div className="text-[11px] text-slate-600">नाम: {lastGeneratedOtp.generatedForName}</div>
                  </div>
                  <button
                    onClick={() => handleCopy(lastGeneratedOtp.otpCode)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition flex items-center gap-1 cursor-pointer border border-slate-200"
                  >
                    {copiedOtp === lastGeneratedOtp.otpCode ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedOtp === lastGeneratedOtp.otpCode ? 'कॉपी हुआ!' : 'कॉपी करें'}
                  </button>
                </div>
              )}
            </div>

            {/* Pending OTP requests */}
            <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-600" />
                    नागरिकों से प्राप्त हालिया अनुरोध
                  </h3>
                  <button
                    onClick={() => setActiveTab('requests')}
                    className="text-xs text-emerald-700 font-semibold hover:underline"
                  >
                    सभी देखें ({requests.length})
                  </button>
                </div>

                <div className="space-y-2">
                  {requests.slice(0, 3).map(req => (
                    <div key={req.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900">{req.applicantName}</div>
                        <div className="text-[11px] text-slate-500">{req.tehsil} • मो: {req.mobile}</div>
                      </div>
                      <div>
                        {req.status === 'Pending' ? (
                          <button
                            onClick={() => handleApproveRequest(req.id)}
                            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg text-[11px] cursor-pointer"
                          >
                            स्वीकृत करें
                          </button>
                        ) : (
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            OTP: {req.generatedOtp}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 text-xs text-slate-400">
                एडमिन पोर्टल द्वारा सवाई माधोपुर के सभी रिकॉर्ड्स सुरक्षित व अद्यतन रहते हैं।
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OTP HUB */}
      {activeTab === 'otp-hub' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-emerald-700" />
              नया Access OTP जनरेट करें (Generate OTP)
            </h3>
            
            <form onSubmit={handleGenerateOtp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">आवेदक का नाम</label>
                <input
                  type="text"
                  placeholder="उदा. सुरेश जांगिड़"
                  value={genName}
                  onChange={e => setGenName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">मोबाइल नंबर</label>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="94140XXXXX"
                  value={genPhone}
                  onChange={e => setGenPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">कस्टम OTP (ऐच्छिक)</label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="खाली छोड़ें तो रैंडम"
                  value={genCustomCode}
                  onChange={e => setGenCustomCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">वैधता सीमा</label>
                <select
                  value={genValidityHours}
                  onChange={e => setGenValidityHours(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                >
                  <option value={24}>24 घंटे (1 Day)</option>
                  <option value={48}>48 घंटे (2 Days)</option>
                  <option value={168}>7 दिन (1 Week)</option>
                </select>
              </div>

              <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-sm transition flex items-center gap-2 cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  6-अंकों का नया OTP जारी करें
                </button>
              </div>
            </form>
          </div>

          {/* Master OTP Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-emerald-700" />
                सभी जनरेटेड OTPs सूची ({otps.length})
              </h4>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">OTP कोड</th>
                    <th className="p-3">जिसके लिए बनाया</th>
                    <th className="p-3">मोबाइल</th>
                    <th className="p-3">स्थिति (Status)</th>
                    <th className="p-3">जनरेट तिथि</th>
                    <th className="p-3">पंजीकरण सं.</th>
                    <th className="p-3 text-right">कार्य</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {otps.map(otp => {
                    const isExpired = !otp.isUsed && new Date(otp.expiresAt).getTime() < Date.now();
                    return (
                      <tr key={otp.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-sm text-slate-900 flex items-center gap-1.5">
                          <span>{otp.otpCode}</span>
                          <button
                            onClick={() => handleCopy(otp.otpCode)}
                            className="p-1 text-slate-400 hover:text-slate-600 transition"
                            title="कॉपी करें"
                          >
                            {copiedOtp === otp.otpCode ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </td>
                        <td className="p-3 font-medium text-slate-900">{otp.generatedForName || 'N/A'}</td>
                        <td className="p-3 text-slate-600">{otp.generatedForPhone || 'N/A'}</td>
                        <td className="p-3">
                          {otp.isUsed ? (
                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold text-[10px]">
                              उपयोग हो चुका
                            </span>
                          ) : isExpired ? (
                            <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded font-semibold text-[10px]">
                              समय समाप्त
                            </span>
                          ) : (
                            <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-semibold text-[10px] border border-emerald-200">
                              सक्रिय (Active)
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-slate-400 text-[11px]">
                          {new Date(otp.createdAt).toLocaleDateString('hi-IN')}
                        </td>
                        <td className="p-3 text-slate-700 font-mono text-[11px]">
                          {otp.usedByRegNumber || '-'}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleRevokeOtp(otp.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded transition"
                            title="रद्द करें"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PENDING REQUESTS */}
      {activeTab === 'requests' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requests.map(req => (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{req.applicantName}</h4>
                    <p className="text-xs text-slate-500">
                      तहसील: <strong className="text-slate-800">{req.tehsil}</strong> • {req.villageOrCity}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                      req.status === 'Pending'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {req.status}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1 text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-700" />
                    <strong>मोबाइल:</strong> <span>{req.mobile}</span>
                  </div>
                  <div><strong>कारण:</strong> {req.reason}</div>
                </div>

                {req.status === 'Approved' && req.generatedOtp && (
                  <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-500 text-[10px] block font-bold uppercase">जारी OTP:</span>
                      <span className="text-base font-mono font-bold text-emerald-900">{req.generatedOtp}</span>
                    </div>
                    <button
                      onClick={() => handleCopy(req.generatedOtp!)}
                      className="px-2.5 py-1 bg-emerald-700 text-white font-bold text-xs rounded hover:bg-emerald-800"
                    >
                      {copiedOtp === req.generatedOtp ? 'कॉपी हुआ!' : 'कॉपी OTP'}
                    </button>
                  </div>
                )}

                {req.status === 'Pending' && (
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleApproveRequest(req.id)}
                      className="flex-1 py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg transition cursor-pointer"
                    >
                      ✓ स्वीकृत करें व OTP बनाएं
                    </button>
                    <button
                      onClick={() => handleRejectRequest(req.id)}
                      className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition cursor-pointer"
                    >
                      अस्वीकृत
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MASTER RECORDS */}
      {activeTab === 'records' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="w-full sm:w-72 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="नाम, मोबाइल, रजिस्ट्रेशन से खोजें..."
                value={recordSearch}
                onChange={e => setRecordSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50"
              />
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <select
                value={recordTehsilFilter}
                onChange={e => setRecordTehsilFilter(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 font-medium text-slate-800"
              >
                <option value="all">सभी तहसीलें ({records.length})</option>
                {TEHSILS_OF_SAWAI_MADHOPUR.map(t => (
                  <option key={t.id} value={t.nameHi}>{t.nameHi}</option>
                ))}
              </select>

              <button
                onClick={exportAllCSV}
                className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1 cursor-pointer shrink-0 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" /> CSV
              </button>
            </div>
          </div>

          {/* Master Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">पंजीकरण सं.</th>
                    <th className="p-3">मुखिया का नाम</th>
                    <th className="p-3">पिता/पति</th>
                    <th className="p-3">तहसील व गाँव</th>
                    <th className="p-3">मोबाइल</th>
                    <th className="p-3">परिवार</th>
                    <th className="p-3">व्यवसाय</th>
                    <th className="p-3 text-right">कार्य</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredRecords.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-700">{r.regNumber}</td>
                      <td className="p-3 font-bold text-slate-900">{r.fullName}</td>
                      <td className="p-3 text-slate-600">{r.fatherOrHusbandName}</td>
                      <td className="p-3 text-slate-700">
                        <span className="font-semibold text-slate-900">{r.tehsil}</span> • {r.villageOrColony}
                      </td>
                      <td className="p-3 font-mono">{r.mobile}</td>
                      <td className="p-3 font-bold text-emerald-800">
                        {r.totalFamilyCount} सदस्य
                      </td>
                      <td className="p-3 text-slate-600 truncate max-w-[140px]">{r.occupation.split('(')[0]}</td>
                      <td className="p-3 text-right space-x-1">
                        <button
                          onClick={() => onViewCard(r)}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded"
                          title="कार्ड देखें"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEditRecord(r)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded"
                          title="संशोधन करें"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(r.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded"
                          title="डिलीट करें"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: NOTICES */}
      {activeTab === 'notices' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-emerald-700" />
              शीर्ष लाइव नोटिस प्रकाशित करें (Publish Notice)
            </h3>
            
            <form onSubmit={handleAddNotice} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">नोटिस शीर्षक *</label>
                <input
                  type="text"
                  required
                  placeholder="उदा. सवाई माधोपुर विशेष जनगणना शिविर..."
                  value={newNoticeTitle}
                  onChange={e => setNewNoticeTitle(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="py-2 px-5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-sm transition flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                नोटिस प्रकाशित करें
              </button>
            </form>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">सक्रिय सूचनाएं ({notices.length}):</h4>
            {notices.map(notice => (
              <div
                key={notice.id}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900 text-sm">{notice.title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">दिनांक: {notice.date}</div>
                </div>
                <button
                  onClick={() => handleDeleteNotice(notice.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded transition shrink-0"
                  title="हटाएं"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
