"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createInquiryAction } from "../../actions/inquiries";

const inquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Valid email address is required"),
  phone: z.string().optional().nullable().or(z.literal("")),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormValues = z.infer<typeof inquirySchema>;

export function ContactForm({ dict }: { dict?: any }) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const res = await createInquiryAction(data);
      if (res.success) {
        toast.success(dict?.contact?.form?.success || "Thank you! Your message has been sent successfully.");
        reset();
      } else {
        toast.error(res.error || "Failed to send message.");
      }
    } catch (error) {
      toast.error(dict?.contact?.form?.error || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">{dict?.contact?.form?.name || "Full Name"}</Label>
        <Input 
          id="name" 
          placeholder={dict?.contact?.form?.namePlaceholder || "John Doe"}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-xs text-red-500 font-semibold">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{dict?.contact?.form?.email || "Email Address"}</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder={dict?.contact?.form?.emailPlaceholder || "john@example.com"}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-red-500 font-semibold">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">{dict?.contact?.form?.phone || "Phone Number"}</Label>
        <Input 
          id="phone" 
          type="tel" 
          placeholder={dict?.contact?.form?.phonePlaceholder || "+62 (812) 3456-789"}
          {...register("phone")}
        />
        {errors.phone && (
          <p className="text-xs text-red-500 font-semibold">{errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">{dict?.contact?.form?.message || "Message"}</Label>
        <Textarea 
          id="message" 
          placeholder={dict?.contact?.form?.messagePlaceholder || "Tell us about your dream trip or event..."}
          className="min-h-[120px]" 
          {...register("message")}
        />
        {errors.message && (
          <p className="text-xs text-red-500 font-semibold">{errors.message.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 font-bold" disabled={isLoading}>
        {isLoading ? (dict?.contact?.form?.submitting || "Sending Message...") : (dict?.contact?.form?.submit || "Send Message")}
      </Button>
    </form>
  );
}
