// utils/uploadFile.ts

import axios from "axios";

export async function uploadFileToUploadThing(buffer: Buffer, filename: string) {
  const fileType = "video/mp4";
  const fileSize = buffer.length;

  // 1️⃣ Get presigned URL from UploadThing
  const presignRes = await axios.post(
    "https://uploadthing.com/api/presigned-url",
    {
      files: [
        {
          name: filename,
          size: fileSize,
          type: fileType,
        },
      ],
      route: "uploadMedia", // Must match your router key in `ourFileRouter`
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.UPLOADTHING_SECRET}`, // 🔐 create this secret key in your env
        "Content-Type": "application/json",
      },
    }
  );

  const { url, fileKey } = presignRes.data[0];

  // 2️⃣ Upload file to UploadThing
  await axios.put(url, buffer, {
    headers: {
      "Content-Type": fileType,
    },
  });

  return {
    fileKey,
    url: `https://utfs.io/f/${fileKey}`,
  };
}
