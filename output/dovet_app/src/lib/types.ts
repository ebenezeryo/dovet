// ─── User & Auth ────────────────────────────────────────────────────────────

export type UserRole = "admin" | "teacher" | "student" | "parent";

export const ROLE_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "teacher", label: "Teacher" },
  { value: "student", label: "Student" },
  { value: "parent", label: "Parent" },
] as const;

export const ASSESSMENT_MODES = ["learn", "exam"] as const;

export interface DovetUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  schoolName: string;
  schoolLogo?: string | null;
  subdomain: string;
  avatarUrl?: string | null;
  childId?: string; // for parent role
}

// ─── Assessment Modes ────────────────────────────────────────────────────────

export type AssessmentMode = "learn" | "exam";

export type AssessmentStatus = "draft" | "published" | "scheduled" | "active" | "closed" | "archived";

export type DifficultyLevel = "Easy" | "Standard" | "Hard" | "Mixed";

export type GradeResult = "A+" | "A" | "B" | "C" | "D" | "F";

export type PackCompletionStatus = "completed" | "due_soon" | "active" | "expired";

// ─── Weekly Subject Learn Pack (Formative 7-Day Model) ───────────────────────

export interface LearnPack {
  id: string;
  title: string;
  subject: string;
  topic: string;
  yearGroup: string;
  curriculum: string;
  difficulty: DifficultyLevel;
  teacherName: string;
  agencyName: string;
  weekNumber: number;
  term?: string;
  createdAt: string;
  publishedAt: string;
  dueDate: string;          // 7 days from publishedAt
  durationDays: number;     // default 7
  daysRemaining: number;    // calculated days left
  status: "draft" | "published" | "archived";
  completionStatus?: PackCompletionStatus;
  score?: string;
  percentage?: number;
  grade?: GradeResult;
  questionCount: number;
  questions: LearnQuestion[];
  days?: LearnDay[];        // backward-compat for multi-day preview
  assignedTo?: string[];    // student ids or class ids
}

export interface LearnDay {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
  subtopic: string;
  clusters: LearnCluster[];
}

export interface LearnCluster {
  topic: string;
  questions: LearnQuestion[];
}

export interface LearnQuestion {
  text: string;
  hint: string;
  opts: [string, string, string, string];
  correct: 0 | 1 | 2 | 3;
  why: string;
  steps: string[];
  isExample: boolean;
  exNum: 1 | 2 | 3 | 0;
  clTopic: string;
  clIdx: 0 | 1 | 2 | 3;
}

// ─── Student Notifications & Reminders ────────────────────────────────────────

export interface StudentNotification {
  id: string;
  title: string;
  message: string;
  type: "due_soon" | "new_pack" | "graded" | "announcement";
  subject: string;
  packId?: string;
  dueDate?: string;
  hoursRemaining?: number;
  isRead: boolean;
  createdAt: string;
}

// ─── Quiz Session (Learn Mode result) ────────────────────────────────────────

export interface QuizSession {
  id: string;
  packId: string;
  studentId: string;
  studentName: string;
  day?: string;
  completedAt: string;
  score: number;
  totalPractice: number;
  percentage: number;
  grade: GradeResult;
  log: QuizLogEntry[];
}

export interface QuizLogEntry {
  questionText: string;
  correct: boolean;
  chosen: number;       // -1 = timed out
  correctAnswer: string;
  chosenAnswer: string;
  timedOut: boolean;
}

// ─── Summative Exam ──────────────────────────────────────────────────────────

export interface Exam {
  id: string;
  title: string;
  subject: string;
  yearGroup: string;
  className?: string;
  totalMarks: number;
  durationMinutes: number;
  instructions?: string;
  curriculum?: string;
  isPublished: boolean;
  publishedAt?: string;
  scheduledAt?: string;
  status: "draft" | "scheduled" | "active" | "closed";
  questions: ExamQuestion[];
  assignedTo?: string[];
}

export interface ExamQuestion {
  id: string;
  text: string;
  type: "mcq" | "short" | "long" | "true_false";
  opts?: string[];
  correct?: number | string;
  marks: number;
}

