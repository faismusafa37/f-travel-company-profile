"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { saveSettingsAction } from "@/app/actions/settings";

const settingsSchema = z.object({
  site_name: z.string().min(2, "Company name is required"),
  contact_email: z.string().email("Invalid email address"),
  phone: z.string().min(2, "Phone number is required"),
  whatsapp: z.string().min(2, "WhatsApp number is required"),
  address: z.string().min(2, "Address is required"),
  seo_description: z.string().min(10, "SEO description must be at least 10 characters"),
  facebook: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
  twitter: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof settingsSchema>;

interface SettingsFormProps {
  settingsMap: Record<string, string>;
}

export function SettingsForm({ settingsMap }: SettingsFormProps) {
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      site_name: settingsMap['site_name'] || "F Travel",
      contact_email: settingsMap['contact_email'] || "hello@ftravel.com",
      phone: settingsMap['phone'] || "+62 812-3456-7890",
      whatsapp: settingsMap['whatsapp'] || "6281234567890",
      address: settingsMap['address'] || "Jakarta, Indonesia",
      seo_description: settingsMap['seo_description'] || "Premium travel experiences for corporate outings, team buildings, and family gatherings.",
      facebook: settingsMap['facebook'] || "",
      instagram: settingsMap['instagram'] || "",
      twitter: settingsMap['twitter'] || "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSaving(true);
    try {
      // Convert key-value schema back to string record
      const record: Record<string, string> = {
        site_name: data.site_name,
        contact_email: data.contact_email,
        phone: data.phone,
        whatsapp: data.whatsapp,
        address: data.address,
        seo_description: data.seo_description,
        facebook: data.facebook || "",
        instagram: data.instagram || "",
        twitter: data.twitter || "",
      };

      const res = await saveSettingsAction(record);
      if (res.success) {
        toast.success("Settings updated successfully");
      } else {
        toast.error(res.error || "Failed to update settings");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Site Settings</h2>
        <Button type="submit" className="bg-orange-500 hover:bg-orange-600 font-bold" disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : "Save All Settings"}
        </Button>
      </div>

      <div className="grid gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>General Information</CardTitle>
            <CardDescription>Update the core identity of your website.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="site_name">Company Name</Label>
                <Input id="site_name" {...register("site_name")} />
                {errors.site_name && (
                  <p className="text-xs text-red-500 font-semibold">{errors.site_name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_email">Primary Email</Label>
                <Input id="contact_email" type="email" {...register("contact_email")} />
                {errors.contact_email && (
                  <p className="text-xs text-red-500 font-semibold">{errors.contact_email.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Contact Details</CardTitle>
            <CardDescription>Information displayed on the contact page and footer.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" {...register("phone")} />
                {errors.phone && (
                  <p className="text-xs text-red-500 font-semibold">{errors.phone.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp Number (e.g. 62812345678)</Label>
                <Input id="whatsapp" {...register("whatsapp")} />
                {errors.whatsapp && (
                  <p className="text-xs text-red-500 font-semibold">{errors.whatsapp.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Physical Address</Label>
              <Textarea id="address" {...register("address")} />
              {errors.address && (
                <p className="text-xs text-red-500 font-semibold">{errors.address.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>SEO & Social Media</CardTitle>
            <CardDescription>Default tags and social links.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="seo_description">Default Meta Description</Label>
              <Textarea id="seo_description" {...register("seo_description")} />
              {errors.seo_description && (
                <p className="text-xs text-red-500 font-semibold">{errors.seo_description.message}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook URL</Label>
                <Input id="facebook" placeholder="https://facebook.com/..." {...register("facebook")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram URL</Label>
                <Input id="instagram" placeholder="https://instagram.com/..." {...register("instagram")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter URL</Label>
                <Input id="twitter" placeholder="https://twitter.com/..." {...register("twitter")} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
