import { PrismaClient } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const prisma = new PrismaClient();

export const metadata = {
  title: "Blog | F-Travel",
  description: "Read our latest travel guides, tips, and stories.",
};

import { getDictionary } from "@/i18n/get-dictionary";
import { Locale } from "@/i18n/i18n-config";

export default async function BlogPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  const posts = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">{dict.blog.hero.title}</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          {dict.blog.hero.description}
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-10 text-slate-500">
          {dict.blog.empty}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post.id} href={`/${lang}/blog/${post.slug}`}>
              <Card className="overflow-hidden flex flex-col h-full border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div
                  className="h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url('${post.featuredImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1935&auto=format&fit=crop'}')` }}
                />
                <CardContent className="p-6 flex-1 flex flex-col">
                  <div className="text-sm font-medium text-orange-500 mb-2">
                    {post.category.name}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-slate-600 text-sm line-clamp-3">{post.excerpt}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
