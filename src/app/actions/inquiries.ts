"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

const inquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Valid email address is required"),
  phone: z.string().optional().nullable(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function createInquiryAction(data: z.infer<typeof inquirySchema>) {
  try {
    const parsed = inquirySchema.parse(data);
    const inq = await prisma.contactInquiry.create({
      data: {
        name: parsed.name,
        email: parsed.email,
        phone: parsed.phone,
        message: parsed.message,
        status: "NEW"
      }
    });

    // Send email using nodemailer
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      // Fetch the site setting for the recipient email if needed, or default to an env var
      const settings = await prisma.siteSetting.findMany({
        where: { key: 'contact_email' }
      });
      const toEmail = settings[0]?.value || process.env.CONTACT_EMAIL || "hello@ftravel.com";

      await transporter.sendMail({
        from: `"${parsed.name}" <${process.env.SMTP_USER || "no-reply@ftravel.com"}>`,
        replyTo: parsed.email,
        to: toEmail,
        subject: `New Contact Inquiry from ${parsed.name}`,
        text: `You have received a new inquiry.\n\nName: ${parsed.name}\nEmail: ${parsed.email}\nPhone: ${parsed.phone || "N/A"}\n\nMessage:\n${parsed.message}`,
        html: `
        <!DOCTYPE html>
        <html>
        <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 0; color: #334155; }
          .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
          .banner { background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%); padding: 40px 30px; border-bottom: 1px solid #fed7aa; position: relative; }
          .logo { max-height: 40px; margin-bottom: 20px; }
          .banner-title { font-size: 28px; font-weight: 900; color: #0f172a; margin: 0; line-height: 1.2; text-transform: uppercase; letter-spacing: -0.5px; }
          .banner-title span { color: #ea580c; }
          .banner-subtitle { font-size: 14px; color: #64748b; margin-top: 10px; }
          
          .content { padding: 40px 30px; }
          .greeting { font-size: 18px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 15px; }
          .intro { font-size: 15px; line-height: 1.6; margin-bottom: 25px; color: #475569; }
          
          .highlight-box { background-color: #fff7ed; border-left: 4px solid #ea580c; border-radius: 4px; padding: 15px 20px; margin-bottom: 30px; font-size: 15px; color: #1e293b; font-weight: 500; }
          
          .section-title { font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 15px; }
          
          .card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 15px; display: table; width: 100%; box-sizing: border-box; }
          .card-num { display: table-cell; width: 40px; font-size: 24px; font-weight: 800; color: #ea580c; vertical-align: top; }
          .card-content { display: table-cell; vertical-align: top; }
          .card-title { font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 5px 0; }
          .card-text { font-size: 14px; color: #64748b; margin: 0; line-height: 1.5; }
          .card-text b { color: #334155; }
          
          .btn-container { text-align: center; margin: 35px 0; }
          .btn { background-color: #ea580c; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 30px; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(234, 88, 12, 0.3); }
          
          .tip-box { border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px 20px; background-color: #f8fafc; font-size: 13px; color: #64748b; line-height: 1.5; display: table; width: 100%; box-sizing: border-box; }
          .tip-icon { display: table-cell; width: 25px; font-size: 16px; vertical-align: top; }
          .tip-text { display: table-cell; vertical-align: top; }
          .tip-text b { color: #0f172a; }
          
          .signoff { margin-top: 35px; font-size: 15px; color: #475569; line-height: 1.6; }
          
          .footer { background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0; }
          .footer-links { margin-bottom: 20px; }
          .footer-links a { color: #ea580c; text-decoration: none; font-size: 13px; font-weight: 600; margin: 0 10px; }
          .footer-tagline { font-size: 14px; font-weight: 700; color: #ea580c; margin-bottom: 10px; }
          .footer-copy { font-size: 12px; color: #94a3b8; margin: 0; }
        </style>
        </head>
        <body>
          <div class="container">
            <!-- Banner -->
            <div class="banner">
              <img src="https://f-travel.id/logo.png" alt="F-Travel Logo" class="logo" />
              <h1 class="banner-title">NEW INQUIRY, <br><span>RECEIVED.</span></h1>
              <p class="banner-subtitle">F-Travel automated notification system.</p>
            </div>
            
            <!-- Body Content -->
            <div class="content">
              <h2 class="greeting">Hi Admin,</h2>
              <p class="intro">A new contact inquiry has been submitted on the F-Travel platform. Here are the details you need to know.</p>
              
              <div class="highlight-box">
                You have a new message from <b>${parsed.name}</b>. Please review the details below.
              </div>
              
              <h3 class="section-title">Here's the inquiry breakdown:</h3>
              
              <!-- Card 01 -->
              <div class="card">
                <div class="card-content">
                  <h4 class="card-title">Contact Details</h4>
                  <p class="card-text">
                    <b>Name:</b> ${parsed.name}<br>
                    <b>Email:</b> <a href="mailto:${parsed.email}" style="color: #ea580c; text-decoration: none;">${parsed.email}</a><br>
                    <b>Phone:</b> ${parsed.phone || "N/A"}
                  </p>
                </div>
              </div>
              
              <!-- Card 02 -->
              <div class="card">
                <div class="card-content">
                  <h4 class="card-title">Message Content</h4>
                  <p class="card-text">
                    ${parsed.message.replace(/\n/g, '<br/>')}
                  </p>
                </div>
              </div>
              
              <!-- CTA Button -->
              <div class="btn-container">
                <a href="mailto:${parsed.email}?subject=Re: Your Inquiry at F-Travel" class="btn">Reply to ${parsed.name}</a>
              </div>
              
              <!-- Pro Tip -->
              <div class="tip-box">
                <div class="tip-icon">💡</div>
                <div class="tip-text">
                  <b>Pro Tip:</b> The faster you respond, the higher the chances of conversion. Try to reply to new inquiries within 2-4 hours to provide the best premium experience.
                </div>
              </div>
              
              <!-- Signoff -->
              <div class="signoff">
                Warm regards,<br>
                <b>The F-Travel Team</b>
              </div>
            </div>
            
            <!-- Footer -->
            <div class="footer">
              <div class="footer-links">
                <a href="${process.env.NEXTAUTH_URL}/admin/inquiries">Go to Dashboard</a> | 
                <a href="${process.env.NEXTAUTH_URL}">Visit Website</a>
              </div>
              <div class="footer-tagline">#FindYourExperience</div>
              <p class="footer-copy">&copy; ${new Date().getFullYear()} F-Travel. All rights reserved.<br>You're receiving this email because you are registered as an admin.</p>
            </div>
          </div>
        </body>
        </html>
        `,
        attachments: [{
          filename: 'logo.png',
          path: process.cwd() + '/public/logo.png',
          cid: 'ftravel-logo'
        }]
      });
      console.log("Email sent successfully.");
    } catch (emailError) {
      console.error("Failed to send email. Please check SMTP configuration:", emailError);
      // We don't fail the entire action if email fails, as the inquiry is already saved.
    }

    revalidatePath("/admin");
    revalidatePath("/admin/inquiries");
    return { success: true, inquiry: inq };
  } catch (error) {
    console.error("Create inquiry error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Failed to send message. Please try again." };
  }
}

export async function deleteInquiryAction(id: string) {
  try {
    await prisma.contactInquiry.delete({
      where: { id }
    });

    revalidatePath("/admin");
    revalidatePath("/admin/inquiries");
    return { success: true };
  } catch (error) {
    console.error("Delete inquiry error:", error);
    return { success: false, error: "Failed to delete inquiry" };
  }
}

export async function markInquiryReadAction(id: string) {
  try {
    await prisma.contactInquiry.update({
      where: { id },
      data: { status: "READ" }
    });

    revalidatePath("/admin");
    revalidatePath("/admin/inquiries");
    return { success: true };
  } catch (error) {
    console.error("Update inquiry status error:", error);
    return { success: false, error: "Failed to update inquiry status" };
  }
}
