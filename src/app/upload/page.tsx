"use client";
import { UploadDropzone } from "@/lib/uploadthing-ui";
import { useState } from "react";

export default function UploadPage() {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Upload a PDF</h1>
      <UploadDropzone
        endpoint="pdfUploader"
        onClientUploadComplete={(files) => {
          // files is an array of uploaded files
          const url = files[0]?.url;
          if (url) setUploadedUrl(url);
        }}
        onUploadError={(error) => {
          console.error("Upload error:", error);
        }}
        className="border-dashed border-2 border-gray-300 p-4 rounded"
      />

    </div>
  );
}