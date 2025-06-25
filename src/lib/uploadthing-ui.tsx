import { generateUploadDropzone, generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/lib/uploadthing";

// 1️⃣ Dropzone component bound to OurFileRouter
export const UploadDropzone = generateUploadDropzone<OurFileRouter>(
  // only required if your API is not at /api/uploadthing
  /* { url: "/api/custom-uploadthing" } */
);

// 2️⃣ Helpers for custom components
export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();