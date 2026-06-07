"use server";

import { uploadImage } from "@/lib/s3";

export async function uploadImageAction(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "No file provided" };
    }
    const url = await uploadImage(file);
    return { success: true, url };
  } catch (error) {
    console.error("Server upload action error:", error);
    return { success: false, error: "Failed to upload image" };
  }
}
