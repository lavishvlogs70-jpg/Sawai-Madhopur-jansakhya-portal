/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CensusRecord, AccessOtp, OtpRequest, DistrictNotice } from './types/census';
import { CensusStorageService } from './services/censusStorage';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CensusForm } from './components/CensusForm';
import { CitizenDirectory } from './components/CitizenDirectory';
import { StatisticsSection } from './components/StatisticsSection';
import { DownloadsSection } from './components/DownloadsSection';
import { AboutAndContact } from './components/AboutAndContact';
import { AdminPortal } from './components/AdminPortal';
import { OtpVerificationModal } from './components/OtpVerificationModal';
import { OtpRequestModal } from './components/OtpRequestModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { CensusIdCardModal } from './components/CensusIdCardModal';
import { Footer } from './components/Footer';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [lang, setLang] = useState<'hi' | 'en'>('hi');

  // Data Store
  const [records, setRecords] = useState<CensusRecord[]>([]);
  const [otps, setOtps] = useState<AccessOtp[]>([]);
  const [requests, setRequests] = useState<OtpRequest[]>([]);
  const [notices, setNotices] = useState<DistrictNotice[]>([]);

  // Modals & Flow State
  const [isOtpGateOpen, setIsOtpGateOpen] = useState(false);
  const [isOtpRequestModalOpen, setIsOtpRequestModalOpen] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [verifiedOtp, setVerifiedOtp] = useState<AccessOtp | null>(null);
  const [editingRecord, setEditingRecord] = useState<CensusRecord | null>(null);
  const [activeCardRecord, setActiveCardRecord] = useState<CensusRecord | null>(null);

  // Load all data on mount and provide refresh
  const refreshAllData = () => {
    const loadedRecords = CensusStorageService.getRecords();
    setRecords(loadedRecords);
    setOtps(CensusStorageService.getOtps());
    setRequests(CensusStorageService.getRequests());
    setNotices(CensusStorageService.getNotices());

    // Check if URL has ?card=SWM-2026-XXXX parameter (from QR code scanning)
    const urlParams = new URLSearchParams(window.location.search);
    const cardParam = urlParams.get('card');
    if (cardParam) {
      const found = loadedRecords.find(
        r => r.regNumber.toLowerCase() === cardParam.toLowerCase() || r.id === cardParam
      );
      if (found) {
        setActiveCardRecord(found);
      }
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // Stats calculation
  const totalPopulation = records.reduce((acc, r) => acc + r.totalFamilyCount, 0);
  const totalMales = records.reduce((acc, r) => {
    let count = r.gender === 'Male' ? 1 : 0;
    count += r.familyMembers.filter(m => m.gender === 'Male').length;
    return acc + count;
  }, 0);
  const totalFemales = records.reduce((acc, r) => {
    let count = r.gender === 'Female' ? 1 : 0;
    count += r.familyMembers.filter(m => m.gender === 'Female').length;
    return acc + count;
  }, 0);

  const stats = {
    totalPopulation,
    totalFamilies: records.length,
    totalMales,
    totalFemales
  };

  // Open Form Flow with OTP Verification
  const handleStartRegistration = () => {
    setEditingRecord(null);
    setIsOtpGateOpen(true);
  };

  // On OTP successfully validated
  const handleOtpVerified = (otp: AccessOtp) => {
    setVerifiedOtp(otp);
    setIsOtpGateOpen(false);
    setCurrentTab('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // On Edit with OTP
  const handleEditWithOtp = (record: CensusRecord) => {
    setEditingRecord(record);
    setIsOtpGateOpen(true);
  };

  // Form Submission Success
  const handleFormSuccess = (savedRecord: CensusRecord) => {
    refreshAllData();
    setVerifiedOtp(null);
    setEditingRecord(null);
    setActiveCardRecord(savedRecord);
    setCurrentTab('directory');
  };

  // Admin login flow
  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setCurrentTab('admin');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setCurrentTab('home');
  };

  const handleEditRecordAsAdmin = (record: CensusRecord) => {
    setEditingRecord(record);
    setVerifiedOtp({
      id: 'admin-edit-session',
      otpCode: 'ADMIN-DIRECT',
      generatedForName: record.fullName,
      purpose: 'Update Record',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
      isUsed: false,
      generatedBy: 'Admin'
    });
    setCurrentTab('form');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={tab => {
          if (tab === 'form') {
            handleStartRegistration();
          } else {
            setCurrentTab(tab);
          }
        }}
        notices={notices}
        onOpenOtpGate={handleStartRegistration}
        onOpenAdminModal={() => {
          if (isAdminLoggedIn) {
            setCurrentTab('admin');
          } else {
            setIsAdminLoginModalOpen(true);
          }
        }}
        lang={lang}
        setLang={setLang}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        {currentTab === 'home' && (
          <div className="space-y-6">
            <HeroSection
              onOpenOtpGate={handleStartRegistration}
              onRequestOtp={() => setIsOtpRequestModalOpen(true)}
              onOpenDirectory={() => setCurrentTab('directory')}
              onOpenStats={() => setCurrentTab('statistics')}
              stats={stats}
              lang={lang}
            />

            {/* Tehsils Quick Highlights - Clean Minimalism */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 uppercase tracking-tight">
                      सवाई माधोपुर जिला - 8 तहसील जनसँख्या स्थिति
                    </h3>
                    <p className="text-xs text-slate-500">
                      प्रत्येक तहसील से सटीक एवं प्रामाणिक जनसंख्या डेटा एकत्र किया जा रहा है
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentTab('directory')}
                    className="text-xs text-emerald-700 font-bold hover:underline"
                  >
                    पूरी डायरेक्टरी देखें →
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { name: 'सवाई माधोपुर', count: records.filter(r => r.tehsil === 'सवाई माधोपुर').length },
                    { name: 'गंगापुर सिटी', count: records.filter(r => r.tehsil === 'गंगापुर सिटी').length },
                    { name: 'बामनवास', count: records.filter(r => r.tehsil === 'बामनवास').length },
                    { name: 'बौंली', count: records.filter(r => r.tehsil === 'बौंली').length },
                    { name: 'चौथ का बरवाड़ा', count: records.filter(r => r.tehsil === 'चौथ का बरवाड़ा').length },
                    { name: 'खंडार', count: records.filter(r => r.tehsil === 'खंडार').length },
                    { name: 'मलारना डूंगर', count: records.filter(r => r.tehsil === 'मलारना डूंगर').length },
                    { name: 'वजीरपुर', count: records.filter(r => r.tehsil === 'वजीरपुर').length }
                  ].map(t => (
                    <div
                      key={t.name}
                      onClick={() => setCurrentTab('directory')}
                      className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 cursor-pointer transition flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-xs text-slate-900">{t.name}</div>
                        <div className="text-[10px] text-slate-400">तहसील ब्लॉक</div>
                      </div>
                      <span className="text-base font-bold text-slate-900 font-mono">
                        {t.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Action Banner - Clean Slate-800 Theme */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
              <div className="bg-slate-800 text-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight">
                    क्या आपने सवाई माधोपुर जनगणना में अपना नाम दर्ज कराया?
                  </h3>
                  <p className="text-xs md:text-sm text-slate-400 mt-1">
                    सटीक डेटा संकलन से आपके क्षेत्र के विकास एवं सामाजिक सहयोग को गति मिलेगी।
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 shrink-0">
                  <button
                    onClick={handleStartRegistration}
                    className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
                  >
                    📝 अभी फॉर्म भरें (OTP द्वारा)
                  </button>
                  <button
                    onClick={() => setIsOtpRequestModalOpen(true)}
                    className="px-5 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600 font-semibold text-xs rounded-xl transition cursor-pointer"
                  >
                    📞 एडमिन से OTP प्राप्त करें
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Census Registration Form Tab */}
        {currentTab === 'form' && verifiedOtp && (
          <CensusForm
            verifiedOtp={verifiedOtp}
            editingRecord={editingRecord}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setVerifiedOtp(null);
              setEditingRecord(null);
              setCurrentTab('home');
            }}
          />
        )}

        {/* Citizen Directory Tab */}
        {currentTab === 'directory' && (
          <CitizenDirectory
            records={records}
            onViewCard={record => setActiveCardRecord(record)}
            onEditWithOtp={handleEditWithOtp}
          />
        )}

        {/* Statistics & Demographics Tab */}
        {currentTab === 'statistics' && (
          <StatisticsSection
            records={records}
            onOpenOtpGate={handleStartRegistration}
          />
        )}

        {/* Downloads & Card Search Tab */}
        {currentTab === 'downloads' && (
          <DownloadsSection
            records={records}
            onViewCard={record => setActiveCardRecord(record)}
            onOpenOtpGate={handleStartRegistration}
            onRequestOtp={() => setIsOtpRequestModalOpen(true)}
          />
        )}

        {/* About District & Contact Tab */}
        {(currentTab === 'about' || currentTab === 'contact') && (
          <AboutAndContact
            viewMode={currentTab as 'about' | 'contact'}
            onOpenOtpGate={handleStartRegistration}
            onRequestOtp={() => setIsOtpRequestModalOpen(true)}
          />
        )}

        {/* Admin Management Hub */}
        {currentTab === 'admin' && isAdminLoggedIn && (
          <AdminPortal
            records={records}
            otps={otps}
            requests={requests}
            notices={notices}
            onRefreshData={refreshAllData}
            onViewCard={record => setActiveCardRecord(record)}
            onEditRecord={handleEditRecordAsAdmin}
            onLogout={handleAdminLogout}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectTab={tab => {
          if (tab === 'form') {
            handleStartRegistration();
          } else {
            setCurrentTab(tab);
          }
        }}
        onOpenOtpGate={handleStartRegistration}
        onRequestOtp={() => setIsOtpRequestModalOpen(true)}
        onOpenAdminModal={() => {
          if (isAdminLoggedIn) {
            setCurrentTab('admin');
          } else {
            setIsAdminLoginModalOpen(true);
          }
        }}
      />

      {/* MODALS */}
      {/* 1. Admin OTP Verification Gate Modal */}
      <OtpVerificationModal
        isOpen={isOtpGateOpen}
        onVerified={handleOtpVerified}
        onClose={() => setIsOtpGateOpen(false)}
        onRequestOtp={() => {
          setIsOtpGateOpen(false);
          setIsOtpRequestModalOpen(true);
        }}
      />

      {/* 2. OTP Request Form Modal */}
      <OtpRequestModal
        isOpen={isOtpRequestModalOpen}
        onClose={() => setIsOtpRequestModalOpen(false)}
        onAutoFillOtp={demoOtp => {
          setIsOtpRequestModalOpen(false);
          const res = CensusStorageService.verifyOtp(demoOtp);
          if (res.valid && res.otp) {
            handleOtpVerified(res.otp);
          } else {
            setIsOtpGateOpen(true);
          }
        }}
      />

      {/* 3. Admin Login PIN Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onLoginSuccess={handleAdminLoginSuccess}
        onClose={() => setIsAdminLoginModalOpen(false)}
      />

      {/* 4. Digital Census ID Card & Print Slip Modal with real QR / Barcode */}
      <CensusIdCardModal
        record={activeCardRecord}
        onClose={() => {
          setActiveCardRecord(null);
          // Clean URL param if present
          if (window.location.search.includes('card=')) {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }}
      />
    </div>
  );
}
