import React, { useState } from 'react';
import { CensusRecord } from '../types/census';
import { TEHSILS_OF_SAWAI_MADHOPUR, OCCUPATION_OPTIONS } from '../data/initialData';
import {
  Search,
  Filter,
  MapPin,
  Phone,
  Users,
  IdCard,
  CheckCircle,
  Eye,
  Building,
  Briefcase,
  Printer,
  Calendar,
  X,
  FileSpreadsheet,
  Download,
  Sparkles
} from 'lucide-react';

interface CitizenDirectoryProps {
  records: CensusRecord[];
  onViewCard: (record: CensusRecord) => void;
  onEditWithOtp: (record: CensusRecord) => void;
}

export const CitizenDirectory: React.FC<CitizenDirectoryProps> = ({
  records,
  onViewCard,
  onEditWithOtp
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTehsil, setSelectedTehsil] = useState('all');
  const [selectedArea, setSelectedArea] = useState<'all' | 'Rural' | 'Urban'>('all');
  const [selectedDetailRecord, setSelectedDetailRecord] = useState<CensusRecord | null>(null);

  // Filter records
  const filteredRecords = records.filter(record => {
    if (selectedTehsil !== 'all' && record.tehsil !== selectedTehsil) return false;
    if (selectedArea !== 'all' && record.areaType !== selectedArea) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      const matchName = record.fullName.toLowerCase().includes(q);
      const matchReg = record.regNumber.toLowerCase().includes(q);
      const matchMobile = record.mobile.includes(q);
      const matchFather = record.fatherOrHusbandName.toLowerCase().includes(q);
      const matchVillage = record.villageOrColony.toLowerCase().includes(q);
      const matchPanchayat = record.gramPanchayatOrWard.toLowerCase().includes(q);
      const matchFamily = record.familyMembers.some(m => m.name.toLowerCase().includes(q));

      return matchName || matchReg || matchMobile || matchFather || matchVillage || matchPanchayat || matchFamily;
    }

    return true;
  });

  const exportToCSV = () => {
    const headers = [
      'Registration No',
      'Full Name',
      'Father/Husband Name',
      'Gender',
      'Age',
      'Mobile',
      'Tehsil',
      'Area Type',
      'Gram Panchayat / Ward',
      'Village / Colony',
      'Pincode',
      'Occupation',
      'Education',
      'Total Family Members',
      'OTP Verified',
      'Registration Date'
    ];

    const rows = filteredRecords.map(r => [
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
      `"${r.pincode}"`,
      `"${r.occupation.replace(/"/g, '""')}"`,
      `"${r.education.replace(/"/g, '""')}"`,
      r.totalFamilyCount,
      `"${r.verifiedByOtp}"`,
      `"${new Date(r.registeredAt).toLocaleDateString('hi-IN')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Sawai_Madhopur_Census_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Title Header - Clean Minimalism */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 mb-1">
            <Users className="w-3.5 h-3.5" /> Citizen Registry Directory
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            सवाई माधोपुर नागरिक एवं परिवार डायरेक्टरी
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            नाम, मोबाइल, रजिस्ट्रेशन नंबर या गाँव के नाम से खोजें और आधिकारिक जनगणना पहचान पत्र प्राप्त करें
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            CSV एक्सपोर्ट ({filteredRecords.length})
          </button>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Main search bar */}
          <div className="lg:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="नाम, मोबाइल, रजिस्ट्रेशन सं. (उदा. SWM-2026-0001), गाँव या आधार..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50 focus:bg-white transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Tehsil filter */}
          <div className="lg:col-span-3">
            <select
              value={selectedTehsil}
              onChange={e => setSelectedTehsil(e.target.value)}
              className="w-full py-2.5 px-3 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50 focus:bg-white font-medium text-slate-800"
            >
              <option value="all">सभी तहसीलें (All 8 Tehsils)</option>
              {TEHSILS_OF_SAWAI_MADHOPUR.map(t => (
                <option key={t.id} value={t.nameHi}>
                  {t.nameHi} ({t.nameEn})
                </option>
              ))}
            </select>
          </div>

          {/* Area filter */}
          <div className="lg:col-span-3">
            <select
              value={selectedArea}
              onChange={e => setSelectedArea(e.target.value as any)}
              className="w-full py-2.5 px-3 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50 focus:bg-white font-medium text-slate-800"
            >
              <option value="all">सभी क्षेत्र (Rural & Urban)</option>
              <option value="Rural">🌾 ग्रामीण क्षेत्र (Rural)</option>
              <option value="Urban">🏢 शहरी क्षेत्र (Urban)</option>
            </select>
          </div>
        </div>

        {/* Filter Quick Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
          <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px] mr-1">
            तहसील:
          </span>
          <button
            onClick={() => setSelectedTehsil('all')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
              selectedTehsil === 'all'
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            सभी ({records.length})
          </button>
          {TEHSILS_OF_SAWAI_MADHOPUR.map(t => {
            const count = records.filter(r => r.tehsil === t.nameHi).length;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTehsil(t.nameHi)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                  selectedTehsil === t.nameHi
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {t.nameHi} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary Count */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
        <span>
          कुल <strong className="text-slate-900 font-bold">{filteredRecords.length}</strong> परिवार रिकॉर्ड प्राप्त हुए
        </span>
      </div>

      {/* Records Grid */}
      {filteredRecords.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecords.map(record => (
            <div
              key={record.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm transition-all p-5 flex flex-col justify-between"
            >
              <div>
                {/* Top Badge Row */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                    {record.regNumber}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle className="w-3 h-3" /> सत्यापित
                  </span>
                </div>

                {/* Profile Info */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-14 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                    {record.photoUrl ? (
                      <img src={record.photoUrl} alt={record.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <Users className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 leading-tight">
                      {record.fullName}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      पिता/पति: <strong className="text-slate-700">{record.fatherOrHusbandName}</strong>
                    </p>
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                      <span>आयु: <strong>{record.age} वर्ष</strong></span>
                      <span>•</span>
                      <span>रक्त: {record.bloodGroup || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Location & Details */}
                <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span className="truncate">
                      <strong>तहसील {record.tehsil}</strong> • {record.villageOrColony}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{record.occupation.split('(')[0]}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200 text-slate-500">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-emerald-700" /> {record.mobile}
                    </span>
                    <span className="font-bold text-slate-800 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      परिवार: {record.totalFamilyCount} सदस्य
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setSelectedDetailRecord(record)}
                  className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" /> विवरण देखें
                </button>
                <button
                  onClick={() => onViewCard(record)}
                  className="py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <IdCard className="w-3.5 h-3.5" /> नागरिक कार्ड
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
          <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">कोई रिकॉर्ड नहीं मिला</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            आपके द्वारा खोजे गए शब्द या फिल्टर के अनुरूप कोई नागरिक डेटा उपलब्ध नहीं है।
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedTehsil('all');
              setSelectedArea('all');
            }}
            className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-900 transition cursor-pointer"
          >
            सभी फ़िल्टर साफ़ करें
          </button>
        </div>
      )}

      {/* Comprehensive Record Details Modal */}
      {selectedDetailRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header - Clean Slate-800 */}
            <div className="bg-slate-800 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Users className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-base">{selectedDetailRecord.fullName} - पारिवारिक विवरण</h3>
                  <p className="text-xs text-slate-400">रजिस्ट्रेशन संख्या: {selectedDetailRecord.regNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDetailRecord(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Details Content */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">पिता / पति:</span>
                  <span className="font-bold text-slate-900">{selectedDetailRecord.fatherOrHusbandName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">माता का नाम:</span>
                  <span className="font-bold text-slate-900">{selectedDetailRecord.motherName || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">लिंग व आयु:</span>
                  <span className="font-bold text-slate-900">{selectedDetailRecord.gender === 'Male' ? 'पुरुष' : 'महिला'}, {selectedDetailRecord.age} वर्ष</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">मोबाइल:</span>
                  <span className="font-bold text-slate-900">{selectedDetailRecord.mobile}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">रक्त समूह:</span>
                  <span className="font-bold text-slate-900">{selectedDetailRecord.bloodGroup || 'N/A'}</span>
                </div>
              </div>

              {/* Address */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" /> निवास स्थान (Address)
                </h4>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div><strong>तहसील:</strong> {selectedDetailRecord.tehsil}</div>
                  <div><strong>क्षेत्र:</strong> {selectedDetailRecord.areaType === 'Rural' ? 'ग्रामीण (Rural)' : 'शहरी (Urban)'}</div>
                  <div><strong>पंचायत / वार्ड:</strong> {selectedDetailRecord.gramPanchayatOrWard}</div>
                  <div><strong>गाँव / मोहल्ला:</strong> {selectedDetailRecord.villageOrColony}</div>
                  <div><strong>मकान सं.:</strong> {selectedDetailRecord.houseNo}</div>
                  <div><strong>पिनकोड:</strong> {selectedDetailRecord.pincode}</div>
                  <div className="col-span-2"><strong>स्थाई पता:</strong> {selectedDetailRecord.permanentAddress}</div>
                </div>
              </div>

              {/* Family Members */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-700" /> परिवार के सदस्य ({selectedDetailRecord.familyMembers.length})
                </h4>
                {selectedDetailRecord.familyMembers.length > 0 ? (
                  <div className="border border-slate-200 rounded-xl overflow-x-auto text-xs">
                    <table className="w-full min-w-[400px] text-left">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-2.5">क्र.</th>
                          <th className="p-2.5">नाम</th>
                          <th className="p-2.5">संबंध</th>
                          <th className="p-2.5">आयु / लिंग</th>
                          <th className="p-2.5">शिक्षा</th>
                          <th className="p-2.5">व्यवसाय</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {selectedDetailRecord.familyMembers.map((m, idx) => (
                          <tr key={m.id || idx} className="hover:bg-slate-50">
                            <td className="p-2.5 text-slate-400 font-mono">{idx + 1}</td>
                            <td className="p-2.5 font-bold text-slate-900">{m.name}</td>
                            <td className="p-2.5 text-emerald-800 font-medium">{m.relation}</td>
                            <td className="p-2.5">{m.age} वर्ष / {m.gender === 'Male' ? 'पु.' : 'म.'}</td>
                            <td className="p-2.5 text-slate-600">{m.education.split('(')[0]}</td>
                            <td className="p-2.5 text-slate-600">{m.occupation.split('(')[0]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">कोई अन्य परिवार सदस्य दर्ज नहीं है।</p>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setSelectedDetailRecord(null)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                बंद करें
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const rec = selectedDetailRecord;
                    setSelectedDetailRecord(null);
                    onEditWithOtp(rec);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  संशोधन करें (Update)
                </button>
                <button
                  onClick={() => {
                    const rec = selectedDetailRecord;
                    setSelectedDetailRecord(null);
                    onViewCard(rec);
                  }}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-sm"
                >
                  <IdCard className="w-4 h-4" />
                  नागरिक कार्ड प्रिंट करें
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
