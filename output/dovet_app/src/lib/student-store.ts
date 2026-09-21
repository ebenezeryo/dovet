import { useState, useEffect } from "react";
import type { StudentRecord } from "./types";
import { calculateAgeBySept } from "./types";

const STORAGE_KEY = "dovet_students_records_v1";
const EVENT_NAME = "dovet_students_updated";

export const INITIAL_STUDENTS: StudentRecord[] = [
  {
    id: "student-001",
    admissionNumber: "2026/SEC/001",
    surname: "Sterling",
    middleName: "Alexander",
    firstName: "Jack",
    fullName: "Jack Alexander Sterling",
    currentClass: "Year 7A",
    currentTerm: "1st Term",
    currentYear: "2025/2026",
    dateOfBirth: "14/05/2013",
    ageBySept: 12,
    gender: "Male",
    stateOfOrigin: "Lagos State",
    nationality: "Nigerian",
    lastSchoolAttended: "Corona Primary School, Victoria Island",
    healthInfo: "Mild peanut allergy. Carries inhaler for seasonal asthma.",
    religion: "Christianity",
    parentName: "Mr. & Mrs. Sterling",
    parentContactAddress: "14 Admiralty Way, Lekki Phase 1, Lagos",
    parentPrimaryPhone: "+234 802 345 6789",
    alternativePhone: "+234 809 876 5432",
    parentMaritalStatus: "Married",
    familyHospitalAddress: "Reddington Hospital, Victoria Island, Lagos",
    placeOfWorship: "City of David RCCG, Victoria Island",
    house: "Red House (Phoenix)",
    parentPrimaryEmail: "sterling.parents@gmail.com",
    fatherName: "David Sterling",
    fatherPhone: "+234 802 345 6789",
    fatherEmail: "david.sterling@acmecorp.ng",
    fatherPlaceOfWork: "Sterling Maritime & Logistics Ltd",
    fatherContactAddress: "14 Admiralty Way, Lekki Phase 1, Lagos",
    motherName: "Grace Sterling",
    motherPhone: "+234 809 876 5432",
    motherEmail: "grace.sterling@medhealth.ng",
    motherPlaceOfWork: "First Cardiology Consultants",
    motherContactAddress: "14 Admiralty Way, Lekki Phase 1, Lagos",
    avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    enrolledAt: "01/09/2025",
    status: "Active",
  },
  {
    id: "student-002",
    admissionNumber: "2026/SEC/002",
    surname: "Diallo",
    middleName: "Fatoumata",
    firstName: "Amara",
    fullName: "Amara Fatoumata Diallo",
    currentClass: "Year 7A",
    currentTerm: "1st Term",
    currentYear: "2025/2026",
    dateOfBirth: "22/11/2012",
    ageBySept: 12,
    gender: "Female",
    stateOfOrigin: "Ogun State",
    nationality: "Nigerian",
    lastSchoolAttended: "Grange Junior School, Ikeja",
    healthInfo: "No known chronic conditions or drug allergies. Blood Group: O+",
    religion: "Islam",
    parentName: "Alhaji Ibrahim Diallo",
    parentContactAddress: "8 Bourdillon Road, Ikoyi, Lagos",
    parentPrimaryPhone: "+234 803 111 2233",
    alternativePhone: "+234 805 444 5566",
    parentMaritalStatus: "Married",
    familyHospitalAddress: "Lagoon Hospital, Ikoyi, Lagos",
    placeOfWorship: "Ikoyi Central Mosque",
    house: "Green House (Emerald)",
    parentPrimaryEmail: "diallo.family@gmail.com",
    fatherName: "Ibrahim Diallo",
    fatherPhone: "+234 803 111 2233",
    fatherEmail: "ibrahim@dialloholding.com",
    fatherPlaceOfWork: "Diallo Group West Africa",
    fatherContactAddress: "8 Bourdillon Road, Ikoyi, Lagos",
    motherName: "Amina Diallo",
    motherPhone: "+234 805 444 5566",
    motherEmail: "amina@dialloholding.com",
    motherPlaceOfWork: "Apex Capital Partners",
    motherContactAddress: "8 Bourdillon Road, Ikoyi, Lagos",
    avatarUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80",
    enrolledAt: "01/09/2025",
    status: "Active",
  },
  {
    id: "student-003",
    admissionNumber: "2026/SEC/003",
    surname: "Okonkwo",
    middleName: "Chukwudi",
    firstName: "Liam",
    fullName: "Liam Chukwudi Okonkwo",
    currentClass: "Year 8B",
    currentTerm: "1st Term",
    currentYear: "2025/2026",
    dateOfBirth: "05/03/2012",
    ageBySept: 13,
    gender: "Male",
    stateOfOrigin: "Anambra State",
    nationality: "Nigerian",
    lastSchoolAttended: "St. Saviours School, Ebute Metta",
    healthInfo: "Asthmatic. Requires Ventolin inhaler during physical education.",
    religion: "Christianity",
    parentName: "Barrister & Mrs. Okonkwo",
    parentContactAddress: "25 Glover Road, Ikoyi, Lagos",
    parentPrimaryPhone: "+234 806 777 8899",
    alternativePhone: "+234 812 333 4455",
    parentMaritalStatus: "Married",
    familyHospitalAddress: "St. Nicholas Hospital, Lagos Island",
    placeOfWorship: "St. Charles Borromeo Catholic Church, 1004 Estate",
    house: "Blue House (Triton)",
    parentPrimaryEmail: "okonkwo.legal@yahoo.com",
    fatherName: "Obinna Okonkwo",
    fatherPhone: "+234 806 777 8899",
    fatherEmail: "obinna@okonkwoandco.ng",
    fatherPlaceOfWork: "Okonkwo & Associates Legal Chambers",
    fatherContactAddress: "25 Glover Road, Ikoyi, Lagos",
    motherName: "Ngozi Okonkwo",
    motherPhone: "+234 812 333 4455",
    motherEmail: "ngozi.okonkwo@pwc.com",
    motherPlaceOfWork: "PwC Nigeria",
    motherContactAddress: "25 Glover Road, Ikoyi, Lagos",
    avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    enrolledAt: "01/09/2024",
    status: "Active",
  },
  {
    id: "student-004",
    admissionNumber: "2026/SEC/004",
    surname: "Reyes",
    middleName: "Elena",
    firstName: "Sofia",
    fullName: "Sofia Elena Reyes",
    currentClass: "Year 7B",
    currentTerm: "1st Term",
    currentYear: "2025/2026",
    dateOfBirth: "19/08/2013",
    ageBySept: 12,
    gender: "Female",
    stateOfOrigin: "Madrid / Expatriate",
    nationality: "Spanish",
    lastSchoolAttended: "International School of Madrid",
    healthInfo: "No known health conditions. Wears corrective glasses for reading.",
    religion: "Christianity",
    parentName: "Carlos & Maria Reyes",
    parentContactAddress: "Flat 4B, Bella Vista Towers, Banana Island, Lagos",
    parentPrimaryPhone: "+234 818 999 0011",
    alternativePhone: "+34 612 345 678",
    parentMaritalStatus: "Married",
    familyHospitalAddress: "Euracare Multi-Specialist Hospital, Victoria Island",
    placeOfWorship: "Our Lady of Perpetual Help, Victoria Island",
    house: "Yellow House (Solaris)",
    parentPrimaryEmail: "reyes.carlos@repsol.com",
    fatherName: "Carlos Reyes",
    fatherPhone: "+234 818 999 0011",
    fatherEmail: "carlos.reyes@repsol.com",
    fatherPlaceOfWork: "Repsol West Africa Energy Ltd",
    fatherContactAddress: "Bella Vista Towers, Banana Island, Lagos",
    motherName: "Maria Reyes",
    motherPhone: "+34 612 345 678",
    motherEmail: "maria.reyes@cervantes.es",
    motherPlaceOfWork: "Instituto Cervantes Cultural Outreach",
    motherContactAddress: "Bella Vista Towers, Banana Island, Lagos",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    enrolledAt: "01/09/2025",
    status: "Active",
  },
  {
    id: "student-005",
    admissionNumber: "2026/SEC/005",
    surname: "Kimura",
    middleName: "Kenji",
    firstName: "Ethan",
    fullName: "Ethan Kenji Kimura",
    currentClass: "Year 9A",
    currentTerm: "1st Term",
    currentYear: "2025/2026",
    dateOfBirth: "30/01/2011",
    ageBySept: 14,
    gender: "Male",
    stateOfOrigin: "Tokyo / Expatriate",
    nationality: "Japanese",
    lastSchoolAttended: "Tokyo International Academy",
    healthInfo: "Lactose intolerant. Requires dairy-free meals during school lunch.",
    religion: "Other / Not specified",
    parentName: "Hiroshi Kimura",
    parentContactAddress: "12 Osborne Foreshore Estate, Ikoyi, Lagos",
    parentPrimaryPhone: "+234 807 555 6677",
    alternativePhone: "+81 90 1234 5678",
    parentMaritalStatus: "Married",
    familyHospitalAddress: "The Premier Specialists Medical Centre, VI",
    placeOfWorship: "Not specified",
    house: "Purple House (Eagle)",
    parentPrimaryEmail: "h.kimura@toyotatsusho.com",
    fatherName: "Hiroshi Kimura",
    fatherPhone: "+234 807 555 6677",
    fatherEmail: "h.kimura@toyotatsusho.com",
    fatherPlaceOfWork: "Toyota Tsusho Corporation Nigeria",
    fatherContactAddress: "12 Osborne Foreshore Estate, Ikoyi, Lagos",
    motherName: "Yuki Kimura",
    motherPhone: "+81 90 1234 5678",
    motherEmail: "yuki.kimura@gmail.com",
    motherPlaceOfWork: "Self-employed Interior Architect",
    motherContactAddress: "12 Osborne Foreshore Estate, Ikoyi, Lagos",
    avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
    enrolledAt: "01/09/2023",
    status: "Active",
  },
  {
    id: "student-006",
    admissionNumber: "2026/SEC/006",
    surname: "Al-Hassan",
    middleName: "Zainab",
    firstName: "Fatima",
    fullName: "Fatima Zainab Al-Hassan",
    currentClass: "Year 8A",
    currentTerm: "1st Term",
    currentYear: "2025/2026",
    dateOfBirth: "10/10/2012",
    ageBySept: 12,
    gender: "Female",
    stateOfOrigin: "Kano State",
    nationality: "Nigerian",
    lastSchoolAttended: "Kabara International Academy, Kano",
    healthInfo: "No known health conditions. Genotype: AA, Blood Group: A+",
    religion: "Islam",
    parentName: "Dr. Mansur Al-Hassan",
    parentContactAddress: "19 Cooper Road, Ikoyi, Lagos",
    parentPrimaryPhone: "+234 803 888 9900",
    alternativePhone: "+234 802 444 1122",
    parentMaritalStatus: "Married",
    familyHospitalAddress: "Gold Cross Hospital, Ikoyi, Lagos",
    placeOfWorship: "Falomo Central Mosque, Ikoyi",
    house: "Red House (Phoenix)",
    parentPrimaryEmail: "mansur.alhassan@unicef.org",
    fatherName: "Dr. Mansur Al-Hassan",
    fatherPhone: "+234 803 888 9900",
    fatherEmail: "mansur.alhassan@unicef.org",
    fatherPlaceOfWork: "UNICEF West Africa Regional Office",
    fatherContactAddress: "19 Cooper Road, Ikoyi, Lagos",
    motherName: "Dr. Halima Al-Hassan",
    motherPhone: "+234 802 444 1122",
    motherEmail: "halima.alhassan@luth.edu.ng",
    motherPlaceOfWork: "Lagos University Teaching Hospital",
    motherContactAddress: "19 Cooper Road, Ikoyi, Lagos",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    enrolledAt: "01/09/2024",
    status: "Active",
  },
  {
    id: "student-007",
    admissionNumber: "2026/SEC/007",
    surname: "Webb",
    middleName: "Thomas",
    firstName: "Marcus",
    fullName: "Marcus Thomas Webb",
    currentClass: "Year 9B",
    currentTerm: "1st Term",
    currentYear: "2025/2026",
    dateOfBirth: "02/06/2011",
    ageBySept: 14,
    gender: "Male",
    stateOfOrigin: "London / Expatriate",
    nationality: "British",
    lastSchoolAttended: "Dulwich College Preparatory School, UK",
    healthInfo: "No chronic conditions. Wears knee brace for soccer recovery.",
    religion: "Christianity",
    parentName: "Simon & Victoria Webb",
    parentContactAddress: "Plot 10, Queen's Drive, Ikoyi, Lagos",
    parentPrimaryPhone: "+234 810 222 3344",
    alternativePhone: "+44 7911 123456",
    parentMaritalStatus: "Married",
    familyHospitalAddress: "Euracare Specialist Hospital, Victoria Island",
    placeOfWorship: "Guiding Light Assembly, Parkview Estate, Ikoyi",
    house: "Green House (Emerald)",
    parentPrimaryEmail: "simon.webb@standardchartered.com",
    fatherName: "Simon Webb",
    fatherPhone: "+234 810 222 3344",
    fatherEmail: "simon.webb@standardchartered.com",
    fatherPlaceOfWork: "Standard Chartered Bank Nigeria",
    fatherContactAddress: "Plot 10, Queen's Drive, Ikoyi, Lagos",
    motherName: "Victoria Webb",
    motherPhone: "+44 7911 123456",
    motherEmail: "victoria.webb@artgallery.co.uk",
    motherPlaceOfWork: "Contemporary African Art Consultancy",
    motherContactAddress: "Plot 10, Queen's Drive, Ikoyi, Lagos",
    avatarUrl: "https://images.unsplash.com/photo-1542178243-bc20204b769f?w=150&auto=format&fit=crop&q=80",
    enrolledAt: "01/09/2023",
    status: "Active",
  },
  {
    id: "student-008",
    admissionNumber: "2026/SEC/008",
    surname: "Nair",
    middleName: "Lakshmi",
    firstName: "Priya",
    fullName: "Priya Lakshmi Nair",
    currentClass: "Year 7B",
    currentTerm: "1st Term",
    currentYear: "2025/2026",
    dateOfBirth: "17/12/2013",
    ageBySept: 11,
    gender: "Female",
    stateOfOrigin: "Kerala / Expatriate",
    nationality: "Indian",
    lastSchoolAttended: "Indian Language School, Ilupeju, Lagos",
    healthInfo: "Astigmatism. Requires front row seating in classrooms.",
    religion: "Hinduism",
    parentName: "Rajesh & Deepa Nair",
    parentContactAddress: "Block C, Metro Gardens, Victoria Island, Lagos",
    parentPrimaryPhone: "+234 813 666 7788",
    alternativePhone: "+91 9840 123456",
    parentMaritalStatus: "Married",
    familyHospitalAddress: "Paelon Memorial Hospital, Victoria Island",
    placeOfWorship: "Geeta Ashram Mandir, Lekki",
    house: "Blue House (Triton)",
    parentPrimaryEmail: "rajesh.nair@tata.com",
    fatherName: "Rajesh Nair",
    fatherPhone: "+234 813 666 7788",
    fatherEmail: "rajesh.nair@tata.com",
    fatherPlaceOfWork: "Tata Africa Services Nigeria Ltd",
    fatherContactAddress: "Block C, Metro Gardens, Victoria Island, Lagos",
    motherName: "Deepa Nair",
    motherPhone: "+91 9840 123456",
    motherEmail: "deepa.nair@vedanta.edu",
    motherPlaceOfWork: "Independent Educator",
    motherContactAddress: "Block C, Metro Gardens, Victoria Island, Lagos",
    avatarUrl: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&auto=format&fit=crop&q=80",
    enrolledAt: "01/09/2025",
    status: "Active",
  },
];

