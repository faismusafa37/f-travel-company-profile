import { NewBlogForm } from "./new-form";

import prisma from "@/lib/prisma";

export default async function NewBlogPostPage() {
  // Query all blog categories
  const categories = await prisma.blogCategory.findMany({
    orderBy: { name: "asc" }
  });

  return <NewBlogForm categories={categories} />;
}

