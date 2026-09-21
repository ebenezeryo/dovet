import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, Palette, Building2, Image, CheckCircle2 } from "lucide-react";

interface BrandingSettings {
  name: string;
  brand_color: string;
  logo_url: string | null;
}

const STORAGE_KEY = "dovet_branding";

function loadBranding(): BrandingSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as BrandingSettings;
  } catch {/* ignore */}
  // Defaults — seeded from the logged-in user if available
  const user = (() => {
    try { return JSON.parse(localStorage.getItem("dovet_user") || "{}"); } catch { return {}; }
  })();
  return {
    name: user.schoolName || "Dovet International Academy",
    brand_color: "#3C594E",
    logo_url: null,
  };
}

function saveBranding(b: BrandingSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(b));
  // Also keep the user record in sync so sidebars refresh
  try {
    const raw = localStorage.getItem("dovet_user");
    if (raw) {
      const user = JSON.parse(raw);
      user.schoolName = b.name;
      user.brandColor = b.brand_color;
      user.schoolLogo = b.logo_url;
      localStorage.setItem("dovet_user", JSON.stringify(user));
    }
  } catch {/* ignore */}
}

/** Inject / update the brand CSS variable on the document root so the colour
 *  change is visible immediately without a reload. */
function applyBrandColor(hex: string) {
  // Convert hex → rough oklch-compatible inline CSS variable override
  document.documentElement.style.setProperty("--primary", hex);
  document.documentElement.style.setProperty("--ring", hex);
  document.documentElement.style.setProperty("--sidebar-primary", hex);
  document.documentElement.style.setProperty("--sidebar-ring", hex);
}