export function getStoredStudents(): StudentRecord[] {
  if (typeof window === "undefined") return INITIAL_STUDENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    return parsed;
  } catch {
    return INITIAL_STUDENTS;
  }
}

function saveStudents(students: StudentRecord[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch (err) {
    console.error("Failed to save student records:", err);
  }
}

export function addStudentRecord(input: Partial<StudentRecord>): StudentRecord {
  const current = getStoredStudents();
  const id = input.id || `student-${Date.now()}`;
  const firstName = input.firstName?.trim() || "";
  const middleName = input.middleName?.trim() || "";
  const surname = input.surname?.trim() || "";
  const fullName = [firstName, middleName, surname].filter(Boolean).join(" ");
  
  const ageBySept = input.ageBySept !== undefined && input.ageBySept !== "" 
    ? input.ageBySept 
    : calculateAgeBySept(input.dateOfBirth);

  const newRecord: StudentRecord = {
    id,
    admissionNumber: input.admissionNumber?.trim() || `2026/SEC/${String(current.length + 1).padStart(3, "0")}`,
    surname,
    middleName,
    firstName,
    fullName,
    currentClass: input.currentClass?.trim() || "Year 7A",
    currentTerm: input.currentTerm || "1st Term",
    currentYear: input.currentYear || "2025/2026",
    dateOfBirth: input.dateOfBirth || "",
    ageBySept,
    gender: input.gender || "Male",
    stateOfOrigin: input.stateOfOrigin || "",
    nationality: input.nationality || "Nigerian",
    lastSchoolAttended: input.lastSchoolAttended || "",
    healthInfo: input.healthInfo || "",
    religion: input.religion || "",
    parentName: input.parentName || "",
    parentContactAddress: input.parentContactAddress || "",
    parentPrimaryPhone: input.parentPrimaryPhone || "",
    alternativePhone: input.alternativePhone || "",
    parentMaritalStatus: input.parentMaritalStatus || "Married",
    familyHospitalAddress: input.familyHospitalAddress || "",
    placeOfWorship: input.placeOfWorship || "",
    house: input.house || "Red House (Phoenix)",
    parentPrimaryEmail: input.parentPrimaryEmail || "",
    fatherName: input.fatherName || "",
    fatherPhone: input.fatherPhone || "",
    fatherEmail: input.fatherEmail || "",
    fatherPlaceOfWork: input.fatherPlaceOfWork || "",
    fatherContactAddress: input.fatherContactAddress || "",
    motherName: input.motherName || "",
    motherPhone: input.motherPhone || "",
    motherEmail: input.motherEmail || "",
    motherPlaceOfWork: input.motherPlaceOfWork || "",
    motherContactAddress: input.motherContactAddress || "",
    avatarUrl: input.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName || firstName)}`,
    enrolledAt: input.enrolledAt || new Date().toLocaleDateString("en-GB"),
    status: "Active",
  };

  const updated = [newRecord, ...current];
  saveStudents(updated);
  return newRecord;
}

export function updateStudentRecord(id: string, updates: Partial<StudentRecord>): StudentRecord | null {
  const current = getStoredStudents();
  const index = current.findIndex((s) => s.id === id);
  if (index === -1) return null;

  const prev = current[index];
  const firstName = updates.firstName !== undefined ? updates.firstName.trim() : prev.firstName;
  const middleName = updates.middleName !== undefined ? updates.middleName.trim() : prev.middleName;
  const surname = updates.surname !== undefined ? updates.surname.trim() : prev.surname;
  const fullName = [firstName, middleName, surname].filter(Boolean).join(" ");

  const dateOfBirth = updates.dateOfBirth !== undefined ? updates.dateOfBirth : prev.dateOfBirth;
  let ageBySept = updates.ageBySept !== undefined ? updates.ageBySept : prev.ageBySept;
  if (updates.dateOfBirth && (!updates.ageBySept || updates.ageBySept === "")) {
    ageBySept = calculateAgeBySept(updates.dateOfBirth);
  }

  const updatedRecord: StudentRecord = {
    ...prev,
    ...updates,
    firstName,
    middleName,
    surname,
    fullName,
    dateOfBirth,
    ageBySept,
  };

  const updatedList = [...current];
  updatedList[index] = updatedRecord;
  saveStudents(updatedList);
  return updatedRecord;
}

export function deleteStudentRecord(id: string): boolean {
  const current = getStoredStudents();
  const filtered = current.filter((s) => s.id !== id);
  if (filtered.length === current.length) return false;
  saveStudents(filtered);
  return true;
}

export function importStudentRecords(incoming: Partial<StudentRecord>[]): StudentRecord[] {
  const current = getStoredStudents();
  const newOnes: StudentRecord[] = incoming.map((input, idx) => {
    const id = input.id || `student-imp-${Date.now()}-${idx}`;
    const firstName = input.firstName?.trim() || "Student";
    const middleName = input.middleName?.trim() || "";
    const surname = input.surname?.trim() || "";
    const fullName = [firstName, middleName, surname].filter(Boolean).join(" ");

    return {
      id,
      admissionNumber: input.admissionNumber?.trim() || `2026/SEC/IMP-${100 + idx}`,
      surname,
      middleName,
      firstName,
      fullName,
      currentClass: input.currentClass?.trim() || "Year 7A",
      currentTerm: input.currentTerm || "1st Term",
      currentYear: input.currentYear || "2025/2026",
      dateOfBirth: input.dateOfBirth || "",
      ageBySept: input.ageBySept || calculateAgeBySept(input.dateOfBirth),
      gender: input.gender || "Male",
      stateOfOrigin: input.stateOfOrigin || "",
      nationality: input.nationality || "Nigerian",
      lastSchoolAttended: input.lastSchoolAttended || "",
      healthInfo: input.healthInfo || "",
      religion: input.religion || "",
      parentName: input.parentName || "",
      parentContactAddress: input.parentContactAddress || "",
      parentPrimaryPhone: input.parentPrimaryPhone || "",
      alternativePhone: input.alternativePhone || "",
      parentMaritalStatus: input.parentMaritalStatus || "Married",
      familyHospitalAddress: input.familyHospitalAddress || "",
      placeOfWorship: input.placeOfWorship || "",
      house: input.house || "Red House (Phoenix)",
      parentPrimaryEmail: input.parentPrimaryEmail || "",
      fatherName: input.fatherName || "",
      fatherPhone: input.fatherPhone || "",
      fatherEmail: input.fatherEmail || "",
      fatherPlaceOfWork: input.fatherPlaceOfWork || "",
      fatherContactAddress: input.fatherContactAddress || "",
      motherName: input.motherName || "",
      motherPhone: input.motherPhone || "",
      motherEmail: input.motherEmail || "",
      motherPlaceOfWork: input.motherPlaceOfWork || "",
      motherContactAddress: input.motherContactAddress || "",
      avatarUrl: input.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`,
      enrolledAt: new Date().toLocaleDateString("en-GB"),
      status: "Active",
    };
  });

  const merged = [...newOnes, ...current];
  saveStudents(merged);
  return merged;
}

export function useStudents() {
  const [students, setStudents] = useState<StudentRecord[]>(() => getStoredStudents());

  useEffect(() => {
    const handleUpdate = () => {
      setStudents(getStoredStudents());
    };
    window.addEventListener(EVENT_NAME, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return {
    students,
    addStudent: addStudentRecord,
    updateStudent: updateStudentRecord,
    deleteStudent: deleteStudentRecord,
    importStudents: importStudentRecords,
  };
}
