import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  GraduationCap,
  HeartPulse,
  Users,
  UserCheck,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Building,
  Edit,
  Shield,
  Activity,
  Home,
  Briefcase,
} from "lucide-react";
import type { StudentRecord } from "@/lib/types";

interface StudentProfileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: StudentRecord | null;
  onEdit: (student: StudentRecord) => void;
}

export function StudentProfileDrawer({
  open,
  onOpenChange,
  student,
  onEdit,
}: StudentProfileDrawerProps) {
  if (!student) return null;

  const initials = student.fullName
    ? student.fullName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
    : `${student.firstName?.[0] || ""}${student.surname?.[0] || ""}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 bg-white border-slate-100 shadow-2xl">
        <DialogHeader className="border-b border-slate-100 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 rounded-2xl border-2 border-slate-100 shadow-xs">
                <AvatarImage src={student.avatarUrl} alt={student.fullName} />
                <AvatarFallback
                  className="text-lg font-bold rounded-2xl"
                  style={{ backgroundColor: "#eaf1ef", color: "#3C594E" }}
                >
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">
                    {student.fullName || `${student.firstName} ${student.surname}`}
                  </DialogTitle>
                  <Badge
                    className="border-none font-bold text-xs"
                    style={{ backgroundColor: "#e8f9f0", color: "#3C594E" }}
                  >
                    {student.status || "Active"}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 font-semibold mt-1">
                  Admission No: <span className="text-slate-800 font-mono">{student.admissionNumber}</span> · Class:{" "}
                  <span className="text-slate-800">{student.currentClass}</span>
                </p>
              </div>
            </div>

            <Button
              onClick={() => {
                onOpenChange(false);
                onEdit(student);
              }}
              className="rounded-2xl h-10 px-5 font-bold text-xs gap-2 text-white shadow-sm"
              style={{ backgroundColor: "#3C594E" }}
            >
              <Edit className="h-3.5 w-3.5" /> Edit Student Data
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Section 1: Academic & Institutional */}
          <div className="rounded-2xl border border-slate-200/70 p-5 bg-slate-50/50 space-y-3">
            <h4 className="font-black text-xs uppercase tracking-wider text-[#3C594E] flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4" /> Academic & Institutional Profile
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 font-medium block">Current Class</span>
                <span className="font-bold text-slate-800">{student.currentClass || "—"}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Current Term</span>
                <span className="font-bold text-slate-800">{student.currentTerm || "—"}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Academic Year</span>
                <span className="font-bold text-slate-800">{student.currentYear || "—"}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Inter-House Sport</span>
                <span className="font-bold text-slate-800">{student.house || "—"}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Personal, Demographics & Health */}
          <div className="rounded-2xl border border-slate-200/70 p-5 bg-white space-y-3 shadow-xs">
            <h4 className="font-black text-xs uppercase tracking-wider text-[#BF8360] flex items-center gap-1.5">
              <Calendar className="h-4 w-4" /> Personal & Demographics Record
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-400 font-medium block">Date of Birth</span>
                <span className="font-bold text-slate-800">{student.dateOfBirth || "—"}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Age by Sept. This Year</span>
                <span className="font-bold text-slate-800">{student.ageBySept ? `${student.ageBySept} yrs` : "—"}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Gender</span>
                <span className="font-bold text-slate-800">{student.gender || "—"}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Nationality</span>
                <span className="font-bold text-slate-800">{student.nationality || "—"}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">State of Origin</span>
                <span className="font-bold text-slate-800">{student.stateOfOrigin || "—"}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Religion & Place of Worship</span>
                <span className="font-bold text-slate-800">
                  {student.religion || "—"} {student.placeOfWorship ? `(${student.placeOfWorship})` : ""}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 font-medium block">Last School Attended</span>
                <span className="font-bold text-slate-800">{student.lastSchoolAttended || "—"}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Family Hospital Address</span>
                <span className="font-bold text-slate-800">{student.familyHospitalAddress || "—"}</span>
              </div>
            </div>

            {student.healthInfo && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-400 font-medium text-xs block mb-1 flex items-center gap-1">
                  <HeartPulse className="h-3.5 w-3.5 text-red-500" /> Health & Medical Notes
                </span>
                <p className="text-xs font-semibold text-slate-700 bg-red-50/60 p-3 rounded-xl border border-red-100">
                  {student.healthInfo}
                </p>
              </div>
            )}
          </div>

          {/* Section 3: Primary Guardian */}
          <div className="rounded-2xl border border-slate-200/70 p-5 bg-slate-50/50 space-y-3">
            <h4 className="font-black text-xs uppercase tracking-wider text-[#3C594E] flex items-center gap-1.5">
              <Users className="h-4 w-4" /> Primary Guardian Contact
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 font-medium block">Guardian Name</span>
                <span className="font-bold text-slate-800">{student.parentName || "—"}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Marital Status</span>
                <span className="font-bold text-slate-800">{student.parentMaritalStatus || "—"}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Primary Phone</span>
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <Phone className="h-3 w-3 text-slate-400" /> {student.parentPrimaryPhone || "—"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Alternative Phone</span>
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <Phone className="h-3 w-3 text-slate-400" /> {student.alternativePhone || "—"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Email Address</span>
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <Mail className="h-3 w-3 text-slate-400" /> {student.parentPrimaryEmail || "—"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Residential Contact Address</span>
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-slate-400 shrink-0" /> {student.parentContactAddress || "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Section 4: Father & Mother Profiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Father */}
            <div className="rounded-2xl border border-slate-200/70 p-4 bg-white space-y-2.5 text-xs shadow-xs">
              <h5 className="font-black text-xs uppercase tracking-wider text-[#3C594E] flex items-center gap-1.5 border-b pb-2">
                <UserCheck className="h-3.5 w-3.5" /> Father's Profile
              </h5>
              <div>
                <span className="text-slate-400 font-medium block">Name</span>
                <span className="font-bold text-slate-800">{student.fatherName || "—"}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Phone</span>
                <span className="font-bold text-slate-800">{student.fatherPhone || "—"}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Email</span>
                <span className="font-bold text-slate-800">{student.fatherEmail || "—"}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Place of Work</span>
                <span className="font-bold text-slate-800">{student.fatherPlaceOfWork || "—"}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Contact Address</span>
                <span className="font-bold text-slate-800">{student.fatherContactAddress || "—"}</span>
              </div>
            </div>

            {/* Mother */}
            <div className="rounded-2xl border border-slate-200/70 p-4 bg-white space-y-2.5 text-xs shadow-xs">
              <h5 className="font-black text-xs uppercase tracking-wider text-[#BF8360] flex items-center gap-1.5 border-b pb-2">
                <UserCheck className="h-3.5 w-3.5" /> Mother's Profile
              </h5>
              <div>
                <span className="text-slate-400 font-medium block">Name</span>
                <span className="font-bold text-slate-800">{student.motherName || "—"}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Phone</span>
                <span className="font-bold text-slate-800">{student.motherPhone || "—"}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Email</span>
                <span className="font-bold text-slate-800">{student.motherEmail || "—"}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Place of Work</span>
                <span className="font-bold text-slate-800">{student.motherPlaceOfWork || "—"}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Contact Address</span>
                <span className="font-bold text-slate-800">{student.motherContactAddress || "—"}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
