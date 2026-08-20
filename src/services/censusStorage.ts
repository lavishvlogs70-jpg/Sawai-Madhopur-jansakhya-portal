import { CensusRecord, AccessOtp, OtpRequest, DistrictNotice } from '../types/census';
import {
  INITIAL_CENSUS_RECORDS,
  INITIAL_OTPS,
  INITIAL_OTP_REQUESTS,
  INITIAL_NOTICES
} from '../data/initialData';

const STORAGE_KEYS = {
  RECORDS: 'swm_census_records_v1',
  OTPS: 'swm_census_otps_v1',
  REQUESTS: 'swm_census_requests_v1',
  NOTICES: 'swm_census_notices_v1',
  ADMIN_SESSION: 'swm_admin_auth_session'
};

export class CensusStorageService {
  // Initialize with initial data if local storage is empty
  static getRecords(): CensusRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RECORDS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(INITIAL_CENSUS_RECORDS));
        return INITIAL_CENSUS_RECORDS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_CENSUS_RECORDS;
    }
  }

  static saveRecords(records: CensusRecord[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
    } catch (e) {
      console.error('Error saving records:', e);
    }
  }

  static getRecordById(id: string): CensusRecord | undefined {
    const records = this.getRecords();
    return records.find(r => r.id === id || r.regNumber.toLowerCase() === id.toLowerCase());
  }

  static addRecord(record: Omit<CensusRecord, 'id' | 'regNumber' | 'registeredAt'>): CensusRecord {
    const records = this.getRecords();
    const currentYear = new Date().getFullYear();
    const count = records.length + 1;
    const regNumber = `SWM-${currentYear}-${String(count).padStart(4, '0')}`;
    
    const newRecord: CensusRecord = {
      ...record,
      id: `rec-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      regNumber,
      registeredAt: new Date().toISOString(),
      status: 'Verified',
      totalFamilyCount: (record.familyMembers?.length || 0) + 1
    };

    records.unshift(newRecord);
    this.saveRecords(records);

    // If OTP was provided, mark it as used
    if (record.verifiedByOtp) {
      this.markOtpUsed(record.verifiedByOtp, newRecord.regNumber);
    }

    return newRecord;
  }

  static updateRecord(id: string, updatedFields: Partial<CensusRecord>): CensusRecord | null {
    const records = this.getRecords();
    const index = records.findIndex(r => r.id === id || r.regNumber === id);
    if (index === -1) return null;

    const existing = records[index];
    const totalFamilyCount = (updatedFields.familyMembers ? updatedFields.familyMembers.length : (existing.familyMembers?.length || 0)) + 1;
    
    const updated: CensusRecord = {
      ...existing,
      ...updatedFields,
      totalFamilyCount,
      updatedAt: new Date().toISOString()
    };

    records[index] = updated;
    this.saveRecords(records);
    return updated;
  }

  static deleteRecord(id: string): boolean {
    const records = this.getRecords();
    const filtered = records.filter(r => r.id !== id && r.regNumber !== id);
    if (filtered.length === records.length) return false;
    this.saveRecords(filtered);
    return true;
  }

  // OTP MANAGEMENT
  static getOtps(): AccessOtp[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.OTPS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.OTPS, JSON.stringify(INITIAL_OTPS));
        return INITIAL_OTPS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_OTPS;
    }
  }

  static saveOtps(otps: AccessOtp[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.OTPS, JSON.stringify(otps));
    } catch (e) {
      console.error('Error saving otps:', e);
    }
  }

  static generateOtp(params: {
    applicantName?: string;
    mobile?: string;
    purpose?: 'New Registration' | 'Update Record' | 'General Census';
    validHours?: number;
    customCode?: string;
  }): AccessOtp {
    const otps = this.getOtps();
    // 6-digit random code or custom
    const code = params.customCode || Math.floor(100000 + Math.random() * 900000).toString();
    const validHours = params.validHours || 48; // default 48h validity

    const newOtp: AccessOtp = {
      id: `otp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      otpCode: code,
      generatedForName: params.applicantName || 'नागरिक (Citizen)',
      generatedForPhone: params.mobile || '',
      purpose: params.purpose || 'New Registration',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + validHours * 3600 * 1000).toISOString(),
      isUsed: false,
      generatedBy: 'District Admin'
    };

    otps.unshift(newOtp);
    this.saveOtps(otps);
    return newOtp;
  }

  static verifyOtp(otpCode: string): { valid: boolean; message: string; otp?: AccessOtp } {
    const cleanCode = otpCode.trim();
    if (!cleanCode) {
      return { valid: false, message: 'कृपया OTP कोड दर्ज करें।' };
    }

    // Always accept master key for admin testing if needed
    if (cleanCode === '999888') {
      return {
        valid: true,
        message: 'मास्टर एडमिन एक्सेस स्वीकृत (Master Access Granted)',
        otp: {
          id: 'master-override',
          otpCode: '999888',
          generatedForName: 'Super Admin Override',
          purpose: 'General Census',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
          isUsed: false,
          generatedBy: 'Super Admin'
        }
      };
    }

    const otps = this.getOtps();
    const found = otps.find(o => o.otpCode === cleanCode);

    if (!found) {
      return { valid: false, message: 'अमान्य OTP! कृपया एडमिन द्वारा दिया गया सही 6-अंकों का OTP दर्ज करें।' };
    }

    if (found.isUsed) {
      return { valid: false, message: `यह OTP पहले ही उपयोग किया जा चुका है (पंजीकरण: ${found.usedByRegNumber || 'सत्यापित'})। कृपया एडमिन से नया OTP लें।` };
    }

    const now = new Date().getTime();
    const expiry = new Date(found.expiresAt).getTime();
    if (now > expiry) {
      return { valid: false, message: 'इस OTP की समय सीमा समाप्त (Expired) हो चुकी है। कृपया नया OTP जनरेट कराएं।' };
    }

    return { valid: true, message: 'OTP सफलतापूर्वक सत्यापित हुआ! अब आप फॉर्म भर सकते हैं।', otp: found };
  }

  static markOtpUsed(otpCode: string, regNumber: string): void {
    const otps = this.getOtps();
    const index = otps.findIndex(o => o.otpCode === otpCode.trim());
    if (index !== -1) {
      otps[index] = {
        ...otps[index],
        isUsed: true,
        usedAt: new Date().toISOString(),
        usedByRegNumber: regNumber
      };
      this.saveOtps(otps);
    }
  }

  static revokeOtp(id: string): void {
    const otps = this.getOtps();
    const updated = otps.filter(o => o.id !== id);
    this.saveOtps(updated);
  }

  // OTP REQUESTS
  static getRequests(): OtpRequest[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_OTP_REQUESTS));
        return INITIAL_OTP_REQUESTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_OTP_REQUESTS;
    }
  }

  static saveRequests(requests: OtpRequest[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
    } catch (e) {
      console.error('Error saving requests:', e);
    }
  }

  static createOtpRequest(request: Omit<OtpRequest, 'id' | 'requestedAt' | 'status'>): OtpRequest {
    const requests = this.getRequests();
    
    // Auto-generate the OTP immediately when requested
    const newOtp = this.generateOtp({
      applicantName: request.applicantName,
      mobile: request.mobile,
      purpose: 'New Registration'
    });

    const newReq: OtpRequest = {
      ...request,
      id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      requestedAt: new Date().toISOString(),
      status: 'Approved',
      generatedOtp: newOtp.otpCode
    };

    requests.unshift(newReq);
    this.saveRequests(requests);
    return newReq;
  }

  static approveOtpRequest(requestId: string): { request: OtpRequest; otp: AccessOtp } | null {
    const requests = this.getRequests();
    const index = requests.findIndex(r => r.id === requestId);
    if (index === -1) return null;

    const req = requests[index];
    const newOtp = this.generateOtp({
      applicantName: req.applicantName,
      mobile: req.mobile,
      purpose: 'New Registration'
    });

    const updatedReq: OtpRequest = {
      ...req,
      status: 'Approved',
      generatedOtp: newOtp.otpCode
    };

    requests[index] = updatedReq;
    this.saveRequests(requests);

    return { request: updatedReq, otp: newOtp };
  }

  static rejectOtpRequest(requestId: string): boolean {
    const requests = this.getRequests();
    const index = requests.findIndex(r => r.id === requestId);
    if (index === -1) return false;

    requests[index].status = 'Rejected';
    this.saveRequests(requests);
    return true;
  }

  // NOTICES
  static getNotices(): DistrictNotice[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTICES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(INITIAL_NOTICES));
        return INITIAL_NOTICES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_NOTICES;
    }
  }

  static addNotice(notice: Omit<DistrictNotice, 'id' | 'date'>): DistrictNotice {
    const notices = this.getNotices();
    const newNotice: DistrictNotice = {
      ...notice,
      id: `not-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    notices.unshift(newNotice);
    localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(notices));
    return newNotice;
  }

  static deleteNotice(id: string): void {
    const notices = this.getNotices();
    const filtered = notices.filter(n => n.id !== id);
    localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(filtered));
  }

  // SEARCH & ANALYTICS
  static searchRecords(query: string, tehsilFilter?: string): CensusRecord[] {
    const records = this.getRecords();
    const q = query.trim().toLowerCase();

    return records.filter(r => {
      if (tehsilFilter && tehsilFilter !== 'all' && r.tehsil !== tehsilFilter) {
        return false;
      }
      if (!q) return true;

      return (
        r.fullName.toLowerCase().includes(q) ||
        r.regNumber.toLowerCase().includes(q) ||
        r.mobile.includes(q) ||
        r.fatherOrHusbandName.toLowerCase().includes(q) ||
        r.villageOrColony.toLowerCase().includes(q) ||
        r.aadharLast4.includes(q) ||
        r.tehsil.toLowerCase().includes(q) ||
        r.familyMembers.some(fm => fm.name.toLowerCase().includes(q))
      );
    });
  }

  static getDistrictStatistics() {
    const records = this.getRecords();
    const totalFamilies = records.length;
    let totalPopulation = 0;
    let totalMales = 0;
    let totalFemales = 0;
    let totalOthers = 0;

    const tehsilCount: Record<string, number> = {};
    const occupationCount: Record<string, number> = {};
    const ageGroups = { '0-18': 0, '19-35': 0, '36-60': 0, '60+': 0 };

    records.forEach(rec => {
      // Primary person
      totalPopulation += 1;
      if (rec.gender === 'Male') totalMales += 1;
      else if (rec.gender === 'Female') totalFemales += 1;
      else totalOthers += 1;

      // Age group
      if (rec.age <= 18) ageGroups['0-18'] += 1;
      else if (rec.age <= 35) ageGroups['19-35'] += 1;
      else if (rec.age <= 60) ageGroups['36-60'] += 1;
      else ageGroups['60+'] += 1;

      // Tehsil
      tehsilCount[rec.tehsil] = (tehsilCount[rec.tehsil] || 0) + 1;

      // Primary occupation
      const occKey = rec.occupation.split('(')[0].trim();
      occupationCount[occKey] = (occupationCount[occKey] || 0) + 1;

      // Family members
      if (rec.familyMembers && rec.familyMembers.length > 0) {
        rec.familyMembers.forEach(fm => {
          totalPopulation += 1;
          if (fm.gender === 'Male') totalMales += 1;
          else if (fm.gender === 'Female') totalFemales += 1;
          else totalOthers += 1;

          if (fm.age <= 18) ageGroups['0-18'] += 1;
          else if (fm.age <= 35) ageGroups['19-35'] += 1;
          else if (fm.age <= 60) ageGroups['36-60'] += 1;
          else ageGroups['60+'] += 1;
        });
      }
    });

    return {
      totalFamilies,
      totalPopulation,
      totalMales,
      totalFemales,
      totalOthers,
      tehsilCount,
      occupationCount,
      ageGroups
    };
  }

  // RESET ALL DATA TO DEFAULTS
  static resetToDefaultData(): void {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(INITIAL_CENSUS_RECORDS));
    localStorage.setItem(STORAGE_KEYS.OTPS, JSON.stringify(INITIAL_OTPS));
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_OTP_REQUESTS));
    localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(INITIAL_NOTICES));
  }
}
