import { CensusRecord, AccessOtp, OtpRequest, DistrictNotice } from '../types/census';

export const TEHSILS_OF_SAWAI_MADHOPUR = [
  { id: 'sawai-madhopur', nameHi: 'सवाई माधोपुर', nameEn: 'Sawai Madhopur', pincodes: ['322001', '322021', '322027'] },
  { id: 'gangapur-city', nameHi: 'गंगापुर सिटी', nameEn: 'Gangapur City', pincodes: ['322201', '322202'] },
  { id: 'bamanwas', nameHi: 'बामनवास', nameEn: 'Bamanwas', pincodes: ['322211', '322214'] },
  { id: 'bonli', nameHi: 'बौंली', nameEn: 'Bonli', pincodes: ['322023', '322030'] },
  { id: 'chauth-ka-barwara', nameHi: 'चौथ का बरवाड़ा', nameEn: 'Chauth Ka Barwara', pincodes: ['322701', '322702'] },
  { id: 'khandar', nameHi: 'खंडार', nameEn: 'Khandar', pincodes: ['322025', '322026'] },
  { id: 'malarna-doongar', nameHi: 'मलारना डूंगर', nameEn: 'Malarna Doongar', pincodes: ['322028', '322024'] },
  { id: 'wazirpur', nameHi: 'वजीरपुर', nameEn: 'Wazirpur', pincodes: ['322219', '322220'] },
];

export const EDUCATION_OPTIONS = [
  'निरक्षर / Uneducated',
  'प्राथमिक (1-5th)',
  'उच्च प्राथमिक (6-8th)',
  'माध्यमिक (10th / Secondary)',
  'उच्च माध्यमिक (12th / Senior Secondary)',
  'स्नातक (Graduate - BA/B.Sc/B.Com/B.Tech/Other)',
  'परास्नातक (Post-Graduate - MA/M.Sc/M.Com/MBA)',
  'आईटीआई / डिप्लोमा (ITI / Polytechnic Diploma)',
  'डॉक्टरेट / पीएचडी (PhD / Medical / Research)',
  'अन्य व्यावसायिक डिग्री (Professional/Other)'
];

export const OCCUPATION_OPTIONS = [
  'कृषि एवं पशुपालन (Agriculture & Farming)',
  'शिल्पकार / काष्ठकला / वास्तुकार (Artisan / Woodwork / Craft)',
  'व्यापार एवं वाणिज्य (Business / Shopkeeper / Trader)',
  'सरकारी सेवा (Government Service / Civil / Police / Defence)',
  'निजी सेवा (Private Sector Employee)',
  'स्व-रोजगार / कांट्रेक्टर (Self-Employed / Contractor)',
  'गृहणी (Homemaker)',
  'विद्यार्थी / प्रतियोगी परीक्षार्थी (Student)',
  'शिक्षक / प्राध्यापक (Teacher / Professor)',
  'इंजीनियर / सॉफ्टवेयर / तकनीकी (Engineer / Tech / IT)',
  'चिकित्सक / स्वास्थ्य सेवा (Doctor / Healthcare)',
  'अधिवक्ता / विधि सलाहकार (Advocate / Legal)',
  'सेवानिवृत्त (Retired Personnel)',
  'अन्य (Others)'
];

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export const INITIAL_NOTICES: DistrictNotice[] = [
  {
    id: 'not-1',
    title: 'सवाई माधोपुर जिला व्यापक जनसँख्या एवं परिवार सर्वेक्षण 2026 अभियान प्रारंभ',
    content: 'जिले के सभी 8 तहसीलों में प्रामाणिक जनसँख्या व सामाजिक डेटा संकलन हेतु पोर्टल सक्रिय किया गया है। सभी नागरिक एडमिन OTP सत्यापन के साथ फॉर्म भरें।',
    date: '2026-08-15',
    isUrgent: true
  },
  {
    id: 'not-2',
    title: 'चौथ का बरवाड़ा एवं खंडार ब्लॉक में विशेष जनगणना शिविर का आयोजन',
    content: 'ब्लॉक प्रभारियों द्वारा स्थानीय नागरिकों को पंजीकरण में सहायता हेतु निःशुल्क हेल्पडेस्क स्थापित की गई है।',
    date: '2026-08-17',
    isUrgent: false
  },
  {
    id: 'not-3',
    title: 'डिजिटल नागरिक प्रमाण पत्र (Census Card) तत्काल डाउनलोड सुविधा उपलब्ध',
    content: 'सफल पंजीकरण के उपरांत नागरिक अपना क्यूआर कोड युक्त आधिकारिक पहचान पत्र एवं परिवार विवरण प्रिंट कर सकते हैं।',
    date: '2026-08-18',
    isUrgent: false
  }
];

