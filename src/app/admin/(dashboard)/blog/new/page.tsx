import { PrismaClient } from "@prisma/client";
import { NewBlogForm } from "./new-form";

const prisma = new PrismaClient();

export default async function NewBlogPostPage() {
  // Query all blog categories
  const categories = await prisma.blogCategory.findMany({
    orderBy: { name: "asc" }
  });

  return <NewBlogForm categories={categories} />;
}
