
import { notFound } from "next/navigation";
import { EditBlogForm } from "./edit-form";

import prisma from "@/lib/prisma";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditBlogPostPage({ params }: PageProps) {
  const resolvedParams = await params;
  const post = await prisma.blogPost.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!post) {
    notFound();
  }

  const categories = await prisma.blogCategory.findMany({
    orderBy: { name: "asc" }
  });

  return <EditBlogForm blogPost={post} categories={categories} />;
}
