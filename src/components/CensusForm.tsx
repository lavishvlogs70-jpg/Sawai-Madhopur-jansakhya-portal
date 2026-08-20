import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { AccessOtp, CensusRecord, FamilyMember } from '../types/census';
import { CensusStorageService } from '../services/censusStorage';
import {
  TEHSILS_OF_SAWAI_MADHOPUR,
  EDUCATION_OPTIONS,
  OCCUPATION_OPTIONS,
  BLOOD_GROUPS
} from '../data/initialData';
import {
  User,
  MapPin,
  GraduationCap,
  Users,
  Plus,
  Trash2,
  CheckCircle2,
  Shield,
  KeyRound,
  FileCheck,
  Calendar,
  Phone,
  Home,
  Briefcase,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

interface CensusFormProps {
  verifiedOtp: AccessOtp;
  editingRecord?: CensusRecord | null;
  onSuccess: (record: CensusRecord) => void;
  onCancel: () => void;
}

export const CensusForm: React.FC<CensusFormProps> = ({
  verifiedOtp,
  editingRecord,
  onSuccess,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [declarationChecked, setDeclarationChecked] = useState(false);

  // Form State - Personal Info
  const [fullName, setFullName] = useState(
    editingRecord?.fullName ||
      (verifiedOtp.generatedForName && verifiedOtp.generatedForName !== 'नागरिक (Citizen)'
        ? verifiedOtp.generatedForName
        : '')
  );
  const [fatherOrHusbandName, setFatherOrHusbandName] = useState(editingRecord?.fatherOrHusbandName || '');
  const [motherName, setMotherName] = useState(editingRecord?.motherName || '');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>(editingRecord?.gender || 'Male');
  const [dob, setDob] = useState(editingRecord?.dob || '1990-01-01');
  const [age, setAge] = useState<number>(editingRecord?.age || 36);
  const [maritalStatus, setMaritalStatus] = useState<'Married' | 'Unmarried' | 'Widowed' | 'Divorced'>(
    editingRecord?.maritalStatus || 'Married'
  );
  const [bloodGroup, setBloodGroup] = useState(editingRecord?.bloodGroup || 'B+');
  const [mobile, setMobile] = useState(editingRecord?.mobile || verifiedOtp.generatedForPhone || '');
  const [whatsapp, setWhatsapp] = useState(editingRecord?.whatsapp || verifiedOtp.generatedForPhone || '');
  const [email, setEmail] = useState(editingRecord?.email || '');
  const [photoUrl, setPhotoUrl] = useState(editingRecord?.photoUrl || '');

  // Address
  const [tehsil, setTehsil] = useState(editingRecord?.tehsil || 'सवाई माधोपुर');
  const [areaType, setAreaType] = useState<'Rural' | 'Urban'>(editingRecord?.areaType || 'Rural');
  const [gramPanchayatOrWard, setGramPanchayatOrWard] = useState(editingRecord?.gramPanchayatOrWard || '');
  const [villageOrColony, setVillageOrColony] = useState(editingRecord?.villageOrColony || '');
  const [houseNo, setHouseNo] = useState(editingRecord?.houseNo || '');
  const [pincode, setPincode] = useState(editingRecord?.pincode || '322001');
  const [permanentAddress, setPermanentAddress] = useState(editingRecord?.permanentAddress || '');
  const [nativePlace, setNativePlace] = useState(editingRecord?.nativePlace || '');

  // Socio-Economic
  const [education, setEducation] = useState(editingRecord?.education || EDUCATION_OPTIONS[5]);
  const [occupation, setOccupation] = useState(editingRecord?.occupation || OCCUPATION_OPTIONS[0]);
  const [occupationDetails, setOccupationDetails] = useState(editingRecord?.occupationDetails || '');
  const [annualIncome, setAnnualIncome] = useState(editingRecord?.annualIncome || '₹ 3,00,000 - ₹ 5,00,000');

  // Family Members
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(editingRecord?.familyMembers || []);

  const [newMember, setNewMember] = useState<Partial<FamilyMember>>({
    name: '',
    relation: 'पत्नी (Wife)',
    age: 30,
    gender: 'Female',
    education: 'माध्यमिक (10th / Secondary)',
    occupation: 'गृहणी (Homemaker)',
    bloodGroup: 'B+'
  });

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDob(val);
    if (val) {
      const birthYear = new Date(val).getFullYear();
      const thisYear = new Date().getFullYear();
      if (birthYear > 1900 && birthYear <= thisYear) {
        setAge(thisYear - birthYear);
      }
    }
  };

  const handleAddFamilyMember = () => {
    if (!newMember.name?.trim()) {
      alert('कृपया सदस्य का नाम दर्ज करें।');
      return;
    }

    const member: FamilyMember = {
      id: `fm-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: newMember.name.trim(),
      relation: newMember.relation || 'सदस्य',
      age: Number(newMember.age) || 18,
      gender: newMember.gender || 'Male',
      education: newMember.education || 'माध्यमिक (10th)',
      occupation: newMember.occupation || 'अन्य',
      bloodGroup: newMember.bloodGroup || 'B+'
    };

    setFamilyMembers([...familyMembers, member]);
    setNewMember({
      name: '',
      relation: 'पुत्र (Son)',
      age: 12,
      gender: 'Male',
      education: 'माध्यमिक (10th / Secondary)',
      occupation: 'विद्यार्थी (Student)',
      bloodGroup: 'B+'
    });
  };

  const handleRemoveMember = (id: string) => {
    setFamilyMembers(familyMembers.filter(m => m.id !== id));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('फ़ोटो का आकार 3MB से कम होना चाहिए।');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      if (!fullName.trim()) {
        alert('कृपया मुखिया का पूरा नाम दर्ज करें।');
        return false;
      }
      if (!fatherOrHusbandName.trim()) {
        alert('कृपया पिता/पति का नाम दर्ज करें।');
        return false;
      }
      if (!mobile.trim() || mobile.length < 10) {
        alert('कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।');
        return false;
      }
    } else if (step === 2) {
      if (!villageOrColony.trim()) {
        alert('कृपया गाँव / मोहल्ला / कॉलोनी का नाम दर्ज करें।');
        return false;
      }
      if (!gramPanchayatOrWard.trim()) {
        alert('कृपया ग्राम पंचायत या वार्ड नंबर दर्ज करें।');
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!declarationChecked) {
      alert('कृपया घोषणा पत्र (Declaration) को स्वीकार करें।');
      return;
    }

    setIsSubmitting(true);

    try {
      const recordPayload = {
        fullName: fullName.trim(),
        fatherOrHusbandName: fatherOrHusbandName.trim(),
        motherName: motherName.trim() || undefined,
        gender,
        dob,
        age: Number(age),
        maritalStatus,
        bloodGroup,
        mobile: mobile.trim(),
        whatsapp: whatsapp.trim() || mobile.trim(),
        email: email.trim() || undefined,
        district: 'Sawai Madhopur' as const,
        tehsil,
        areaType,
        gramPanchayatOrWard: gramPanchayatOrWard.trim(),
        villageOrColony: villageOrColony.trim(),
        houseNo: houseNo.trim() || 'N/A',
        pincode: pincode.trim(),
        permanentAddress: permanentAddress.trim() || `${villageOrColony}, तहसील ${tehsil}, सवाई माधोपुर`,
        nativePlace: nativePlace.trim() || villageOrColony.trim(),
        education,
        occupation,
        occupationDetails: occupationDetails.trim() || undefined,
        annualIncome,
        familyMembers,
        totalFamilyCount: familyMembers.length + 1,
        verifiedByOtp: verifiedOtp.otpCode,
        status: 'Verified' as const,
        photoUrl: photoUrl || undefined
      };

      let resultRecord: CensusRecord;

      if (editingRecord) {
        const updated = CensusStorageService.updateRecord(editingRecord.id, recordPayload);
        resultRecord = updated || CensusStorageService.addRecord(recordPayload);
      } else {
        resultRecord = CensusStorageService.addRecord(recordPayload);
      }

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setIsSubmitting(false);
      onSuccess(resultRecord);
    } catch (err) {
      console.error(err);
      alert('फॉर्म सबमिट करने में कोई त्रुटि हुई।');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-8 px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Top Header - Clean Slate-800 */}
        <div className="bg-slate-800 p-6 md:p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-slate-700/60 px-3 py-1 rounded-full text-xs font-semibold text-emerald-400 border border-slate-600 mb-2">
                <Shield className="w-3.5 h-3.5" /> सवाई माधोपुर डिजिटल जनगणना पोर्टल
              </div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                {editingRecord ? 'नागरिक रिकॉर्ड संशोधन फॉर्म' : 'Census Registration Form (जनगणना पंजीकरण)'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter your family details below. Admin verified OTP session active.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-3 text-right">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                Admin Verified OTP
              </div>
              <div className="text-xl font-mono font-bold text-emerald-400 flex items-center justify-end gap-1.5 mt-0.5">
                <KeyRound className="w-4 h-4 text-emerald-400" />
                {verifiedOtp.otpCode}
              </div>
              <div className="text-[10px] text-slate-500">Authorized Access Code</div>
            </div>
          </div>

          {/* Clean Stepper */}
          <div className="grid grid-cols-4 gap-2 mt-6 pt-4 border-t border-slate-700 text-xs">
            {[
              { step: 1, title: 'व्यक्तिगत विवरण', icon: User },
              { step: 2, title: 'निवास व पता', icon: MapPin },
              { step: 3, title: 'शिक्षा व व्यवसाय', icon: GraduationCap },
              { step: 4, title: 'परिवार व सत्यापन', icon: Users }
            ].map(s => {
              const Icon = s.icon;
              const isActive = currentStep === s.step;
              const isDone = currentStep > s.step;
              return (
                <button
                  type="button"
                  key={s.step}
                  onClick={() => {
                    if (isDone) setCurrentStep(s.step);
                  }}
                  className={`flex items-center gap-2 p-2 rounded-lg text-left transition-all ${
                    isActive
                      ? 'bg-emerald-700 text-white font-bold'
                      : isDone
                      ? 'bg-slate-700 text-slate-200 font-medium'
                      : 'bg-slate-900/50 text-slate-500'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      isActive ? 'bg-white text-emerald-800' : isDone ? 'bg-emerald-500 text-white' : 'bg-slate-700'
                    }`}
                  >
                    {isDone ? '✓' : s.step}
                  </div>
                  <span className="hidden sm:inline text-xs truncate">{s.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          {/* STEP 1: Personal Details (Aadhar and Voter ID Removed as requested) */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-700" />
                  चरण 1: मुखिया की व्यक्तिगत जानकारी (Personal Information)
                </h3>
                <span className="text-xs text-red-500 font-medium">* आवश्यक विवरण</span>
              </div>

              {/* Photo Upload Box */}
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="w-20 h-24 rounded-lg bg-white border border-slate-300 overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                  {photoUrl ? (
                    <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-slate-400 p-2">
                      <User className="w-7 h-7 mx-auto text-slate-300" />
                      <span className="text-[9px] block text-slate-400">फोटो</span>
                    </div>
                  )}
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    पासपोर्ट साइज फोटो (Passport Photo - ऐच्छिक)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-800 hover:file:bg-slate-300 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-400">JPG/PNG अधिकतम 3MB</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    मुखिया का पूरा नाम (Full Name) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. राजेश कुमार जांगिड़"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    पिता / पति का नाम (Father's/Husband's Name) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. श्री रामेश्वर लाल"
                    value={fatherOrHusbandName}
                    onChange={e => setFatherOrHusbandName(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    माता का नाम (Mother's Name)
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. श्रीमती शांति देवी"
                    value={motherName}
                    onChange={e => setMotherName(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    लिंग (Gender) *
                  </label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value as any)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  >
                    <option value="Male">पुरुष (Male)</option>
                    <option value="Female">महिला (Female)</option>
                    <option value="Other">अन्य (Other)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    जन्म तिथि (Date of Birth) *
                  </label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={handleDobChange}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    आयु (Age in Years) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    required
                    value={age}
                    onChange={e => setAge(Number(e.target.value))}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    वैवाहिक स्थिति (Marital Status) *
                  </label>
                  <select
                    value={maritalStatus}
                    onChange={e => setMaritalStatus(e.target.value as any)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  >
                    <option value="Married">विवाहित (Married)</option>
                    <option value="Unmarried">अविवाहित (Unmarried)</option>
                    <option value="Widowed">विधवा / विधुर (Widowed)</option>
                    <option value="Divorced">तलाकशुदा (Divorced)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    रक्त समूह (Blood Group)
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={e => setBloodGroup(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white font-medium"
                  >
                    {BLOOD_GROUPS.map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                    <option value="Unknown">जानकारी नहीं (Unknown)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    मोबाइल नंबर (Mobile Number) *
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    required
                    placeholder="94140XXXXX"
                    value={mobile}
                    onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    व्हाट्सएप नंबर (WhatsApp Number)
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="व्हाट्सएप नंबर"
                    value={whatsapp}
                    onChange={e => setWhatsapp(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    ईमेल आईडी (Email ID - ऐच्छिक)
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Address */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  चरण 2: सवाई माधोपुर जिला निवास एवं पता (Address Details)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">जिला (District)</label>
                  <input
                    type="text"
                    readOnly
                    value="सवाई माधोपुर (Sawai Madhopur, Rajasthan)"
                    className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm font-bold text-slate-800"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">तहसील / ब्लॉक (Tehsil) *</label>
                  <select
                    value={tehsil}
                    onChange={e => {
                      const selected = e.target.value;
                      setTehsil(selected);
                      const found = TEHSILS_OF_SAWAI_MADHOPUR.find(t => t.nameHi === selected);
                      if (found && found.pincodes.length > 0) {
                        setPincode(found.pincodes[0]);
                      }
                    }}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  >
                    {TEHSILS_OF_SAWAI_MADHOPUR.map(t => (
                      <option key={t.id} value={t.nameHi}>
                        {t.nameHi} ({t.nameEn})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">क्षेत्र प्रकार (Area Type) *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setAreaType('Rural')}
                      className={`py-2 px-3 rounded-lg border text-xs font-bold transition ${
                        areaType === 'Rural'
                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      🌾 ग्रामीण (Rural)
                    </button>
                    <button
                      type="button"
                      onClick={() => setAreaType('Urban')}
                      className={`py-2 px-3 rounded-lg border text-xs font-bold transition ${
                        areaType === 'Urban'
                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      🏢 शहरी (Urban)
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    {areaType === 'Rural' ? 'ग्राम पंचायत का नाम (Gram Panchayat)' : 'वार्ड नंबर (Ward No)'} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={areaType === 'Rural' ? 'उदा. ग्राम पंचायत सूरवाल' : 'उदा. वार्ड नं. 14, मानटाउन'}
                    value={gramPanchayatOrWard}
                    onChange={e => setGramPanchayatOrWard(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    गाँव / मोहल्ला / कॉलोनी *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. हाउसिंग बोर्ड, सूरवाल"
                    value={villageOrColony}
                    onChange={e => setVillageOrColony(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    मकान संख्या / लैंडमार्क
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. प्लॉट नं. 45-B"
                    value={houseNo}
                    onChange={e => setHouseNo(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">पिन कोड (Pincode) *</label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={pincode}
                    onChange={e => setPincode(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">मूल पैतृक स्थान (Native Place)</label>
                  <input
                    type="text"
                    placeholder="उदा. सूरवाल, चौथ का बरवाड़ा"
                    value={nativePlace}
                    onChange={e => setNativePlace(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">पूर्ण स्थाई पता (Full Address)</label>
                  <textarea
                    rows={2}
                    placeholder="मकान संख्या, मोहल्ला, तहसील, जिला सवाई माधोपुर"
                    value={permanentAddress}
                    onChange={e => setPermanentAddress(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Education & Occupation */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-emerald-700" />
                  चरण 3: शिक्षा एवं व्यवसाय विवरण (Education & Occupation)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">उच्चतम शैक्षणिक योग्यता *</label>
                  <select
                    value={education}
                    onChange={e => setEducation(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  >
                    {EDUCATION_OPTIONS.map(ed => (
                      <option key={ed} value={ed}>{ed}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">मुख्य व्यवसाय / आजीविका *</label>
                  <select
                    value={occupation}
                    onChange={e => setOccupation(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white font-semibold text-slate-800"
                  >
                    {OCCUPATION_OPTIONS.map(occ => (
                      <option key={occ} value={occ}>{occ}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">व्यवसाय विवरण / पदनाम</label>
                  <input
                    type="text"
                    placeholder="उदा. अध्यापक राजकीय विद्यालय / फर्नीचर वर्कशॉप"
                    value={occupationDetails}
                    onChange={e => setOccupationDetails(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">वार्षिक पारिवारिक आय</label>
                  <select
                    value={annualIncome}
                    onChange={e => setAnnualIncome(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  >
                    <option value="₹ 1,00,000 से कम">₹ 1,00,000 से कम (Below 1 Lakh)</option>
                    <option value="₹ 1,00,000 - ₹ 3,00,000">₹ 1,00,000 - ₹ 3,00,000</option>
                    <option value="₹ 3,00,000 - ₹ 5,00,000">₹ 3,00,000 - ₹ 5,00,000</option>
                    <option value="₹ 5,00,000 - ₹ 8,00,000">₹ 5,00,000 - ₹ 8,00,000</option>
                    <option value="₹ 8,00,000 - ₹ 15,00,000">₹ 8,00,000 - ₹ 15,00,000</option>
                    <option value="₹ 15,00,000 से अधिक">₹ 15,00,000 से अधिक (Above 15 Lakh)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Family Members & Declaration */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-700" />
                  चरण 4: परिवार के अन्य सदस्य एवं स्व-घोषणा
                </h3>
                <span className="text-xs bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-md font-bold">
                  कुल सदस्य: {familyMembers.length + 1}
                </span>
              </div>

              {/* Added Family Members */}
              {familyMembers.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">दर्ज परिवार सदस्य:</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {familyMembers.map((member, index) => (
                      <div
                        key={member.id}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between gap-2"
                      >
                        <div className="text-xs space-y-0.5">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{index + 1}. {member.name}</span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-semibold">
                              {member.relation}
                            </span>
                          </div>
                          <div className="text-slate-600 text-[11px]">
                            आयु: {member.age} वर्ष • {member.gender === 'Male' ? 'पुरुष' : 'महिला'} • रक्त: {member.bloodGroup || 'N/A'}
                          </div>
                          <div className="text-slate-400 text-[10px]">
                            शिक्षा: {member.education.split('(')[0]} • कार्य: {member.occupation.split('(')[0]}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(member.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded transition"
                          title="हटाएं"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Family Member Box */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-emerald-700" />
                  + नया परिवार सदस्य जोड़ें (Add Family Member)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">नाम *</label>
                    <input
                      type="text"
                      placeholder="उदा. कविता जांगिड़"
                      value={newMember.name || ''}
                      onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">संबंध *</label>
                    <select
                      value={newMember.relation || 'पत्नी (Wife)'}
                      onChange={e => setNewMember({ ...newMember, relation: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
                    >
                      <option value="पत्नी (Wife)">पत्नी (Wife)</option>
                      <option value="पति (Husband)">पति (Husband)</option>
                      <option value="पुत्र (Son)">पुत्र (Son)</option>
                      <option value="पुत्री (Daughter)">पुत्री (Daughter)</option>
                      <option value="पिता (Father)">पिता (Father)</option>
                      <option value="माता (Mother)">माता (Mother)</option>
                      <option value="भाई (Brother)">भाई (Brother)</option>
                      <option value="बहन (Sister)">बहन (Sister)</option>
                      <option value="पुत्रवधू (Daughter-in-law)">पुत्रवधू (Daughter-in-law)</option>
                      <option value="पोता / पोती (Grandchild)">पोता / पोती (Grandchild)</option>
                      <option value="अन्य संबंधी (Other)">अन्य संबंधी (Other)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">आयु (वर्ष)</label>
                    <input
                      type="number"
                      min={0}
                      max={120}
                      value={newMember.age || ''}
                      onChange={e => setNewMember({ ...newMember, age: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">लिंग</label>
                    <select
                      value={newMember.gender || 'Female'}
                      onChange={e => setNewMember({ ...newMember, gender: e.target.value as any })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
                    >
                      <option value="Male">पुरुष (Male)</option>
                      <option value="Female">महिला (Female)</option>
                      <option value="Other">अन्य (Other)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">शिक्षा</label>
                    <select
                      value={newMember.education || 'माध्यमिक (10th / Secondary)'}
                      onChange={e => setNewMember({ ...newMember, education: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
                    >
                      {EDUCATION_OPTIONS.map(ed => (
                        <option key={ed} value={ed}>{ed.split('(')[0]}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">व्यवसाय</label>
                    <select
                      value={newMember.occupation || 'गृहणी (Homemaker)'}
                      onChange={e => setNewMember({ ...newMember, occupation: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
                    >
                      {OCCUPATION_OPTIONS.map(occ => (
                        <option key={occ} value={occ}>{occ.split('(')[0]}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddFamilyMember}
                  className="mt-2 py-2 px-4 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  इस सदस्य को जोड़ें
                </button>
              </div>

              {/* Declaration */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2">
                <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5 uppercase tracking-wider">
                  <FileCheck className="w-4 h-4 text-emerald-700" />
                  स्व-घोषणा पत्र (Self-Declaration)
                </h4>
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700">
                  <input
                    type="checkbox"
                    required
                    checked={declarationChecked}
                    onChange={e => setDeclarationChecked(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-emerald-700 rounded focus:ring-emerald-500"
                  />
                  <span>
                    मैं प्रमाणित करता/करती हूँ कि मेरे द्वारा सवाई माधोपुर जिला जनसँख्या पोर्टल पर दी गई सभी सूचनाएं, नाम, आयु, पता एवं परिवार के सदस्यों का विवरण पूर्णतः सत्य व सही है।
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Navigation Buttons matching Clean Minimalism layout */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-5 py-2.5 border border-slate-200 text-slate-600 font-semibold text-xs rounded-xl hover:bg-slate-50 transition flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Back (पिछला चरण)
              </button>
            ) : (
              <button
                type="button"
                onClick={onCancel}
                className="px-5 py-2.5 border border-slate-200 text-slate-500 font-semibold text-xs rounded-xl hover:bg-slate-50 transition cursor-pointer"
              >
                रद्द करें
              </button>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2.5 bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-100 hover:bg-emerald-800 transition-colors flex items-center gap-1 cursor-pointer"
              >
                Next Step (अगला चरण) <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || !declarationChecked}
                className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm shadow-lg transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                  declarationChecked
                    ? 'bg-emerald-700 text-white shadow-emerald-100 hover:bg-emerald-800'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                {isSubmitting ? 'डेटा सुरक्षित हो रहा है...' : 'Submit Information (फाइनल सबमिट करें)'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
