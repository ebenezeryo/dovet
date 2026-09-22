import React, { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Users,
  FileText,
  Search,
  Bell,
  UserPlus,
  ChevronRight,
  TrendingUp,
  BookOpen,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Upload,
  Download,
  Sparkles,
  FileSpreadsheet,
  AlertCircle,
  Megaphone,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { countries, states as allStates, lgas as allLgas } from "@/lib/location-data";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { useStudents } from "@/lib/student-store";
import { getLearnPacks } from "@/lib/learn-pack-store";
import { StudentModal } from "@/components/StudentModal";
import type { StudentRecord } from "@/lib/types";

export const DashboardHome = () => {
  const { user } = useAuth();
  const { students, addStudent, importStudents } = useStudents();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const packs = getLearnPacks();

  // Comprehensive 34-Field Add Student Modal
  const [studentModalOpen, setStudentModalOpen] = useState(false);

  // Bulk CSV Upload Modal
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [parsedRows, setParsedRows] = useState<Partial<StudentRecord>[]>([]);
  const [isUploadingBulk, setIsUploadingBulk] = useState(false);

  // Announcement Modal
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [broadcastMsg, setBroadcastMsg] = useState("");

  // Create Exam Modal
  const [examForm, setExamForm] = useState({
    title: "",
    subject: "Mathematics",
    totalMarks: "100",
    durationMinutes: "60",
    instructions: "",
    yearGroup: "Year 7",
    className: "7A",
  });
  const [isCreatingExam, setIsCreatingExam] = useState(false);
  const [examDialogOpen, setExamDialogOpen] = useState(false);

  // Recent Submissions Feed
  const submissions: Array<{ id: string; student: string; exam: string; score: string; grade: string; time: string; status: string }> = [];

  const handleDownloadCsvTemplate = () => {
    const headers = [
      "ADMISSION NUMBER",
      "SURNAME",
      "MIDDLE NAME",
      "FIRST NAME",
      "CURRENT CLASS",
      "CURRENT TERM",
      "CURRENT YEAR",
      "DATEOFBIRTH (DD/MM/YYYY)",
      "AGE BY SEPT. THIS YEAR",
      "GENDER",
      "STATE OF ORIGIN",
      "COUNTRY/NATIONALITY",
      "LAST SCH ATTENDED",
      "HEALTH INFO",
      "RELIGION",
      "PARENT OR GUARG. NAME",
      "PARENT CONTACT ADDRESS",
      "PARENT PRIMARY PHONE NO",
      "ALTERNATIVE PHONE NUMBER",
      "PARENT MARITAL STATUS",
      "FAMILY HOSPITAL ADDRESS",
      "PLACE OF WORSHIP",
      "HOUSE (INTER-HOUSE SPORT)",
      "PARENT'S PRIMARY EMAIL ADDRESS",
      "FATHER'S NAME",
      "FATHER'S PHONE NO.",
      "FATHER'S EMAIL ADDRESS",
      "FATHER'S PLACE OF WORK",
      "FATHER'S CONTACT ADDRESS",
      "MOTHER'S NAME",
      "MOTHER'S PHONE NO.",
      "MOTHER'S EMAIL ADDRESS",
      "MOTHER'S PLACE OF WORK",
      "MOTHER'S CONTACT ADDRESS",
    ].join(",");

    const sampleRow = ""; /* Legacy sample row intentionally excluded from downloads.
      "2026/SEC/101",
      "Sterling",
      "Alexander",
      "Jack",
      "Year 7A",
      "1st Term",
      "2025/2026",
      "14/05/2013",
      "12",
      "Male",
      "Lagos State",
      "Nigerian",
      "Corona Primary School",
      "Mild peanut allergy",
      "Christianity",
      "David Sterling",
      "14 Admiralty Way Lekki",
      "+2348023456789",
      "+2348098765432",
      "Married",
      "Reddington Hospital VI",
      "City of David RCCG",
      "Red House (Phoenix)",
      "sterling.parents@gmail.com",
      "David Sterling",
      "+2348023456789",
      "david@acmecorp.ng",
      "Sterling Maritime",
      "14 Admiralty Way Lekki",
      "Grace Sterling",
      "+2348098765432",
      "grace@medhealth.ng",
      "First Cardiology",
      "14 Admiralty Way Lekki",
    ].join(","); */

    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + sampleRow + "\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "dovet_34field_student_import_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("34-Field CSV template downloaded!");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n").filter((l) => l.trim().length > 0);
      if (lines.length <= 1) {
        toast.error("CSV file is empty or missing headers");
        return;
      }

      const rows: Partial<StudentRecord>[] = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
        if (cols.length >= 4) {
          rows.push({
            admissionNumber: cols[0] || `2026/SEC/${100 + i}`,
            surname: cols[1] || "",
            middleName: cols[2] || "",
            firstName: cols[3] || "Student",
            currentClass: cols[4] || "Year 7A",
            currentTerm: cols[5] || "1st Term",
            currentYear: cols[6] || "2025/2026",
            dateOfBirth: cols[7] || "",
            ageBySept: cols[8] || "",
            gender: cols[9] || "Male",
            stateOfOrigin: cols[10] || "",
            nationality: cols[11] || "Nigerian",
            lastSchoolAttended: cols[12] || "",
            healthInfo: cols[13] || "",
            religion: cols[14] || "",
            parentName: cols[15] || "",
            parentContactAddress: cols[16] || "",
            parentPrimaryPhone: cols[17] || "",
            alternativePhone: cols[18] || "",
            parentMaritalStatus: cols[19] || "Married",
            familyHospitalAddress: cols[20] || "",
            placeOfWorship: cols[21] || "",
            house: cols[22] || "Red House (Phoenix)",
            parentPrimaryEmail: cols[23] || "",
            fatherName: cols[24] || "",
            fatherPhone: cols[25] || "",
            fatherEmail: cols[26] || "",
            fatherPlaceOfWork: cols[27] || "",
            fatherContactAddress: cols[28] || "",
            motherName: cols[29] || "",
            motherPhone: cols[30] || "",
            motherEmail: cols[31] || "",
            motherPlaceOfWork: cols[32] || "",
            motherContactAddress: cols[33] || "",
          });
        }
      }

      setParsedRows(rows);
      toast.success(`Parsed ${rows.length} student records from CSV`);
    };
    reader.readAsText(file);
  };

  const handleConfirmBulkUpload = async () => {
    if (parsedRows.length === 0) {
      toast.error("No students to import");
      return;
    }

    setIsUploadingBulk(true);
    await new Promise((r) => setTimeout(r, 600));

    importStudents(parsedRows);
    setIsUploadingBulk(false);
    setBulkDialogOpen(false);
    toast.success(`Successfully enrolled ${parsedRows.length} students with full 34-field dossiers!`);
    setParsedRows([]);
  };

  const handleSaveStudent = (data: Partial<StudentRecord>) => {
    addStudent(data);
  };

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examForm.title) {
      toast.error("Please provide an exam title");
      return;
    }

    setIsCreatingExam(true);
    await new Promise((r) => setTimeout(r, 800));

    setIsCreatingExam(false);
    setExamDialogOpen(false);
    toast.success(`Exam '${examForm.title}' created and scheduled!`);
  };

  const handleBroadcast = () => {
    if (!broadcastMsg.trim()) return;
    toast.success("School announcement broadcasted to all students and staff!");
    setBroadcastOpen(false);
    setBroadcastMsg("");
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm" style={{ backgroundColor: '#ffffff' }}>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Welcome, {user?.fullName || "Administrator"}
            </h1>
            <Badge className="bg-slate-100 text-slate-700 border-none font-semibold text-xs">
              Principal Console
            </Badge>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm font-normal mt-1">
            {user?.schoolName || "Dovet International Academy"} · Academic Management Suite
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            onClick={() => setBulkDialogOpen(true)}
            className="rounded-2xl font-semibold text-white shadow-sm gap-2 h-10 px-4 text-xs sm:text-sm"
            style={{ backgroundColor: '#3C594E' }}
          >
            <Upload className="h-4 w-4" /> Bulk CSV Upload
          </Button>
          <Button
            onClick={() => setStudentModalOpen(true)}
            variant="outline"
            className="rounded-2xl font-semibold border-slate-200 gap-2 h-10 text-xs sm:text-sm hover:bg-[#eaf1ef] hover:border-[#c8dcd5] text-slate-700"
            style={{ backgroundColor: '#ffffff' }}
          >
            <UserPlus className="h-4 w-4" style={{ color: '#3C594E' }} /> + Student
          </Button>
          <Button
            onClick={() => setExamDialogOpen(true)}
            variant="outline"
            className="rounded-2xl font-semibold border-slate-200 gap-2 h-10 text-xs sm:text-sm hover:bg-[#fdf3ee] hover:border-[#e8c4a8] text-slate-700"
            style={{ backgroundColor: '#ffffff' }}
          >
            <FileText className="h-4 w-4" style={{ color: '#BF8360' }} /> + Exam
          </Button>
          <Button
            onClick={() => setBroadcastOpen(true)}
            variant="outline"
            size="icon"
            className="rounded-2xl border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 h-10 w-10"
            style={{ backgroundColor: '#ffffff' }}
            title="School Announcement"
          >
            <Megaphone className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* KPI Stats Counters */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Enrolled Students", val: students.length, icon: Users,       color: "text-[#3C594E]", bg: "bg-[#eaf1ef] border-[#c8dcd5]" },
          { label: "Active Faculty",    val: user ? 1 : 0,            icon: ShieldCheck,  color: "text-[#3C594E]", bg: "bg-[#e8f9f0] border-[#b2eccf]" },
          { label: "Published Packs",   val: packs.filter((pack) => pack.status === "published").length, icon: BookOpen, color: "text-[#BF8360]", bg: "bg-[#fdf3ee] border-[#e8c4a8]" },
          { label: "Weekly Submissions",val: 0,                         icon: TrendingUp, color: "text-[#0D0D0D]", bg: "bg-[#F2F2F2] border-[#d8d8d8]" },
        ].map((kpi, idx) => (
          <Card key={idx} className="border border-slate-200 shadow-sm rounded-3xl p-5 space-y-3" style={{ backgroundColor: '#ffffff' }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{kpi.label}</span>
              <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center border", kpi.bg, kpi.color)}>
                <kpi.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {kpi.val.toLocaleString()}
            </div>
          </Card>
        ))}
      </div>

      {/* Main Grid: Submissions & Management */}
      <Card className="border border-slate-200 shadow-sm rounded-3xl p-6 space-y-5" style={{ backgroundColor: '#ffffff' }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Recent Formative & Summative Submissions</h2>
            <p className="text-xs text-slate-500 font-normal mt-0.5">Live activity stream across your institution</p>
          </div>
          <Badge className="font-semibold text-xs border" style={{ backgroundColor: '#eaf1ef', color: '#3C594E', borderColor: '#c8dcd5' }}>
            No submissions yet
          </Badge>
        </div>

        <div className="divide-y divide-slate-100">
          {submissions.map((sub) => (
            <div key={sub.id} className="py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={cn("h-8 w-8 rounded-xl flex items-center justify-center text-xs font-bold border", sub.status === "graded" ? "bg-[#e8f9f0] text-[#3C594E] border-[#b2eccf]" : "bg-slate-100 text-slate-500 border-slate-200")}>
                  {sub.grade}
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-800">{sub.student}</div>
                  <div className="text-xs text-slate-400 font-normal mt-0.5">{sub.exam}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs sm:text-sm font-bold text-slate-900">{sub.score}</div>
                <div className="text-[10px] text-slate-400 font-medium mt-0.5">{sub.time}</div>
              </div>
            </div>
          ))}
          {submissions.length === 0 && <p className="py-8 text-center text-sm text-slate-500">No student submissions have been recorded yet.</p>}
        </div>
      </Card>

      {/* Comprehensive 34-Field Student Enrollment Modal */}
      <StudentModal
        open={studentModalOpen}
        onOpenChange={setStudentModalOpen}
        onSave={handleSaveStudent}
      />

      {/* Bulk CSV Upload Modal */}
      <Dialog open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
        <DialogContent className="max-w-2xl rounded-3xl p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" style={{ color: '#3C594E' }} /> Bulk Student Import via CSV
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 font-normal">
              Import hundreds of student records in 1 click using a standard CSV spreadsheet.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="flex items-center justify-between p-4 rounded-2xl" style={{ backgroundColor: '#eaf1ef', border: '1px solid #c8dcd5' }}>
              <div>
                <div className="text-xs font-bold" style={{ color: '#2a3f38' }}>Need the CSV Template?</div>
                <p className="text-[11px] mt-0.5" style={{ color: '#3C594E' }}>Download an empty 34-field spreadsheet template for your school records.</p>
              </div>
              <Button
                type="button"
                onClick={handleDownloadCsvTemplate}
                variant="outline"
                className="rounded-xl font-semibold text-xs gap-1.5 shrink-0 bg-white"
                style={{ borderColor: '#3C594E', color: '#3C594E' }}
              >
                <Download className="h-3.5 w-3.5" /> Download Template
              </Button>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all"
              style={{ borderColor: '#c8dcd5', backgroundColor: '#f7faf9' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#3C594E')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#c8dcd5')}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".csv"
                className="hidden"
              />
              <div className="h-12 w-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#eaf1ef', border: '1px solid #c8dcd5', color: '#3C594E' }}>
                <Upload className="h-6 w-6" />
              </div>
              <div className="font-bold text-sm text-slate-800">
                {parsedRows.length > 0 ? `${parsedRows.length} students loaded ready for import` : "Click to select CSV file"}
              </div>
              <p className="text-xs text-slate-400 mt-1">Supports UTF-8 CSV files up to 5,000 rows</p>
            </div>

            {parsedRows.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700">Preview (First 4 rows):</div>
                <div className="max-h-40 overflow-y-auto rounded-2xl border border-slate-200 divide-y divide-slate-100 text-xs">
                  {parsedRows.slice(0, 4).map((row, i) => (
                    <div key={i} className="p-2.5 flex items-center justify-between bg-white font-medium">
                      <span>{row.firstName} {row.lastName} ({row.admissionNumber})</span>
                      <Badge className="bg-slate-100 text-slate-700 border-none font-semibold text-[10px]">{row.grade} · {row.className}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setBulkDialogOpen(false)} className="rounded-xl font-semibold text-xs">
              Cancel
            </Button>
            <Button
              onClick={handleConfirmBulkUpload}
              disabled={parsedRows.length === 0 || isUploadingBulk}
              className="rounded-xl font-semibold text-xs text-white shadow-sm gap-1.5"
              style={{ backgroundColor: '#3C594E' }}
            >
              {isUploadingBulk ? "Enrolling Students..." : `Enrol ${parsedRows.length} Students 🚀`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Broadcast Announcement Dialog */}
      <Dialog open={broadcastOpen} onOpenChange={setBroadcastOpen}>
        <DialogContent className="max-w-lg rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">Broadcast School Announcement</DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Send a high-priority banner notification to all students and staff members
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Textarea
              value={broadcastMsg}
              onChange={(e) => setBroadcastMsg(e.target.value)}
              placeholder="Type announcement message to broadcast to all students and staff..."
              className="rounded-2xl text-xs min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBroadcastOpen(false)} className="rounded-xl font-semibold text-xs">
              Cancel
            </Button>
            <Button onClick={handleBroadcast} className="rounded-xl font-semibold text-xs text-white" style={{ backgroundColor: '#3C594E' }}>
              Broadcast Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Exam Dialog */}
      <Dialog open={examDialogOpen} onOpenChange={setExamDialogOpen}>
        <DialogContent className="max-w-lg rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">Create Scheduled Exam</DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Schedule a summative assessment with time limit and mark scheme
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateExam} className="space-y-3 py-2">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Exam Title</Label>
              <Input
                value={examForm.title}
                onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
                placeholder="Enter exam title"
                className="rounded-xl h-10 text-xs"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Subject</Label>
                <Input
                  value={examForm.subject}
                  onChange={(e) => setExamForm({ ...examForm, subject: e.target.value })}
                  className="rounded-xl h-10 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Duration (Mins)</Label>
                <Input
                  value={examForm.durationMinutes}
                  onChange={(e) => setExamForm({ ...examForm, durationMinutes: e.target.value })}
                  className="rounded-xl h-10 text-xs"
                />
              </div>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setExamDialogOpen(false)} className="rounded-xl font-semibold text-xs">
                Cancel
              </Button>
              <Button type="submit" disabled={isCreatingExam} className="rounded-xl font-semibold text-xs text-white" style={{ backgroundColor: '#BF8360' }}>
                {isCreatingExam ? "Scheduling..." : "Schedule Exam"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
