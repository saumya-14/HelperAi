import { createUploadthing, type FileRouter } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  uploadMedia: f({
    pdf: { maxFileSize: "16MB" },
    video: { maxFileSize: "512MB" },
  }).onUploadComplete(async ({ file, metadata }) => {
  
    console.log("Upload complete:", file);

  
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
