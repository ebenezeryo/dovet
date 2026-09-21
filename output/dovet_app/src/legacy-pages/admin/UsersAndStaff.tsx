import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Users,
  GraduationCap,
  ShieldCheck,
  UserPlus,
  Edit,
  Eye,
  Trash2,
  Phone,
  Filter,
  Sparkles,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import type { DovetUser, StudentRecord } from "@/lib/types";
import { SPORTS_HOUSES } from "@/lib/types";
import { useStudents } from "@/lib/student-store";
import { StudentModal } from "@/components/StudentModal";
import { StudentProfileDrawer } from "@/components/StudentProfileDrawer";

// ── Mock staff roster ────────────────────────────────────────────────────────
const MOCK_STAFF: DovetUser[] = [
  {
    id: "admin-001",
    fullName: "Dr. Elizabeth Vance",
    email: "principal@dovetacademy.io",
    role: "admin",
    schoolName: "Dovet International Academy",
    subdomain: "dovet-academy",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "teacher-001",
    fullName: "Mrs. Olu Adebayo",
    email: "o.adebayo@dovetacademy.io",
    role: "teacher",
    schoolName: "Dovet International Academy",
    subdomain: "dovet-academy",
    avatarUrl: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "teacher-002",
    fullName: "Mr. James Okafor",
    email: "j.okafor@dovetacademy.io",
    role: "teacher",
    schoolName: "Dovet International Academy",
    subdomain: "dovet-academy",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "teacher-003",
    fullName: "Ms. Claire Fontaine",
    email: "c.fontaine@dovetacademy.io",
    role: "teacher",
    schoolName: "Dovet International Academy",
    subdomain: "dovet-academy",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "teacher-004",
    fullName: "Mr. Kwame Mensah",
    email: "k.mensah@dovetacademy.io",
    role: "teacher",
    schoolName: "Dovet International Academy",
    subdomain: "dovet-academy",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  },
];

// ── Role badge config ─────────────────────────────────────────────────────────
const roleBadge: Record<string, { label: string; className: string; style?: React.CSSProperties }> = {
  admin:   { label: "Admin",   className: "border-none text-white font-semibold text-xs",   style: { backgroundColor: '#3C594E' } },
  teacher: { label: "Teacher", className: "border font-semibold text-xs",                   style: { backgroundColor: '#eaf1ef', color: '#3C594E', borderColor: '#c8dcd5' } },
};

function StatCard({ icon: Icon, label, count, color }: { icon: React.ElementType; label: string; count: number; color: string }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 shadow-xs">
      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-2xl font-bold text-slate-800 leading-none">{count}</div>
        <div className="text-xs text-slate-500 font-medium mt-0.5">{label}</div>
      </div>
    </div>
  );
}