export const INITIAL_OTPS: AccessOtp[] = [
  {
    id: 'otp-demo-1',
    otpCode: '123456',
    generatedForName: 'मास्टर टेस्ट OTP (Master Demo OTP)',
    generatedForPhone: '9414000000',
    purpose: 'General Census',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
    isUsed: false,
    generatedBy: 'District Admin'
  },
  {
    id: 'otp-demo-2',
    otpCode: '789123',
    generatedForName: 'रमेश चंद्र शर्मा',
    generatedForPhone: '9829123456',
    purpose: 'New Registration',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    isUsed: false,
    generatedBy: 'District Admin'
  },
  {
    id: 'otp-demo-3',
    otpCode: '654321',
    generatedForName: 'राजेश जांगिड़',
    generatedForPhone: '9414012345',
    purpose: 'New Registration',
    createdAt: '2026-08-16T10:00:00Z',
    expiresAt: '2026-08-17T10:00:00Z',
    isUsed: true,
    usedAt: '2026-08-16T11:20:00Z',
    usedByRegNumber: 'SWM-2026-0001',
    generatedBy: 'District Admin'
  }
];

export const INITIAL_OTP_REQUESTS: OtpRequest[] = [
  {
    id: 'req-1',
    applicantName: 'दिनेश कुमार मीना',
    mobile: '9414123890',
    tehsil: 'सवाई माधोपुर',
    villageOrCity: 'मानटाउन, हाउसिंग बोर्ड',
    reason: 'नया परिवार जनगणना फॉर्म भरना है',
    requestedAt: '2026-08-18T08:30:00Z',
    status: 'Pending'
  },
  {
    id: 'req-2',
    applicantName: 'सुनीता देवी जांगिड़',
    mobile: '9828765432',
    tehsil: 'गंगापुर सिटी',
    villageOrCity: 'उदय मोड़, गंगापुर',
    reason: 'परिवार के 5 सदस्यों का नाम जोड़ना है',
    requestedAt: '2026-08-18T07:15:00Z',
    status: 'Pending'
  },
  {
    id: 'req-3',
    applicantName: 'राधेश्याम शर्मा',
    mobile: '9785123450',
    tehsil: 'बौंली',
    villageOrCity: 'ग्राम पंचायत मित्रपुरा',
    reason: 'नागरिक कार्ड हेतु डेटा प्रविष्टि',
    requestedAt: '2026-08-17T16:45:00Z',
    status: 'Approved',
    generatedOtp: '884920'
  }
];