export interface ExamSubmission {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  score: number;
  percentage: number;
  grade: GradeResult;
  answers: Record<string, number | string>;
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export interface StudentProgress {
  studentId: string;
  studentName: string;
  learnPacksCompleted: number;
  examsCompleted: number;
  averageLearnScore: number;
  averageExamScore: number;
  overallGrade: GradeResult;
  weakTopics: string[];
  streak: number;
}

// ─── Curricula ────────────────────────────────────────────────────────────────

export const CURRICULA = [
  "Nigerian & British (Dual Curriculum)",
  "British Curriculum (UK / Cambridge / Edexcel)",
  "Nigerian Curriculum (WAEC / NECO / BECE)",
  "Nova Scotia Curriculum (Canada)",
  "Cambridge Lower Secondary",
  "Cambridge IGCSE",
  "Cambridge A Level",
  "IB MYP",
  "IB Diploma",
  "US Common Core",
  "CBSE (India)",
  "South African CAPS",
  "Kenyan CBC",
  "Australian ACARA",
  "French Baccalauréat",
  "Other / Local",
] as const;

export type Curriculum = typeof CURRICULA[number];

export const YEAR_GROUPS = [
  "Reception", "Year 1", "Year 2", "Year 3", "Year 4",
  "Year 5", "Year 6", "Year 7", "Year 8", "Year 9",
  "Year 10", "Year 11", "Year 12", "Year 13",
  "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5",
  "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10",
  "Grade 11", "Grade 12",
] as const;

export const SUBJECTS = [
  "Mathematics", "English Language", "English Literature",
  "Science", "Biology", "Chemistry", "Physics",
  "History", "Geography", "Religious Studies",
  "ICT / Computer Science", "Business Studies", "Economics",
  "Art & Design", "Music", "Physical Education",
  "French", "Spanish", "Arabic", "Swahili",
  "Social Studies", "Citizenship",
] as const;

// ─── 34-Field Comprehensive Student Record ──────────────────────────────────

export interface StudentRecord {
  id: string;
  // 1. ADMISSION NUMBER (Required)
  admissionNumber: string;
  // 2. SURNAME (Required)
  surname: string;
  // 3. MIDDLE NAME
  middleName?: string;
  // 4. FIRST NAME (Required)
  firstName: string;
  // 5. CURRENT CLASS (Required)
  currentClass: string;
  // 6. CURRENT TERM
  currentTerm?: string;
  // 7. CURRENT YEAR
  currentYear?: string;
  // 8. DATEOFBIRTH (DD/MM/YYYY)
  dateOfBirth?: string;
  // 9. AGE BY SEPT. THIS YEAR
  ageBySept?: number | string;
  // 10. GENDER (Required)
  gender: "Male" | "Female" | string;
  // 11. STATE OF ORIGIN
  stateOfOrigin?: string;
  // 12. COUNTRY/NATIONALITY
  nationality?: string;
  // 13. LAST SCH ATTENDED
  lastSchoolAttended?: string;
  // 14. HEALTH INFO
  healthInfo?: string;
  // 15. RELIGION
  religion?: string;
  // 16. PARENT OR GUARG. NAME
  parentName?: string;
  // 17. PARENT CONTACT ADDRESS
  parentContactAddress?: string;
  // 18. PARENT PRIMARY PHONE NO
  parentPrimaryPhone?: string;
  // 19. ALTERNATIVE PHONE NUMBER
  alternativePhone?: string;
  // 20. PARENT MARITAL STATUS
  parentMaritalStatus?: string;
  // 21. FAMILY HOSPITAL ADDRESS
  familyHospitalAddress?: string;
  // 22. PLACE OF WORSHIP
  placeOfWorship?: string;
  // 23. HOUSE (INTER-HOUSE SPORT)
  house?: string;
  // 24. PARENT'S PRIMARY EMAIL ADDRESS
  parentPrimaryEmail?: string;
  // 25. FATHER'S NAME
  fatherName?: string;
  // 26. FATHER'S PHONE NO.
  fatherPhone?: string;
  // 27. FATHER'S EMAIL ADDRESS
  fatherEmail?: string;
  // 28. FATHER'S PLACE OF WORK
  fatherPlaceOfWork?: string;
  // 29. FATHER'S CONTACT ADDRESS
  fatherContactAddress?: string;
  // 30. MOTHER'S NAME
  motherName?: string;
  // 31. MOTHER'S PHONE NO.
  motherPhone?: string;
  // 32. MOTHER'S EMAIL ADDRESS
  motherEmail?: string;
  // 33. MOTHER'S PLACE OF WORK
  motherPlaceOfWork?: string;
  // 34. MOTHER'S CONTACT ADDRESS
  motherContactAddress?: string;

  // Metadata
  fullName?: string;
  avatarUrl?: string;
  enrolledAt?: string;
  status?: "Active" | "Inactive" | "Suspended" | "Graduated";
}

export const TERMS = ["1st Term", "2nd Term", "3rd Term", "Autumn Term", "Spring Term", "Summer Term"] as const;

export const MARITAL_STATUSES = ["Married", "Single", "Divorced", "Widowed", "Separated"] as const;

export const SPORTS_HOUSES = [
  { name: "Red House (Phoenix)", color: "#EF4444" },
  { name: "Blue House (Triton)", color: "#3B82F6" },
  { name: "Green House (Emerald)", color: "#10B981" },
  { name: "Yellow House (Solaris)", color: "#F59E0B" },
  { name: "Purple House (Eagle)", color: "#8B5CF6" },
] as const;

export const RELIGIONS = ["Christianity", "Islam", "Other"] as const;

/**
 * Calculates age as of September 1st of the current academic year from DD/MM/YYYY or YYYY-MM-DD
 */
export function calculateAgeBySept(dobString?: string): number | "" {
  if (!dobString || dobString.trim().length === 0) return "";
  let day: number, month: number, year: number;

  if (dobString.includes("/")) {
    const parts = dobString.split("/").map((p) => parseInt(p.trim(), 10));
    if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
      day = parts[0];
      month = parts[1];
      year = parts[2];
    } else {
      return "";
    }
  } else if (dobString.includes("-")) {
    const parts = dobString.split("-").map((p) => parseInt(p.trim(), 10));
    if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
      year = parts[0];
      month = parts[1];
      day = parts[2];
    } else {
      return "";
    }
  } else {
    return "";
  }

  const currentYear = new Date().getFullYear();
  const septFirst = new Date(currentYear, 8, 1); // Sept 1 of current year
  const birthDate = new Date(year, month - 1, day);

  if (isNaN(birthDate.getTime())) return "";

  let age = septFirst.getFullYear() - birthDate.getFullYear();
  const m = septFirst.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && septFirst.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 ? age : "";
}