export const UsersAndStaff = () => {
  const { students, addStudent, updateStudent, deleteStudent } = useStudents();

  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedHouse, setSelectedHouse] = useState<string>("all");
  const [selectedGender, setSelectedGender] = useState<string>("all");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<StudentRecord | null>(null);

  // Profile Drawer State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedStudentForView, setSelectedStudentForView] = useState<StudentRecord | null>(null);

  const classes = Array.from(new Set(students.map((s) => s.currentClass))).filter(Boolean);

  const filteredStudents = students.filter((s) => {
    const query = search.toLowerCase().trim();
    const matchesSearch =
      !query ||
      s.fullName?.toLowerCase().includes(query) ||
      s.firstName?.toLowerCase().includes(query) ||
      s.surname?.toLowerCase().includes(query) ||
      s.admissionNumber?.toLowerCase().includes(query) ||
      s.parentPrimaryPhone?.includes(query) ||
      s.parentName?.toLowerCase().includes(query);

    const matchesClass = selectedClass === "all" || s.currentClass === selectedClass;
    const matchesHouse = selectedHouse === "all" || s.house === selectedHouse;
    const matchesGender = selectedGender === "all" || s.gender === selectedGender;

    return matchesSearch && matchesClass && matchesHouse && matchesGender;
  });

  const filteredStaff = MOCK_STAFF.filter(
    (u) =>
      !search.trim() ||
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenEnrollModal = () => {
    setStudentToEdit(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (student: StudentRecord) => {
    setStudentToEdit(student);
    setModalOpen(true);
  };

  const handleOpenViewDrawer = (student: StudentRecord) => {
    setSelectedStudentForView(student);
    setDrawerOpen(true);
  };

  const handleSaveStudent = (data: Partial<StudentRecord>) => {
    if (studentToEdit) {
      updateStudent(studentToEdit.id, data);
    } else {
      addStudent(data);
    }
  };

  const handleDelete = (student: StudentRecord) => {
    if (window.confirm(`Are you sure you want to remove ${student.fullName || student.firstName} from the student records?`)) {
      deleteStudent(student.id);
      toast.success(`Removed student record for ${student.firstName}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Staff & Students Roster</h1>
          <p className="text-slate-500 text-sm font-medium mt-0.5">
            Manage student enrollment with full 34-field dossiers and faculty accounts.
          </p>
        </div>

        <Button
          onClick={handleOpenEnrollModal}
          className="rounded-2xl h-11 px-5 font-bold text-xs gap-2 text-white shadow-sm"
          style={{ backgroundColor: "#3C594E" }}
        >
          <UserPlus className="h-4 w-4" /> Enrol Student
        </Button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard icon={Users} label="Total accounts" count={MOCK_STAFF.length + students.length} color="bg-[#F2F2F2] text-[#3C594E]" />
        <StatCard icon={ShieldCheck} label="Staff & Teachers" count={MOCK_STAFF.length} color="bg-[#eaf1ef] text-[#3C594E]" />
        <StatCard icon={GraduationCap} label="Enrolled Students" count={students.length} color="bg-[#fdf3ee] text-[#BF8360]" />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="student" className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <TabsList className="bg-slate-100 p-1 rounded-2xl h-auto">
            <TabsTrigger
              value="student"
              className="rounded-xl text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm px-4 py-2"
            >
              Students <span className="ml-1.5 text-slate-400 font-semibold">({filteredStudents.length})</span>
            </TabsTrigger>
            <TabsTrigger
              value="staff"
              className="rounded-xl text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm px-4 py-2"
            >
              Staff & Faculty <span className="ml-1.5 text-slate-400 font-semibold">({filteredStaff.length})</span>
            </TabsTrigger>
          </TabsList>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[200px] flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              <Input
                placeholder="Search name, admission no, phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 rounded-xl border-slate-200 text-xs h-9 bg-white"
              />
            </div>

            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="h-9 rounded-xl text-xs font-medium border-slate-200 bg-white w-28">
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedHouse} onValueChange={setSelectedHouse}>
              <SelectTrigger className="h-9 rounded-xl text-xs font-medium border-slate-200 bg-white w-32">
                <SelectValue placeholder="House" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Houses</SelectItem>
                {SPORTS_HOUSES.map((h) => (
                  <SelectItem key={h.name} value={h.name}>
                    {h.name.split(" ")[0]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedGender} onValueChange={setSelectedGender}>
              <SelectTrigger className="h-9 rounded-xl text-xs font-medium border-slate-200 bg-white w-24">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ── STUDENTS TAB ───────────────────────────────────────────────────── */}
        <TabsContent value="student" className="mt-0 space-y-4">
          <Card className="border border-slate-200/70 shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/60 border-b border-slate-100 px-6 py-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-slate-800">
                  Enrolled Students Directory ({filteredStudents.length})
                </CardTitle>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Click 'View Dossier' to review all 34 fields or 'Edit' to update any student record.
                </p>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {filteredStudents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                    <Users className="h-5 w-5 text-slate-400" />
                  </div>
                  <p className="font-bold text-slate-700 text-sm">No students found</p>
                  <p className="text-slate-400 text-xs mt-1">Try adjusting your filters or enrol a new student.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-100 bg-slate-50/30">
                        <TableHead className="text-slate-500 font-bold text-xs uppercase tracking-wider pl-6">
                          Student & Admission No
                        </TableHead>
                        <TableHead className="text-slate-500 font-bold text-xs uppercase tracking-wider">
                          Class & Term
                        </TableHead>
                        <TableHead className="text-slate-500 font-bold text-xs uppercase tracking-wider">
                          House & Gender
                        </TableHead>
                        <TableHead className="text-slate-500 font-bold text-xs uppercase tracking-wider">
                          Guardian & Phone
                        </TableHead>
                        <TableHead className="text-slate-500 font-bold text-xs uppercase tracking-wider">
                          Age / DOB
                        </TableHead>
                        <TableHead className="text-slate-500 font-bold text-xs uppercase tracking-wider text-right pr-6">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((s) => {
                        const initials = s.fullName
                          ? s.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")
                          : `${s.firstName?.[0] || ""}${s.surname?.[0] || ""}`;

                        return (
                          <TableRow
                            key={s.id}
                            className="border-slate-100 hover:bg-[#f7faf9] transition-colors group cursor-pointer"
                            onClick={() => handleOpenViewDrawer(s)}
                          >
                            <TableCell className="pl-6 py-3.5">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9 rounded-xl">
                                  <AvatarImage src={s.avatarUrl} alt={s.fullName} />
                                  <AvatarFallback
                                    className="text-xs font-bold rounded-xl"
                                    style={{ backgroundColor: "#eaf1ef", color: "#3C594E" }}
                                  >
                                    {initials}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <span className="font-bold text-sm text-slate-900 block group-hover:text-[#3C594E] transition-colors">
                                    {s.fullName || `${s.firstName} ${s.surname}`}
                                  </span>
                                  <span className="text-[11px] font-mono text-slate-400 font-medium">
                                    {s.admissionNumber}
                                  </span>
                                </div>
                              </div>
                            </TableCell>

                            <TableCell>
                              <div>
                                <span className="font-bold text-xs text-slate-800 block">
                                  {s.currentClass || "—"}
                                </span>
                                <span className="text-[11px] text-slate-400 font-medium">
                                  {s.currentTerm || "1st Term"}
                                </span>
                              </div>
                            </TableCell>

                            <TableCell>
                              <div className="space-y-1">
                                <span className="inline-flex items-center text-xs font-semibold text-slate-700">
                                  {s.gender || "—"}
                                </span>
                                {s.house && (
                                  <span className="block text-[10px] text-slate-500 font-medium truncate max-w-[120px]">
                                    {s.house.split(" ")[0]} House
                                  </span>
                                )}
                              </div>
                            </TableCell>

                            <TableCell>
                              <div className="text-xs space-y-0.5">
                                <span className="font-medium text-slate-800 block truncate max-w-[140px]">
                                  {s.parentName || "—"}
                                </span>
                                <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                                  <Phone className="h-2.5 w-2.5 text-slate-400" />
                                  {s.parentPrimaryPhone || "—"}
                                </span>
                              </div>
                            </TableCell>

                            <TableCell>
                              <div className="text-xs">
                                <span className="font-bold text-slate-800 block">
                                  {s.ageBySept ? `${s.ageBySept} yrs` : "—"}
                                </span>
                                <span className="text-[11px] text-slate-400">{s.dateOfBirth || "—"}</span>
                              </div>
                            </TableCell>

                            <TableCell className="text-right pr-6 py-3.5" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end gap-1.5">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleOpenViewDrawer(s)}
                                  className="h-8 px-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-[#3C594E] hover:bg-[#eaf1ef]"
                                  title="View Full Dossier"
                                >
                                  <Eye className="h-3.5 w-3.5 mr-1" /> Dossier
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleOpenEditModal(s)}
                                  className="h-8 px-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-[#BF8360] hover:bg-[#fdf3ee]"
                                  title="Edit All 34 Fields"
                                >
                                  <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(s)}
                                  className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                                  title="Remove Student"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── STAFF TAB ──────────────────────────────────────────────────────── */}
        <TabsContent value="staff" className="mt-0">
          <Card className="border border-slate-200/70 shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/60 border-b border-slate-100 px-6 py-4">
              <CardTitle className="text-sm font-bold text-slate-800">
                Staff & Administrators Directory ({filteredStaff.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-100">
                    <TableHead className="text-slate-500 font-bold text-xs uppercase tracking-wider pl-6">
                      User
                    </TableHead>
                    <TableHead className="text-slate-500 font-bold text-xs uppercase tracking-wider">
                      Work Email
                    </TableHead>
                    <TableHead className="text-slate-500 font-bold text-xs uppercase tracking-wider pr-6 text-right">
                      Assigned Role
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.map((u) => {
                    const initials = u.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("");
                    const badge = roleBadge[u.role] ?? { label: u.role, className: "bg-slate-100 text-slate-600 border-none" };

                    return (
                      <TableRow key={u.id} className="border-slate-100 hover:bg-[#f7faf9] transition-colors">
                        <TableCell className="pl-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 rounded-xl">
                              <AvatarImage src={u.avatarUrl ?? undefined} alt={u.fullName} />
                              <AvatarFallback
                                className="text-xs font-bold rounded-xl"
                                style={{ backgroundColor: "#eaf1ef", color: "#3C594E" }}
                              >
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-bold text-sm text-slate-900">{u.fullName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-slate-500 font-medium">{u.email}</TableCell>
                        <TableCell className="text-right pr-6">
                          <Badge className={badge.className} style={badge.style}>
                            {badge.label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── Universal Student 34-Field Enrollment & Edit Modal ─────────────────── */}
      <StudentModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        studentToEdit={studentToEdit}
        onSave={handleSaveStudent}
      />

      {/* ── Student Full Dossier Viewer ────────────────────────────────────────── */}
      <StudentProfileDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        student={selectedStudentForView}
        onEdit={handleOpenEditModal}
      />
    </div>
  );
};
