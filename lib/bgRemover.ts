import { removeBackground } from "@imgly/background-removal";

export async function removeBgAndPreview(
  file: File
): Promise<Blob> {
  try {
    // Step 1: Remove background
    const outputBlob = await removeBackground(file);
    return outputBlob;
  } catch (error) {
    console.error("Background removal failed:", error);
    throw new Error("Failed to process image");
  }
}