export const INITIAL_CENSUS_RECORDS: CensusRecord[] = [
  {
    id: 'rec-1',
    regNumber: 'SWM-2026-0001',
    fullName: 'राजेश जांगिड़ (Rajesh Jangid)',
    fatherOrHusbandName: 'श्री रामेश्वर लाल जांगिड़',
    motherName: 'श्रीमती शांति देवी',
    gender: 'Male',
    dob: '1984-06-15',
    age: 42,
    maritalStatus: 'Married',
    bloodGroup: 'B+',
    mobile: '9414012345',
    whatsapp: '9414012345',
    email: 'rajesh.swm@example.com',
    aadharLast4: '4589',
    voterId: 'RJ/14/098/123456',
    district: 'Sawai Madhopur',
    tehsil: 'सवाई माधोपुर',
    areaType: 'Urban',
    gramPanchayatOrWard: 'वार्ड नं. 14, नगर परिषद',
    villageOrColony: 'मानटाउन, कलेक्ट्रेट के पास',
    houseNo: 'प्लॉट नं. 45-B',
    pincode: '322001',
    permanentAddress: 'मकान न. 45-B, मानटाउन, सवाई माधोपुर (राज.) 322001',
    nativePlace: 'सूरवाल, सवाई माधोपुर',
    education: 'स्नातक (Graduate - BA/B.Sc/B.Com/B.Tech/Other)',
    occupation: 'शिल्पकार / काष्ठकला / वास्तुकार (Artisan / Woodwork / Craft)',
    occupationDetails: 'मॉडर्न फर्नीचर एवं इंटीरियर वर्कशॉप संचालक',
    annualIncome: '₹ 5,00,000 - ₹ 8,00,000',
    totalFamilyCount: 4,
    familyMembers: [
      {
        id: 'fm-1',
        name: 'कविता जांगिड़',
        relation: 'पत्नी (Wife)',
        age: 38,
        gender: 'Female',
        education: 'उच्च माध्यमिक (12th)',
        occupation: 'गृहणी (Homemaker)',
        bloodGroup: 'B+'
      },
      {
        id: 'fm-2',
        name: 'गौरव जांगिड़',
        relation: 'पुत्र (Son)',
        age: 16,
        gender: 'Male',
        education: 'माध्यमिक (10th)',
        occupation: 'विद्यार्थी (Student)',
        bloodGroup: 'B+'
      },
      {
        id: 'fm-3',
        name: 'अंजलि जांगिड़',
        relation: 'पुत्री (Daughter)',
        age: 12,
        gender: 'Female',
        education: 'उच्च प्राथमिक (7th)',
        occupation: 'विद्यार्थी (Student)',
        bloodGroup: 'O+'
      }
    ],
    verifiedByOtp: '654321',
    status: 'Verified',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    registeredAt: '2026-08-16T11:20:00Z',
    notes: 'प्रमाणित मूल निवासी, सवाई माधोपुर'
  },
  {
    id: 'rec-2',
    regNumber: 'SWM-2026-0002',
    fullName: 'मुकेश कुमार शर्मा (Mukesh Sharma)',
    fatherOrHusbandName: 'श्री बद्री प्रसाद शर्मा',
    motherName: 'श्रीमती कमला देवी',
    gender: 'Male',
    dob: '1990-11-20',
    age: 35,
    maritalStatus: 'Married',
    bloodGroup: 'O+',
    mobile: '9829876540',
    whatsapp: '9829876540',
    email: 'mukesh.sharma@example.com',
    aadharLast4: '8712',
    voterId: 'RJ/14/099/654321',
    district: 'Sawai Madhopur',
    tehsil: 'गंगापुर सिटी',
    areaType: 'Urban',
    gramPanchayatOrWard: 'वार्ड नं. 22',
    villageOrColony: 'उदय मोड़, स्टेशन रोड',
    houseNo: 'H-102',
    pincode: '322201',
    permanentAddress: 'H-102, उदय मोड़, गंगापुर सिटी, सवाई माधोपुर',
    nativePlace: 'गंगापुर सिटी',
    education: 'परास्नातक (Post-Graduate - MA/M.Sc/M.Com/MBA)',
    occupation: 'शिक्षक / प्राध्यापक (Teacher / Professor)',
    occupationDetails: 'राजकीय उच्च माध्यमिक विद्यालय, वरिष्ठ अध्यापक',
    annualIncome: '₹ 8,00,000 - ₹ 12,00,000',
    totalFamilyCount: 3,
    familyMembers: [
      {
        id: 'fm-4',
        name: 'पूजा शर्मा',
        relation: 'पत्नी (Wife)',
        age: 32,
        gender: 'Female',
        education: 'स्नातक (B.Ed)',
        occupation: 'शिक्षक (Teacher)',
        bloodGroup: 'A+'
      },
      {
        id: 'fm-5',
        name: 'आरव शर्मा',
        relation: 'पुत्र (Son)',
        age: 6,
        gender: 'Male',
        education: 'प्राथमिक (1st)',
        occupation: 'विद्यार्थी (Student)',
        bloodGroup: 'O+'
      }
    ],
    verifiedByOtp: '884920',
    status: 'Verified',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    registeredAt: '2026-08-17T17:00:00Z',
    notes: 'सत्यापित'
  },
  {
    id: 'rec-3',
    regNumber: 'SWM-2026-0003',
    fullName: 'रामअवतार गुर्जर (Ramavtar Gurjar)',
    fatherOrHusbandName: 'श्री हरिनारायण गुर्जर',
    motherName: 'श्रीमती रामप्यारी देवी',
    gender: 'Male',
    dob: '1978-03-10',
    age: 48,
    maritalStatus: 'Married',
    bloodGroup: 'AB+',
    mobile: '9413234567',
    aadharLast4: '3341',
    district: 'Sawai Madhopur',
    tehsil: 'खंडार',
    areaType: 'Rural',
    gramPanchayatOrWard: 'ग्राम पंचायत बहरावंडा खुर्द',
    villageOrColony: 'ग्राम बहरावंडा खुर्द',
    houseNo: 'मकान नं. 12',
    pincode: '322026',
    permanentAddress: 'ग्राम बहरावंडा खुर्द, तहसील खंडार, सवाई माधोपुर',
    nativePlace: 'बहरावंडा खुर्द',
    education: 'माध्यमिक (10th / Secondary)',
    occupation: 'कृषि एवं पशुपालन (Agriculture & Farming)',
    occupationDetails: 'जैविक खेती एवं उन्नत डेयरी पालन',
    annualIncome: '₹ 4,00,000 - ₹ 6,00,000',
    totalFamilyCount: 5,
    familyMembers: [
      {
        id: 'fm-6',
        name: 'मुन्नी देवी',
        relation: 'पत्नी (Wife)',
        age: 44,
        gender: 'Female',
        education: 'प्राथमिक',
        occupation: 'कृषि व पशुपालन',
        bloodGroup: 'AB+'
      },
      {
        id: 'fm-7',
        name: 'संजय गुर्जर',
        relation: 'पुत्र (Son)',
        age: 22,
        gender: 'Male',
        education: 'स्नातक (B.Sc)',
        occupation: 'प्रतियोगी परीक्षार्थी',
        bloodGroup: 'B+'
      },
      {
        id: 'fm-8',
        name: 'अनीता गुर्जर',
        relation: 'पुत्री (Daughter)',
        age: 19,
        gender: 'Female',
        education: '12th Pass',
        occupation: 'कॉलेज छात्रा',
        bloodGroup: 'AB+'
      },
      {
        id: 'fm-9',
        name: 'हरिनारायण गुर्जर',
        relation: 'पिता (Father)',
        age: 76,
        gender: 'Male',
        education: 'निरक्षर',
        occupation: 'वरिष्ठ नागरिक',
        bloodGroup: 'O+'
      }
    ],
    verifiedByOtp: '992011',
    status: 'Verified',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
    registeredAt: '2026-08-17T14:10:00Z'
  },
  {
    id: 'rec-4',
    regNumber: 'SWM-2026-0004',
    fullName: 'ममता मीना (Mamta Meena)',
    fatherOrHusbandName: 'श्री राजेन्द्र प्रसाद मीना',
    motherName: 'श्रीमती गीता देवी',
    gender: 'Female',
    dob: '1995-08-25',
    age: 31,
    maritalStatus: 'Married',
    bloodGroup: 'A+',
    mobile: '9672345678',
    whatsapp: '9672345678',
    aadharLast4: '9082',
    district: 'Sawai Madhopur',
    tehsil: 'बामनवास',
    areaType: 'Rural',
    gramPanchayatOrWard: 'ग्राम पंचायत बाटोदा',
    villageOrColony: 'बाटोदा',
    houseNo: 'वार्ड 05, मकान 78',
    pincode: '322214',
    permanentAddress: 'ग्राम बाटोदा, तहसील बामनवास, जिला सवाई माधोपुर',
    nativePlace: 'बाटोदा',
    education: 'परास्नातक (Post-Graduate - MA/M.Sc/M.Com/MBA)',
    occupation: 'सरकारी सेवा (Government Service / Civil / Police / Defence)',
    occupationDetails: 'कनिष्ठ सहायक, राजस्व विभाग',
    annualIncome: '₹ 6,00,000 - ₹ 8,00,000',
    totalFamilyCount: 3,
    familyMembers: [
      {
        id: 'fm-10',
        name: 'राजेन्द्र प्रसाद मीना',
        relation: 'पति (Husband)',
        age: 34,
        gender: 'Male',
        education: 'स्नातक',
        occupation: 'निजी व्यवसाय',
        bloodGroup: 'A+'
      },
      {
        id: 'fm-11',
        name: 'रिया मीना',
        relation: 'पुत्री (Daughter)',
        age: 4,
        gender: 'Female',
        education: 'प्ले स्कूल',
        occupation: 'शिशु',
        bloodGroup: 'A+'
      }
    ],
    verifiedByOtp: '741258',
    status: 'Verified',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    registeredAt: '2026-08-18T09:00:00Z'
  },
  {
    id: 'rec-5',
    regNumber: 'SWM-2026-0005',
    fullName: 'सुरेश कुमार प्रजापत (Suresh Prajapat)',
    fatherOrHusbandName: 'श्री कल्याण सहाय प्रजापत',
    motherName: 'श्रीमती रुक्मिणी देवी',
    gender: 'Male',
    dob: '1987-12-05',
    age: 38,
    maritalStatus: 'Married',
    bloodGroup: 'O+',
    mobile: '9828456123',
    aadharLast4: '5561',
    district: 'Sawai Madhopur',
    tehsil: 'चौथ का बरवाड़ा',
    areaType: 'Rural',
    gramPanchayatOrWard: 'ग्राम चौथ का बरवाड़ा',
    villageOrColony: 'माताजी मंदिर के पास',
    houseNo: '34/2',
    pincode: '322701',
    permanentAddress: 'माताजी मंदिर रोड, चौथ का बरवाड़ा, सवाई माधोपुर',
    nativePlace: 'चौथ का बरवाड़ा',
    education: 'माध्यमिक (10th / Secondary)',
    occupation: 'व्यापार एवं वाणिज्य (Business / Shopkeeper / Trader)',
    occupationDetails: 'हस्तशिल्प व पूजा सामग्री भंडार',
    annualIncome: '₹ 4,00,000 - ₹ 6,00,000',
    totalFamilyCount: 4,
    familyMembers: [
      {
        id: 'fm-12',
        name: 'सुमन प्रजापत',
        relation: 'पत्नी (Wife)',
        age: 35,
        gender: 'Female',
        education: '10th Pass',
        occupation: 'गृहणी',
        bloodGroup: 'O+'
      },
      {
        id: 'fm-13',
        name: 'हर्षित प्रजापत',
        relation: 'पुत्र (Son)',
        age: 14,
        gender: 'Male',
        education: '8th Standard',
        occupation: 'विद्यार्थी',
        bloodGroup: 'O+'
      },
      {
        id: 'fm-14',
        name: 'दीक्षा प्रजापत',
        relation: 'पुत्री (Daughter)',
        age: 10,
        gender: 'Female',
        education: '5th Standard',
        occupation: 'विद्यार्थी',
        bloodGroup: 'B+'
      }
    ],
    verifiedByOtp: '523698',
    status: 'Verified',
    registeredAt: '2026-08-18T09:15:00Z'
  }
];
