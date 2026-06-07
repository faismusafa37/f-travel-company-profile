import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Calendar, User } from "lucide-react";

const prisma = new PrismaClient();

import { getDictionary } from "@/i18n/get-dictionary";
import { Locale } from "@/i18n/i18n-config";

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string, lang: string }> }) {
  const { slug, lang } = await params;
  const dict = await getDictionary(lang as Locale);
  
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!post) {
    notFound();
  }

  return (
    <article className="min-h-screen pb-20">
      <div 
        className="h-[60vh] min-h-[400px] bg-cover bg-center relative"
        style={{ backgroundImage: `url('${post.featuredImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1935&auto=format&fit=crop'}')` }}
      >
        <div className="absolute inset-0 bg-slate-900/60" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full flex flex-col justify-end pb-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block px-3 py-1 mb-6 rounded-full bg-orange-500 text-white text-sm font-semibold tracking-wide uppercase">
              {post.category.name}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>
              <div className="flex items-center justify-center text-slate-300 space-x-6">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(post.createdAt).toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                  })}
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  {dict.blog.author}
                </div>
              </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="max-w-3xl mx-auto prose prose-lg prose-slate prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-orange-600 hover:prose-a:text-orange-700">
          <p className="text-xl text-slate-600 leading-relaxed mb-8 border-l-4 border-orange-500 pl-6 italic">
            {post.excerpt}
          </p>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </div>
    </article>
  );
}
