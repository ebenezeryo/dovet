import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { DovetUser } from "@/lib/types";

interface TeacherSettingsProps {
  user: DovetUser;
}

interface SettingsForm {
  fullName: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  schoolName: string;
  notifications: boolean;
}

const initialFormState: SettingsForm = {
  fullName: "",
  email: "",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
  schoolName: "",
  notifications: true,
};

export function TeacherSettings({ user }: TeacherSettingsProps) {
  const [form, setForm] = useState<SettingsForm>(initialFormState);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      fullName: user.fullName,
      email: user.email,
      schoolName: user.schoolName,
    }));
  }, [user]);

  const setField = (field: keyof SettingsForm, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.fullName.trim() || !form.email.trim()) {
      toast.error("Name and email are required.");
      return;
    }

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    const updatedUser: DovetUser = {
      ...user,
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      schoolName: form.schoolName.trim() || user.schoolName,
    };
    localStorage.setItem("dovet_user", JSON.stringify(updatedUser));

    setForm((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));

    toast.success("Settings saved successfully.");
    setIsSaving(false);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      <div>
        <h1 className="text-4xl font-black text-slate-900">Teacher Settings</h1>
        <p className="text-slate-500 font-medium mt-2">
          Manage your profile, email, and notification preferences.
        </p>
      </div>

      <Card className="border-none shadow-2xl rounded-[2.5rem]">
        <CardContent className="p-10 space-y-10">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Profile</div>
              <div className="space-y-5">
                <div>
                  <Label className="font-black">Teacher Name</Label>
                  <Input
                    value={form.fullName}
                    onChange={(event) => setField("fullName", event.target.value)}
                    className="h-14 rounded-2xl bg-slate-50"
                  />
                </div>
                <div>
                  <Label className="font-black">Email Address</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(event) => setField("email", event.target.value)}
                    className="h-14 rounded-2xl bg-slate-50"
                  />
                </div>
                <div>
                  <Label className="font-black">School</Label>
                  <Input
                    value={form.schoolName}
                    onChange={(event) => setField("schoolName", event.target.value)}
                    className="h-14 rounded-2xl bg-slate-50"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Account</div>
              <div className="space-y-5">
                <div>
                  <Label className="font-black">Current Password</Label>
                  <Input
                    type="password"
                    value={form.currentPassword}
                    onChange={(event) => setField("currentPassword", event.target.value)}
                    className="h-14 rounded-2xl bg-slate-50"
                  />
                </div>
                <div>
                  <Label className="font-black">New Password</Label>
                  <Input
                    type="password"
                    value={form.newPassword}
                    onChange={(event) => setField("newPassword", event.target.value)}
                    className="h-14 rounded-2xl bg-slate-50"
                  />
                </div>
                <div>
                  <Label className="font-black">Confirm New Password</Label>
                  <Input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(event) => setField("confirmPassword", event.target.value)}
                    className="h-14 rounded-2xl bg-slate-50"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Notifications</div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-base font-black text-slate-900">Receive updates and alerts</div>
                  <p className="text-sm text-slate-500">Get notified when a new learn pack or exam is published.</p>
                </div>
                <label className="inline-flex items-center gap-3 cursor-pointer">
                  <span className="text-sm font-semibold text-slate-700">Enabled</span>
                  <input
                    type="checkbox"
                    checked={form.notifications}
                    onChange={(event) => setField("notifications", event.target.checked)}
                    className="h-5 w-5 rounded-md border border-slate-300 text-primary focus:ring-primary"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2 max-w-2xl">
              <p className="text-sm text-slate-500">
                Your settings are stored locally for this demo. In a production app, this would save to your account and keep your profile in sync across devices.
              </p>
            </div>
            <Button className="rounded-xl px-8 h-14" onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving…" : "Save settings"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
