import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  HeartPulse,
  Users,
  UserCheck,
  Calendar,
  Sparkles,
  Check,
  AlertCircle,
  Save,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import type { StudentRecord } from "@/lib/types";
import {
  TERMS,
  MARITAL_STATUSES,
  SPORTS_HOUSES,
  RELIGIONS,
  calculateAgeBySept,
  YEAR_GROUPS,
} from "@/lib/types";
import { countries, states as allStates } from "@/lib/location-data";

interface StudentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentToEdit?: StudentRecord | null;
  onSave: (data: Partial<StudentRecord>) => void;
}

export function StudentModal({
  open,
  onOpenChange,
  studentToEdit,
  onSave,
}: StudentModalProps) {
  const isEditing = Boolean(studentToEdit);

  const [activeTab, setActiveTab] = useState("academic");

  // 34 Fields Form State
  const [form, setForm] = useState<Partial<StudentRecord>>({
    admissionNumber: "",
    surname: "",
    middleName: "",
    firstName: "",
    currentClass: "Year 7A",
    currentTerm: "1st Term",
    currentYear: "2025/2026",
    dateOfBirth: "",
    ageBySept: "",
    gender: "Male",
    stateOfOrigin: "",
    nationality: "Nigerian",
    lastSchoolAttended: "",
    healthInfo: "",
    religion: "Christianity",
    parentName: "",
    parentContactAddress: "",
    parentPrimaryPhone: "",
    alternativePhone: "",
    parentMaritalStatus: "Married",
    familyHospitalAddress: "",
    placeOfWorship: "",
    house: "Red House (Phoenix)",
    parentPrimaryEmail: "",
    fatherName: "",
    fatherPhone: "",
    fatherEmail: "",
    fatherPlaceOfWork: "",
    fatherContactAddress: "",
    motherName: "",
    motherPhone: "",
    motherEmail: "",
    motherPlaceOfWork: "",
    motherContactAddress: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (studentToEdit) {
      setForm({ ...studentToEdit });
    } else {
      setForm({
        admissionNumber: "",
        surname: "",
        middleName: "",
        firstName: "",
        currentClass: "Year 7A",
        currentTerm: "1st Term",
        currentYear: "2025/2026",
        dateOfBirth: "",
        ageBySept: "",
        gender: "Male",
        stateOfOrigin: "",
        nationality: "Nigerian",
        lastSchoolAttended: "",
        healthInfo: "",
        religion: "Christianity",
        parentName: "",
        parentContactAddress: "",
        parentPrimaryPhone: "",
        alternativePhone: "",
        parentMaritalStatus: "Married",
        familyHospitalAddress: "",
        placeOfWorship: "",
        house: "Red House (Phoenix)",
        parentPrimaryEmail: "",
        fatherName: "",
        fatherPhone: "",
        fatherEmail: "",
        fatherPlaceOfWork: "",
        fatherContactAddress: "",
        motherName: "",
        motherPhone: "",
        motherEmail: "",
        motherPlaceOfWork: "",
        motherContactAddress: "",
      });
    }
    setActiveTab("academic");
  }, [studentToEdit, open]);

  const updateField = (key: keyof StudentRecord, value: any) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      // Auto calculate age by Sept when DOB changes
      if (key === "dateOfBirth") {
        const calculatedAge = calculateAgeBySept(value);
        if (calculatedAge !== "") {
          next.ageBySept = calculatedAge;
        }
      }
      return next;
    });
  };

  const handleDOBChange = (raw: string) => {
    updateField("dateOfBirth", raw);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check only essential required fields at enrollment
    if (!form.admissionNumber?.trim()) {
      toast.error("Admission Number is required");
      setActiveTab("academic");
      return;
    }
    if (!form.surname?.trim()) {
      toast.error("Surname is required");
      setActiveTab("academic");
      return;
    }
    if (!form.firstName?.trim()) {
      toast.error("First Name is required");
      setActiveTab("academic");
      return;
    }
    if (!form.currentClass?.trim()) {
      toast.error("Current Class is required");
      setActiveTab("academic");
      return;
    }
    if (!form.gender) {
      toast.error("Gender is required");
      setActiveTab("academic");
      return;
    }

    setIsSubmitting(true);
    try {
      onSave(form);
      toast.success(
        isEditing
          ? `Student ${form.firstName} ${form.surname} updated successfully!`
          : `Student ${form.firstName} ${form.surname} enrolled successfully!`
      );
      onOpenChange(false);
    } catch (err) {
      toast.error("An error occurred while saving student record");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 bg-white border-slate-100 shadow-2xl">
        <DialogHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-[#eaf1ef] text-[#3C594E] flex items-center justify-center">
                {isEditing ? <Save className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-slate-900 tracking-tight">
                  {isEditing ? "Edit Student Profile & Dossier" : "Enrol New Student"}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 font-medium mt-0.5">
                  {isEditing
                    ? "Update institutional, medical, parent, and personal records for this student at any time."
                    : "Complete student onboarding. Only core fields are required initially."}
                </DialogDescription>
              </div>
            </div>
            <Badge
              variant="outline"
              className="hidden sm:inline-flex rounded-xl font-semibold text-xs border-slate-200 text-slate-600 px-3 py-1"
            >
              34 Data Fields
            </Badge>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="enrollment-form space-y-6 pt-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 xl:grid-cols-4 w-full bg-slate-100/90 p-1 rounded-2xl h-auto gap-1">
              <TabsTrigger
                value="academic"
                className="min-w-0 h-auto min-h-9 !whitespace-normal rounded-xl text-xs font-bold leading-tight data-[state=active]:bg-white data-[state=active]:shadow-sm px-2 py-2 flex items-center justify-center gap-1.5"
              >
                <GraduationCap className="h-3.5 w-3.5 text-[#3C594E]" />
                <span className="block text-center !whitespace-normal">1. Academic & Identity</span>
              </TabsTrigger>
              <TabsTrigger
                value="personal"
                className="min-w-0 h-auto min-h-9 !whitespace-normal rounded-xl text-xs font-bold leading-tight data-[state=active]:bg-white data-[state=active]:shadow-sm px-2 py-2 flex items-center justify-center gap-1.5"
              >
                <HeartPulse className="h-3.5 w-3.5 text-[#BF8360]" />
                <span className="block text-center !whitespace-normal">2. Personal & Health</span>
              </TabsTrigger>
              <TabsTrigger
                value="guardian"
                className="min-w-0 h-auto min-h-9 !whitespace-normal rounded-xl text-xs font-bold leading-tight data-[state=active]:bg-white data-[state=active]:shadow-sm px-2 py-2 flex items-center justify-center gap-1.5"
              >
                <Users className="h-3.5 w-3.5 text-[#3C594E]" />
                <span className="block text-center !whitespace-normal">3. Primary Guardian</span>
              </TabsTrigger>
              <TabsTrigger
                value="parents"
                className="min-w-0 h-auto min-h-9 !whitespace-normal rounded-xl text-xs font-bold leading-tight data-[state=active]:bg-white data-[state=active]:shadow-sm px-2 py-2 flex items-center justify-center gap-1.5"
              >
                <UserCheck className="h-3.5 w-3.5 text-[#BF8360]" />
                <span className="block text-center !whitespace-normal">4. Father & Mother</span>
              </TabsTrigger>
            </TabsList>

            {/* ── TAB 1: Academic & Identity ─────────────────────────────────── */}
            <TabsContent value="academic" className="space-y-3 pt-3">
              <div className="rounded-2xl bg-slate-50/70 p-3 border border-slate-200/60 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#3C594E] flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4" /> Core Student Identifiers
                  </h4>
                  <span className="text-[11px] text-red-500 font-semibold">* Marked fields required</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-slate-600">
                      Admission Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={form.admissionNumber}
                      onChange={(e) => updateField("admissionNumber", e.target.value)}
                      placeholder="Admission Number"
                      className="h-9 rounded-xl text-xs bg-white border-slate-200"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-slate-600">
                      Surname <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={form.surname}
                      onChange={(e) => updateField("surname", e.target.value)}
                      placeholder="Surname"
                      className="h-9 rounded-xl text-xs bg-white border-slate-200"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-slate-600">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={form.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                      placeholder="First Name"
                      className="h-9 rounded-xl text-xs bg-white border-slate-200"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-slate-600">Middle Name</Label>
                    <Input
                      value={form.middleName || ""}
                      onChange={(e) => updateField("middleName", e.target.value)}
                      placeholder="Middle Name (optional)"
                      className="h-9 rounded-xl text-xs bg-white border-slate-200"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50/70 p-3 border border-slate-200/60 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                  Academic Placement & Enrollment Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-slate-600">
                      Current Class <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={form.currentClass}
                      onChange={(e) => updateField("currentClass", e.target.value)}
                      placeholder="e.g. Year 7A, Grade 8, JSS 1"
                      className="h-9 rounded-xl text-xs bg-white border-slate-200"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-slate-600">Current Term</Label>
                    <Select
                      value={form.currentTerm || "1st Term"}
                      onValueChange={(val) => updateField("currentTerm", val)}
                    >
                      <SelectTrigger className="h-9 rounded-xl text-xs bg-white border-slate-200">
                        <SelectValue placeholder="Select Term" />
                      </SelectTrigger>
                      <SelectContent>
                        {TERMS.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-slate-600">Current Academic Year</Label>
                    <Input
                      value={form.currentYear || "2025/2026"}
                      onChange={(e) => updateField("currentYear", e.target.value)}
                      placeholder="e.g. 2025/2026"
                      className="h-9 rounded-xl text-xs bg-white border-slate-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-slate-600">
                      Gender <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={form.gender || "Male"}
                      onValueChange={(val) => updateField("gender", val)}
                    >
                      <SelectTrigger className="h-9 rounded-xl text-xs bg-white border-slate-200">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* ── TAB 2: Personal, Health & Sports ────────────────────────────── */}
            <TabsContent value="personal" className="space-y-3 pt-3">
              <div className="rounded-2xl bg-slate-50/70 p-3 border border-slate-200/60 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#BF8360] flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" /> Demographics & Birth Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-slate-600">
                      Date of Birth (DD/MM/YYYY)
                    </Label>
                    <Input
                      value={form.dateOfBirth || ""}
                      onChange={(e) => handleDOBChange(e.target.value)}
                      placeholder="DD/MM/YYYY (e.g. 15/04/2012)"
                      className="h-9 rounded-xl text-xs bg-white border-slate-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label className="text-[11px] font-medium text-slate-600">
                        Age by Sept. This Year
                      </Label>
                      {form.dateOfBirth && (
                        <span className="text-[10px] text-[#3C594E] font-bold">Auto-calculated</span>
                      )}
                    </div>
                    <Input
                      type="number"
                      value={form.ageBySept || ""}
                      onChange={(e) => updateField("ageBySept", e.target.value)}
                      placeholder="Age in Sept"
                      className="h-9 rounded-xl text-xs bg-white border-slate-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-slate-600">Country / Nationality</Label>
                    <Input
                      value={form.nationality || "Nigerian"}
                      onChange={(e) => updateField("nationality", e.target.value)}
                      placeholder="Country or Nationality"
                      className="h-9 rounded-xl text-xs bg-white border-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-slate-600">State of Origin</Label>
                    <Input
                      value={form.stateOfOrigin || ""}
                      onChange={(e) => updateField("stateOfOrigin", e.target.value)}
                      placeholder="State of Origin / County"
                      className="h-9 rounded-xl text-xs bg-white border-slate-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-slate-600">Religion</Label>
                    <Select
                      value={form.religion || "Christianity"}
                      onValueChange={(val) => updateField("religion", val)}
                    >
                      <SelectTrigger className="h-9 rounded-xl text-xs bg-white border-slate-200">
                        <SelectValue placeholder="Select Religion" />
                      </SelectTrigger>
                      <SelectContent>
                        {RELIGIONS.map((r) => (
                          <SelectItem key={r} value={r}>
                            {r}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-slate-600">Place of Worship</Label>
                    <Input
                      value={form.placeOfWorship || ""}
                      onChange={(e) => updateField("placeOfWorship", e.target.value)}
                      placeholder="Parish, Mosque, or Assembly"
                      className="h-9 rounded-xl text-xs bg-white border-slate-200"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50/70 p-3 border border-slate-200/60 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                  Institutional, Sports & Health Record
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-slate-600">House (Inter-House Sport)</Label>
                    <Select
                      value={form.house || "Red House (Phoenix)"}
                      onValueChange={(val) => updateField("house", val)}
                    >
                      <SelectTrigger className="h-9 rounded-xl text-xs bg-white border-slate-200">
                        <SelectValue placeholder="Select Sports House" />
                      </SelectTrigger>
                      <SelectContent>
                        {SPORTS_HOUSES.map((h) => (
                          <SelectItem key={h.name} value={h.name}>
                            <div className="flex items-center gap-2">
                              <span
                                className="h-3 w-3 rounded-full shrink-0"
                                style={{ backgroundColor: h.color }}
                              />
                              <span>{h.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-slate-600">Last School Attended</Label>
                    <Input
                      value={form.lastSchoolAttended || ""}
                      onChange={(e) => updateField("lastSchoolAttended", e.target.value)}
                      placeholder="Previous School / Nursery / Academy"
                      className="h-9 rounded-xl text-xs bg-white border-slate-200"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-[11px] font-medium text-slate-600">
                    Health Info & Medical Alerts (Allergies, Genotype, Blood Group, Inhaler, Diet)
                  </Label>
                  <Textarea
                    value={form.healthInfo || ""}
                    onChange={(e) => updateField("healthInfo", e.target.value)}
                    placeholder="Provide relevant medical details, allergies, chronic conditions, emergency protocols..."
                    className="rounded-xl text-xs bg-white border-slate-200 min-h-[52px]"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-[11px] font-medium text-slate-600">Family Hospital Address</Label>
                  <Input
                    value={form.familyHospitalAddress || ""}
                    onChange={(e) => updateField("familyHospitalAddress", e.target.value)}
                    placeholder="Designated Family Clinic, Hospital, or Emergency Medical Facility"
                    className="h-9 rounded-xl text-xs bg-white border-slate-200"
                  />
                </div>
              </div>
            </TabsContent>

            {/* ── TAB 3: Primary Guardian ────────────────────────────────────── */}
            <TabsContent value="guardian" className="space-y-3 pt-3">
              <div className="rounded-2xl bg-slate-50/70 p-3 border border-slate-200/60 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#3C594E] flex items-center gap-1.5">
                  <Users className="h-4 w-4" /> Primary Parent / Legal Guardian Dossier
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-slate-600">Parent or Guardian Name</Label>
                    <Input
                      value={form.parentName || ""}
                      onChange={(e) => updateField("parentName", e.target.value)}
                      placeholder="Parent or Guardian Full Name"
                      className="h-9 rounded-xl text-xs bg-white border-slate-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-slate-600">Parent Marital Status</Label>
                    <Select
                      value={form.parentMaritalStatus || "Married"}
                      onValueChange={(val) => updateField("parentMaritalStatus", val)}
                    >
                      <SelectTrigger className="h-9 rounded-xl text-xs bg-white border-slate-200">
                        <SelectValue placeholder="Select Marital Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {MARITAL_STATUSES.map((m) => (
                          <SelectItem key={m} value={m}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-slate-600">
                      Parent Primary Phone No.
                    </Label>
                    <Input
                      value={form.parentPrimaryPhone || ""}
                      onChange={(e) => updateField("parentPrimaryPhone", e.target.value)}
                      placeholder="Primary phone number for SMS/calls"
                      className="h-9 rounded-xl text-xs bg-white border-slate-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-slate-600">
                      Alternative Phone Number
                    </Label>
                    <Input
                      value={form.alternativePhone || ""}
                      onChange={(e) => updateField("alternativePhone", e.target.value)}
                      placeholder="Secondary emergency phone"
                      className="h-9 rounded-xl text-xs bg-white border-slate-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-slate-600">
                      Parent's Primary Email Address
                    </Label>
                    <Input
                      type="email"
                      value={form.parentPrimaryEmail || ""}
                      onChange={(e) => updateField("parentPrimaryEmail", e.target.value)}
                      placeholder="Email address for reports & alerts"
                      className="h-9 rounded-xl text-xs bg-white border-slate-200"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-[11px] font-medium text-slate-600">
                    Parent Contact Address (Residential)
                  </Label>
                  <Input
                    value={form.parentContactAddress || ""}
                    onChange={(e) => updateField("parentContactAddress", e.target.value)}
                    placeholder="Residential street address, estate, city"
                    className="h-9 rounded-xl text-xs bg-white border-slate-200"
                  />
                </div>
              </div>
            </TabsContent>

            {/* ── TAB 4: Father & Mother Profiles ────────────────────────────── */}
            <TabsContent value="parents" className="space-y-3 pt-3">
              {/* Father Section */}
              <div className="rounded-2xl bg-slate-50/70 p-3 border border-slate-200/60 space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-200/60 pb-1.5">
                  <UserCheck className="h-4 w-4 text-[#3C594E]" />
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#3C594E]">
                    Father's Information
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-slate-600">Father's Name</Label>
                    <Input
                      value={form.fatherName || ""}
                      onChange={(e) => updateField("fatherName", e.target.value)}
                      placeholder="Father's Full Name"
                      className="h-9 rounded-xl text-xs bg-white border-slate-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-slate-600">Father's Phone No.</Label>
                    <Input
                      value={form.fatherPhone || ""}
                      onChange={(e) => updateField("fatherPhone", e.target.value)}
                      placeholder="Father's phone number"
                      className="h-9 rounded-xl text-xs bg-white border-slate-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-slate-600">Father's Email Address</Label>
                    <Input
                      type="email"
                      value={form.fatherEmail || ""}
                      onChange={(e) => updateField("fatherEmail", e.target.value)}
                      placeholder="Father's email"
                      className="h-9 rounded-xl text-xs bg-white border-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-slate-600">Father's Place of Work</Label>
                    <Input
                      value={form.fatherPlaceOfWork || ""}
                      onChange={(e) => updateField("fatherPlaceOfWork", e.target.value)}
                      placeholder="Employer / Business / Office Location"
                      className="h-9 rounded-xl text-xs bg-white border-slate-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-slate-600">Father's Contact Address</Label>
                    <Input
                      value={form.fatherContactAddress || ""}
                      onChange={(e) => updateField("fatherContactAddress", e.target.value)}
                      placeholder="Father's residential or official address"
                      className="h-9 rounded-xl text-xs bg-white border-slate-200"
                    />
                  </div>
                </div>
              </div>

              {/* Mother Section */}
              <div className="rounded-2xl bg-slate-50/70 p-3 border border-slate-200/60 space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-200/60 pb-1.5">
                  <UserCheck className="h-4 w-4 text-[#BF8360]" />
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#BF8360]">
                    Mother's Information
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-slate-600">Mother's Name</Label>
                    <Input
                      value={form.motherName || ""}
                      onChange={(e) => updateField("motherName", e.target.value)}
                      placeholder="Mother's Full Name"
                      className="h-9 rounded-xl text-xs bg-white border-slate-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-slate-600">Mother's Phone No.</Label>
                    <Input
                      value={form.motherPhone || ""}
                      onChange={(e) => updateField("motherPhone", e.target.value)}
                      placeholder="Mother's phone number"
                      className="h-9 rounded-xl text-xs bg-white border-slate-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-slate-600">Mother's Email Address</Label>
                    <Input
                      type="email"
                      value={form.motherEmail || ""}
                      onChange={(e) => updateField("motherEmail", e.target.value)}
                      placeholder="Mother's email"
                      className="h-9 rounded-xl text-xs bg-white border-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-slate-600">Mother's Place of Work</Label>
                    <Input
                      value={form.motherPlaceOfWork || ""}
                      onChange={(e) => updateField("motherPlaceOfWork", e.target.value)}
                      placeholder="Employer / Business / Office Location"
                      className="h-9 rounded-xl text-xs bg-white border-slate-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-slate-600">Mother's Contact Address</Label>
                    <Input
                      value={form.motherContactAddress || ""}
                      onChange={(e) => updateField("motherContactAddress", e.target.value)}
                      placeholder="Mother's residential or official address"
                      className="h-9 rounded-xl text-xs bg-white border-slate-200"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="border-t border-slate-100 pt-4 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-xs text-slate-500 font-medium">
              You can update any of these fields at any time after enrollment.
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="rounded-xl h-9 px-4 font-semibold text-xs border-slate-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl h-9 px-6 font-semibold text-xs text-white shadow-sm"
                style={{ backgroundColor: "#3C594E" }}
              >
                {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Enrol Student"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