export const SettingsPage = () => {
  const [branding, setBranding] = useState<BrandingSettings>(loadBranding);
  const [saved, setSaved] = useState<BrandingSettings>(loadBranding);
  const [isSaving, setIsSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(loadBranding().logo_url);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Apply stored brand colour on mount
  useEffect(() => {
    applyBrandColor(saved.brand_color);
  }, []);

  const isDirty =
    branding.name !== saved.name ||
    branding.brand_color !== saved.brand_color ||
    logoPreview !== saved.logo_url;

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setLogoPreview(url);
      setBranding((prev) => ({ ...prev, logo_url: url }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!branding.name.trim()) {
      toast.error("Academy name cannot be empty.");
      return;
    }
    setIsSaving(true);
    // Simulate a brief async save (localStorage is synchronous but UX needs feedback)
    await new Promise((r) => setTimeout(r, 600));

    const toSave: BrandingSettings = {
      name: branding.name.trim(),
      brand_color: branding.brand_color,
      logo_url: logoPreview,
    };

    saveBranding(toSave);
    applyBrandColor(toSave.brand_color);
    setSaved(toSave);
    setBranding(toSave);
    setIsSaving(false);
    toast.success("Branding saved and applied!");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "#0D0D0D" }}>
          Settings &amp; Branding
        </h1>
        <p className="text-sm mt-1" style={{ color: "#5a6a65" }}>
          Customise your school's name, colours, and logo. Changes apply immediately.
        </p>
      </div>

      {/* ── Academy Name ─────────────────────────────────────────────────── */}
      <Card className="border border-slate-200/70 shadow-sm rounded-3xl bg-white">
        <CardContent className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#eaf1ef", color: "#3C594E" }}>
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: "#0D0D0D" }}>Academy Name</p>
              <p className="text-xs" style={{ color: "#5a6a65" }}>Displayed everywhere students and parents see your school</p>
            </div>
          </div>
          <Input
            value={branding.name}
            onChange={(e) => setBranding((p) => ({ ...p, name: e.target.value }))}
            placeholder="Enter school or academy name"
            className="rounded-xl h-11 text-sm bg-[#F2F2F2] border-slate-200"
          />
        </CardContent>
      </Card>

      {/* ── Brand Colour ──────────────────────────────────────────────────── */}
      <Card className="border border-slate-200/70 shadow-sm rounded-3xl bg-white">
        <CardContent className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#eaf1ef", color: "#3C594E" }}>
              <Palette className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: "#0D0D0D" }}>Brand Colour</p>
              <p className="text-xs" style={{ color: "#5a6a65" }}>Sets button colours, active states, and progress bars across the app</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Colour swatch picker */}
            <label className="cursor-pointer shrink-0">
              <div
                className="h-14 w-14 rounded-2xl border-2 border-white shadow-md ring-1 ring-slate-200 transition-transform hover:scale-105"
                style={{ backgroundColor: branding.brand_color }}
              />
              <input
                type="color"
                value={branding.brand_color}
                onChange={(e) => setBranding((p) => ({ ...p, brand_color: e.target.value }))}
                className="sr-only"
              />
            </label>

            {/* Hex text input */}
            <Input
              value={branding.brand_color}
              onChange={(e) => {
                const val = e.target.value;
                // Accept any value being typed; preview colour swatch live
                setBranding((p) => ({ ...p, brand_color: val }));
              }}
              maxLength={7}
              placeholder="#3C594E"
              className="rounded-xl h-11 flex-1 font-mono text-sm bg-[#F2F2F2] border-slate-200 uppercase"
            />

            {/* Live preview pill */}
            <div
              className="h-11 px-5 rounded-xl flex items-center text-sm font-semibold text-white shrink-0 shadow-sm"
              style={{ backgroundColor: branding.brand_color }}
            >
              Preview
            </div>
          </div>

          {/* Preset swatches */}
          <div className="space-y-2">
            <p className="text-xs font-semibold" style={{ color: "#5a6a65" }}>Quick presets</p>
            <div className="flex gap-2 flex-wrap">
              {[
                { label: "Forest", hex: "#3C594E" },
                { label: "Slate", hex: "#334155" },
                { label: "Navy",  hex: "#1e3a5f" },
                { label: "Plum",  hex: "#6B3FA0" },
                { label: "Rust",  hex: "#BF8360" },
                { label: "Crimson", hex: "#B91C1C" },
              ].map((swatch) => (
                <button
                  key={swatch.hex}
                  type="button"
                  title={swatch.label}
                  onClick={() => setBranding((p) => ({ ...p, brand_color: swatch.hex }))}
                  className="group relative h-8 w-8 rounded-xl border-2 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-1"
                  style={{
                    backgroundColor: swatch.hex,
                    borderColor: branding.brand_color === swatch.hex ? "#0D0D0D" : "transparent",
                  }}
                >
                  {branding.brand_color === swatch.hex && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-white absolute inset-0 m-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Logo ─────────────────────────────────────────────────────────── */}
      <Card className="border border-slate-200/70 shadow-sm rounded-3xl bg-white">
        <CardContent className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#eaf1ef", color: "#3C594E" }}>
              <Image className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: "#0D0D0D" }}>Official Logo</p>
              <p className="text-xs" style={{ color: "#5a6a65" }}>PNG or SVG recommended. Shown in the sidebar and reports.</p>
            </div>
          </div>

          <input
            type="file"
            ref={logoInputRef}
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            onChange={handleLogoChange}
            className="hidden"
          />

          <div
            onClick={() => logoInputRef.current?.click()}
            className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all"
            style={{ borderColor: "#c8dcd5", backgroundColor: "#f7faf9" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#3C594E")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#c8dcd5")}
          >
            {logoPreview ? (
              <div className="space-y-3">
                <img
                  src={logoPreview}
                  alt="School logo preview"
                  className="h-20 w-auto mx-auto object-contain rounded-lg"
                />
                <p className="text-xs font-semibold" style={{ color: "#3C594E" }}>Click to replace logo</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="h-12 w-12 rounded-2xl mx-auto flex items-center justify-center" style={{ backgroundColor: "#eaf1ef", color: "#3C594E" }}>
                  <Upload className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold" style={{ color: "#0D0D0D" }}>Click to upload logo</p>
                <p className="text-xs" style={{ color: "#5a6a65" }}>PNG, SVG, WEBP · max 2 MB</p>
              </div>
            )}
          </div>

          {logoPreview && (
            <button
              type="button"
              onClick={() => { setLogoPreview(null); setBranding((p) => ({ ...p, logo_url: null })); }}
              className="text-xs font-semibold text-rose-500 hover:underline"
            >
              Remove logo
            </button>
          )}
        </CardContent>
      </Card>

      {/* ── Save bar ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between bg-white border border-slate-200/70 rounded-2xl px-6 py-4 shadow-sm">
        <p className="text-xs font-medium" style={{ color: isDirty ? "#BF8360" : "#5a6a65" }}>
          {isDirty ? "You have unsaved changes." : "All changes saved."}
        </p>
        <Button
          onClick={handleSave}
          disabled={isSaving || !isDirty}
          className="rounded-xl font-semibold text-sm px-8 h-11 text-white shadow-sm disabled:opacity-40"
          style={{ backgroundColor: "#3C594E" }}
        >
          {isSaving ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…</>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  );
};
