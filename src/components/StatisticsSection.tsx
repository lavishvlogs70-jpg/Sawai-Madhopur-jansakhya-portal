import React from 'react';
import { CensusRecord } from '../types/census';
import { TEHSILS_OF_SAWAI_MADHOPUR } from '../data/initialData';
import { BarChart3, Users, MapPin, Briefcase, Award, Building, Sparkles } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

interface StatisticsSectionProps {
  records: CensusRecord[];
  onOpenOtpGate: () => void;
}

const PIE_COLORS = ['#0f172a', '#1e293b', '#334155', '#475569', '#047857', '#059669', '#10B981', '#34D399'];

export const StatisticsSection: React.FC<StatisticsSectionProps> = ({ records, onOpenOtpGate }) => {
  let totalPopulation = 0;
  let totalMales = 0;
  let totalFemales = 0;
  let ruralCount = 0;
  let urbanCount = 0;

  const tehsilMap: Record<string, { families: number; pop: number }> = {};
  TEHSILS_OF_SAWAI_MADHOPUR.forEach(t => {
    tehsilMap[t.nameHi] = { families: 0, pop: 0 };
  });

  const occMap: Record<string, number> = {};

  records.forEach(r => {
    totalPopulation += r.totalFamilyCount;
    if (r.gender === 'Male') totalMales++;
    else if (r.gender === 'Female') totalFemales++;

    if (r.areaType === 'Rural') ruralCount += r.totalFamilyCount;
    else urbanCount += r.totalFamilyCount;

    if (!tehsilMap[r.tehsil]) {
      tehsilMap[r.tehsil] = { families: 0, pop: 0 };
    }
    tehsilMap[r.tehsil].families += 1;
    tehsilMap[r.tehsil].pop += r.totalFamilyCount;

    const occShort = r.occupation.split('(')[0].trim();
    occMap[occShort] = (occMap[occShort] || 0) + 1;

    r.familyMembers.forEach(m => {
      if (m.gender === 'Male') totalMales++;
      else if (m.gender === 'Female') totalFemales++;
    });
  });

  const sortedOcc = Object.entries(occMap).sort((a, b) => b[1] - a[1]);

  const pieData = TEHSILS_OF_SAWAI_MADHOPUR.map(t => ({
    name: t.nameHi,
    value: tehsilMap[t.nameHi]?.pop || 0
  })).filter(d => d.value > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header - Clean Minimalism */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 mb-1">
            <BarChart3 className="w-3.5 h-3.5" /> District Demographics & Analytics
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            सवाई माधोपुर जिला जनसँख्या व सामाजिक सर्वेक्षण आंकड़े 2026
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            जिले की सभी 8 तहसीलों का वास्तविक समय जनसँख्या, लिंगानुपात एवं रोजगार आँकड़े
          </p>
        </div>

        <button
          onClick={onOpenOtpGate}
          className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm transition shrink-0 cursor-pointer flex items-center gap-1.5"
        >
          <Sparkles className="w-4 h-4" />
          <span>+ परिवार दर्ज कराएं (Register)</span>
        </button>
      </div>

      {/* 4 Clean Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">कुल दर्ज जनसँख्या</div>
          <div className="text-3xl font-bold font-mono text-slate-900 mt-1">{totalPopulation}</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
            <Users className="w-3.5 h-3.5" /> नागरिक (Citizens)
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">कुल परिवार</div>
          <div className="text-3xl font-bold font-mono text-slate-900 mt-1">{records.length}</div>
          <div className="text-[11px] text-slate-600 mt-1 flex items-center gap-1">
            <Building className="w-3.5 h-3.5 text-slate-400" /> पंजीकृत परिवार
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">स्त्री / पुरुष अनुपात</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {totalMales} पु. / {totalFemales} म.
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            लिंगानुपात: {totalMales > 0 ? Math.round((totalFemales / totalMales) * 1000) : 0} / 1000
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">ग्रामीण / शहरी</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {Math.round((ruralCount / (totalPopulation || 1)) * 100)}% / {Math.round((urbanCount / (totalPopulation || 1)) * 100)}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">ग्रामीण / शहरी अनुपात</div>
        </div>
      </div>

      {/* Tehsil Breakdown */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-700" />
          तहसीलवार परिवार एवं जनसँख्या कवरेज (Tehsil Breakdown)
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Pie Chart Section */}
          <div className="h-[350px] w-full flex flex-col items-center justify-center bg-slate-50 rounded-xl border border-slate-100 p-4">
             {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(value: number) => [`${value} नागरिक`, 'जनसँख्या']}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 'bold' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
             ) : (
                <div className="text-slate-400 text-xs flex flex-col items-center">
                  <BarChart3 className="w-10 h-10 mb-2 opacity-20" />
                  <span>पर्याप्त डेटा उपलब्ध नहीं (No Data)</span>
                </div>
             )}
          </div>

          {/* List Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 max-h-[380px] overflow-y-auto pr-2 scrollbar-thin">
            {TEHSILS_OF_SAWAI_MADHOPUR.map(t => {
              const data = tehsilMap[t.nameHi] || { families: 0, pop: 0 };
              const percentage = totalPopulation > 0 ? Math.round((data.pop / totalPopulation) * 100) : 0;
              return (
                <div key={t.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">{t.nameHi}</span>
                      <span className="text-xs text-slate-400">{t.nameEn}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-bold text-slate-900 font-mono">{data.pop}</span>
                      <span className="text-[10px] text-slate-500 block uppercase tracking-wider">नागरिक</span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-700 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(percentage, 2)}%` }}
                    ></div>
                  </div>
                  <div className="text-[11px] text-slate-400 flex justify-between font-medium">
                    <span>हिस्सा: {percentage}%</span>
                    <span>परिवार: {data.families}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Occupations and Security */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-slate-600" />
            प्रमुख आजीविका एवं व्यवसाय (Top Occupations)
          </h3>
          <div className="space-y-3">
            {sortedOcc.map(([occ, count]) => {
              const pct = records.length > 0 ? Math.round((count / records.length) * 100) : 0;
              return (
                <div key={occ} className="space-y-1 text-xs">
                  <div className="flex justify-between font-medium text-slate-700">
                    <span>{occ}</span>
                    <span>{count} परिवार ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-slate-700 h-1.5 rounded-full"
                      style={{ width: `${Math.max(pct, 8)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-700" />
            सवाई माधोपुर जनगणना डेटा की शुद्धता व सुरक्षा
          </h3>
          <div className="text-xs text-slate-600 space-y-2.5 leading-relaxed">
            <p>
              • <strong>100% OTP प्रमाणीकरण:</strong> फर्जी प्रविष्टियों को रोकने के लिए प्रत्येक प्रविष्टि जिला एडमिन द्वारा जारी यूनिक टोकन से मान्य की जाती है।
            </p>
            <p>
              • <strong>पारिवारिक मैपिंग:</strong> मुखिया के साथ-साथ परिवार के सभी आश्रितों, पुत्रों, पुत्रियों, वरिष्ठ नागरिकों का संपूर्ण ब्यौरा दर्ज किया जाता है।
            </p>
            <p>
              • <strong>डिजिटल सत्यापन:</strong> सफल प्रविष्टि के बाद नागरिक को QR कोड युक्त आधिकारिक जनगणना पहचान पत्र प्राप्त होता है।
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={onOpenOtpGate}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer text-center"
            >
              + तुरंत जनसँख्या पंजीकरण फॉर्म भरें
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
