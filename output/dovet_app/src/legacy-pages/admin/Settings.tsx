import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Upload } from 'lucide-react';
import * as Supabase from '@supabase/supabase-js';

function toastSupabaseError(error: unknown, fallback: string) {
    if (error && typeof error === 'object' && 'message' in error) {
      const msg = String((error as Supabase.PostgrestError).message || fallback)
      const details = 'details' in error && (error as Supabase.PostgrestError).details
        ? String((error as Supabase.PostgrestError).details)
        : undefined
      const text = details ? msg + ' — ' + details : msg || fallback
      toast.error(text)
      return
    }
    toast.error(fallback)
  }

interface BrandingSettings {
  name: string;
  brand_color: string;
  logo_url: string | null;
}

export const Settings = () => {
  const [branding, setBranding] = useState<BrandingSettings>({
    name: "",
    brand_color: "#3C594E",
    logo_url: null,
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("dovet_user");
    if(userData) {
        setUser(JSON.parse(userData));
    }
    fetchBranding();
  }, []);

  const fetchBranding = async () => {
    const { data, error } = await supabase.functions.invoke('school-branding', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('dovet_token')}`
      }
    });
    if (!error && data) {
      setBranding({
        name: data.name || "",
        brand_color: data.brand_color || "#3C594E",
        logo_url: data.logo_url || null,
      });
    }
  };

  const handleUpdateBranding = async () => {
    setIsUpdating(true);
    try {
      let finalLogoUrl = branding.logo_url;
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `logo-${Date.now()}.${fileExt}`;
        const filePath = `school-logos/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('school-assets')
          .upload(filePath, logoFile, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) {
          toastSupabaseError(uploadError, "Failed to upload logo to storage");
          setIsUpdating(false);
          return;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('school-assets')
          .getPublicUrl(filePath);
        
        finalLogoUrl = publicUrl;
      }

      const { error } = await supabase.functions.invoke('school-branding', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('dovet_token')}`,
          'x-subdomain': user?.subdomain
        },
        body: {
          name: branding.name,
          brand_color: branding.brand_color,
          logo_url: finalLogoUrl
        }
      });
      
      if (error) {
        toastSupabaseError(error, "Failed to update branding");
      } else {
        toast.success("Branding updated successfully!");
        setLogoFile(null);
        
        // Update local user data
        if (user) {
          const updatedUser = { ...user, schoolName: branding.name || user.schoolName, schoolLogo: finalLogoUrl };
          setUser(updatedUser);
          localStorage.setItem("dovet_user", JSON.stringify(updatedUser));
        }
      }
    } catch (err) {
      toast.error("An error occurred while updating branding");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    try {
      setLogoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setBranding(prev => ({ ...prev, logo_url: previewUrl }));
      toast.success("Logo preview updated. Click 'Save Changes' to apply.");
    } catch {
      toast.error("Failed to process image");
    } finally {
      setIsUploadingLogo(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Academy Branding</h1>
        <p className="text-slate-500 font-bold text-lg">Define your institution's identity.</p>
      </div>

      <Card className="border-0 shadow-2xl rounded-[2.5rem]">
        <CardContent className="p-10 space-y-8">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <Label className="font-black">Academy Name</Label>
              <Input value={branding.name} onChange={(e) => setBranding({...branding, name: e.target.value})} className="h-14 rounded-2xl bg-slate-50 font-bold" />
            </div>
            <div className="space-y-3">
              <Label className="font-black">Brand Color</Label>
              <div className="flex gap-4">
                <Input type="color" value={branding.brand_color} onChange={(e) => setBranding({...branding, brand_color: e.target.value})} className="h-14 w-24 rounded-2xl p-1" />
                <Input value={branding.brand_color} onChange={(e) => setBranding({...branding, brand_color: e.target.value})} className="h-14 flex-1 rounded-2xl bg-slate-50 font-mono font-bold" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="font-black">Official Logo</Label>
            <input type="file" ref={logoInputRef} accept="image/*" onChange={handleLogoUpload} className="hidden" />
            <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center hover:border-primary/40 transition-colors cursor-pointer group" onClick={() => logoInputRef.current?.click()}>
              {isUploadingLogo ? (
                <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
              ) : branding.logo_url ? (
                <div className="space-y-4">
                  <img src={branding.logo_url} alt="Logo" className="h-24 w-auto mx-auto object-contain bg-transparent mix-blend-normal" />
                  <p className="font-black">Click to change logo</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-10 w-10 text-slate-300 mx-auto" />
                  <p className="font-black">Upload logo</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button className="rounded-2xl font-black px-10 h-14" onClick={handleUpdateBranding} disabled={isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
