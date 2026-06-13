import { TestimonialsDashboard } from "./testimonials-dashboard";

import prisma from "@/lib/prisma";

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Manage Testimonials</h2>
      </div>

      <TestimonialsDashboard initialTestimonials={testimonials} />
    </div>
  );
}

