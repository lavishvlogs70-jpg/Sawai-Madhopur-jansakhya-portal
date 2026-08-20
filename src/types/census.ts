export interface FamilyMember {
  id: string;
  name: string;
  relation: string; // e.g. पत्नी, पुत्र, पुत्री, पिता, माता
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  education: string;
  occupation: string;
  bloodGroup?: string;
}

export interface CensusRecord {
  id: string;
  regNumber: string; // e.g. SWM-2026-0001
  fullName: string;
  fatherOrHusbandName: string;
  motherName?: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  age: number;
  maritalStatus: 'Married' | 'Unmarried' | 'Widowed' | 'Divorced';
  bloodGroup?: string;
  mobile: string;
  whatsapp?: string;
  email?: string;
  aadharLast4?: string;
  voterId?: string;

  // Location / Address Details
  district: 'Sawai Madhopur';
  tehsil: string; // e.g. सवाई माधोपुर, गंगापुर सिटी, बामनवास, बौंली, चौथ का बरवाड़ा, खंडार, मलारना डूंगर, वजीरपुर
  areaType: 'Rural' | 'Urban';
  gramPanchayatOrWard: string;
  villageOrColony: string;
  houseNo: string;
  pincode: string;
  permanentAddress: string;
  nativePlace?: string;

  // Socio-Economic Details
  education: string;
  occupation: string;
  occupationDetails?: string;
  annualIncome: string;

  // Family Info
  familyMembers: FamilyMember[];
  totalFamilyCount: number;

  // Verification & Admin Access
  verifiedByOtp: string; // The OTP code used
  registeredAt: string;
  updatedAt?: string;
  status: 'Verified' | 'Pending' | 'Flagged';
  photoUrl?: string;
  notes?: string;
}

export interface AccessOtp {
  id: string;
  otpCode: string; // 6-digit code
  generatedForName?: string;
  generatedForPhone?: string;
  purpose: 'New Registration' | 'Update Record' | 'General Census';
  createdAt: string;
  expiresAt: string;
  isUsed: boolean;
  usedAt?: string;
  usedByRegNumber?: string;
  generatedBy: string; // 'Admin' | 'District Collectorate'
}

export interface OtpRequest {
  id: string;
  applicantName: string;
  mobile: string;
  tehsil: string;
  villageOrCity: string;
  reason: string;
  requestedAt: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  generatedOtp?: string;
}

export interface DistrictNotice {
  id: string;
  title: string;
  content: string;
  date: string;
  isUrgent?: boolean;
}
