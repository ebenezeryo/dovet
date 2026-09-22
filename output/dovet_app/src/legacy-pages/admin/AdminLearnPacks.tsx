import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Sparkles, Loader2, Pencil, Trash2, Send } from "lucide-react";
import { toast } from "sonner";
import { addLearnPack, deleteLearnPack, getLearnPacks, updateLearnPack, type StoredLearnPack } from "@/lib/learn-pack-store";
import { createLearnPack, fetchLearnPacks, isLearnPackServiceUnavailable, removeLearnPack, setLearnPackStatus, updateLearnPackDetails } from "@/lib/learn-pack-api";
import { useAuth } from "@/lib/auth-context";

export function AdminLearnPacks() {
  const [packs, setPacks] = useState<StoredLearnPack[]>(getLearnPacks);
  const [isCreating, setIsCreating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [form, setForm] = useState({ subject: "", topic: "", yearGroup: "" });
  const { token } = useAuth();

  useEffect(() => {
    if (!token || token.startsWith("demo-token-")) return;
    fetchLearnPacks(token).then(setPacks).catch(() => { /* Local cache remains available offline. */ });
  }, [token]);

  const generatePack = async () => {
    if (!form.subject.trim() || !form.topic.trim() || !form.yearGroup.trim()) {
      toast.error("Please enter a subject, topic, and year group.");
      return;
    }
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    const pack: StoredLearnPack = {
      id: `pack-${Date.now()}`,
      title: `${form.topic.trim()} Learn Pack`,
      subject: form.subject.trim(),
      topic: form.topic.trim(),
      yearGroup: form.yearGroup.trim(),
      curriculum: "Not specified",
      difficulty: "Mixed",
      status: "draft",
      days: 5,
      createdAt: new Date().toISOString().slice(0, 10),
      assignedCount: 0,
      completions: 0,
    };
    try {
      const savedPack = !token || token.startsWith("demo-token-")
        ? (addLearnPack(pack), pack)
        : await createLearnPack(token, pack);
      setPacks((current) => [savedPack, ...current.filter((currentPack) => currentPack.id !== savedPack.id)]);
      setForm({ subject: "", topic: "", yearGroup: "" });
      setIsCreating(false);
      toast.success("Learning pack generated and added to the library as a draft.");
    } catch (error) {
      if (isLearnPackServiceUnavailable(error)) {
        setPacks(addLearnPack(pack));
        setForm({ subject: "", topic: "", yearGroup: "" });
        setIsCreating(false);
        toast.warning("Learning-pack service is unavailable. The draft was saved locally on this device.");
      } else {
        toast.error(error instanceof Error ? error.message : "Could not save the learning pack.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const editPack = async (pack: StoredLearnPack) => {
    const topic = window.prompt("Update the learning-pack topic", pack.topic)?.trim();
    if (!topic || topic === pack.topic) return;
    const updated = { ...pack, topic, title: `${topic} Learn Pack` };
    try {
      if (!token || token.startsWith("demo-token-")) setPacks(updateLearnPack(pack.id, updated));
      else {
        const saved = await updateLearnPackDetails(token, updated);
        setPacks((current) => current.map((item) => item.id === pack.id ? saved : item));
      }
      toast.success("Learning pack updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update the learning pack.");
    }
  };

  const removePack = async (pack: StoredLearnPack) => {
    if (!window.confirm(`Delete “${pack.title}”? This cannot be undone.`)) return;
    try {
      if (!token || token.startsWith("demo-token-")) setPacks(deleteLearnPack(pack.id));
      else {
        await removeLearnPack(token, pack.id);
        setPacks((current) => current.filter((item) => item.id !== pack.id));
      }
      toast.success("Learning pack deleted.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete the learning pack.");
    }
  };

  const publishPack = async (pack: StoredLearnPack) => {
    try {
      if (!token || token.startsWith("demo-token-")) {
        setPacks(updateLearnPack(pack.id, { status: "published" }));
      } else {
        const saved = await setLearnPackStatus(token, pack.id, "published");
        setPacks((current) => current.map((item) => item.id === pack.id ? saved : item));
      }
      toast.success("Learning pack published to students.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not publish the learning pack.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Learn Pack Library</h1>
          <p className="text-slate-500 font-medium mt-1">Overview of formative content across your school.</p>
        </div>
        <Button className="rounded-xl gap-2 font-bold" onClick={() => setIsCreating(true)}>
          <Sparkles className="h-4 w-4" /> Create new pack
        </Button>
      </div>

      {isCreating && (
        <Card className="border-none shadow-sm">
          <CardContent className="p-5 space-y-4">
            <div>
              <h2 className="font-black text-slate-900">Generate learning pack</h2>
              <p className="text-sm text-slate-500">Create a draft for a class or teacher to review.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {(["subject", "topic", "yearGroup"] as const).map((field) => (
                <div key={field} className="space-y-1.5">
                  <Label className="capitalize">{field === "yearGroup" ? "Year group" : field}</Label>
                  <Input
                    value={form[field]}
                    placeholder={field === "topic" ? "e.g. Fractions" : field === "subject" ? "e.g. Mathematics" : "e.g. Year 7"}
                    onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <Button onClick={generatePack} disabled={isGenerating} className="gap-2">
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {isGenerating ? "Generating..." : "Generate pack"}
              </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)} disabled={isGenerating}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {packs.map((pack) => (
          <Card key={pack.title} className="border-none shadow-sm">
            <CardContent className="p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[#eaf1ef] p-2.5">
                  <BookOpen className="h-5 w-5 text-[#3C594E]" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900">{pack.title}</h3>
                  <p className="text-sm text-slate-500 font-medium">{pack.subject} · {pack.assignedCount} assigned students</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="border-none bg-slate-100 text-slate-600 text-xs font-bold">{pack.status}</Badge>
                <div className="text-right">
                  <div className="font-black text-slate-900">{pack.completions}%</div>
                  <div className="text-xs text-slate-400 font-medium">completion</div>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => editPack(pack)}><Pencil className="h-3.5 w-3.5" /> Edit</Button>
                {pack.status === "draft" && <Button size="sm" className="gap-1.5 text-white" style={{ backgroundColor: "#3C594E" }} onClick={() => publishPack(pack)}><Send className="h-3.5 w-3.5" /> Publish</Button>}
                <Button variant="outline" size="icon" className="text-rose-600 hover:bg-rose-50 hover:text-rose-700" aria-label={`Delete ${pack.title}`} onClick={() => removePack(pack)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
