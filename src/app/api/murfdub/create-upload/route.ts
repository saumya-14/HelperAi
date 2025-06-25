import { NextRequest, NextResponse } from "next/server";
import formidable from "formidable";
import streamifier from "streamifier";
import { IncomingMessage } from "http";
import fs from "fs";
import FormData from "form-data";
import axios from "axios";

export const config = {
  api: { bodyParser: false, externalResolver: true },
  runtime: "nodejs",
};

// Convert NextRequest to Node IncomingMessage for formidable
async function reqToIncoming(req: NextRequest): Promise<IncomingMessage> {
  const reader = req.body?.getReader();
  if (!reader) throw new Error("No request body");
  const bufs: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bufs.push(value);
  }
  const buffer = Buffer.concat(bufs);
  return Object.assign(streamifier.createReadStream(buffer), {
    headers: Object.fromEntries(req.headers.entries()),
    method: req.method,
    url: req.url,
  }) as unknown as IncomingMessage;
}

// Parse uploaded video file and return temp path
async function parseUpload(req: NextRequest): Promise<string> {
  const form = formidable({ uploadDir: "/tmp", keepExtensions: true });
  const nodeReq = await reqToIncoming(req);
  return new Promise((resolve, reject) => {
    form.parse(nodeReq, (err, _fields, files) => {
      if (err) return reject(err);
      const upload = (files as any).file;
      const file = Array.isArray(upload) ? upload[0] : upload;
      if (!file?.filepath) return reject("No file uploaded");
      resolve(file.filepath);
    });
  });
}

// Sends a local file to Murf, polls for completion, returns URL
async function getDubbedUrlFromPath(path: string, locale = "fr_FR"): Promise<string> {
  const form = new FormData();
  const stream = fs.createReadStream(path);
  form.append("file", stream, { filename: "input.mp4", contentType: "video/mp4" });
  form.append("file_name", "input.mp4");
  form.append("priority", "LOW");
  form.append("target_locales", locale);

  const res = await axios.post(
    "https://api.murf.ai/v1/murfdub/jobs/create",
    form,
    { headers: { ...form.getHeaders(), "api-key": process.env.MURFDUB_API_KEY! } }
  );
  const jobId: string = res.data.job_id;

  // Poll until complete
  let downloadUrl = "";
  while (true) {
    await new Promise((r) => setTimeout(r, 5000));
    const status = await axios.get(
      `https://api.murf.ai/v1/murfdub/jobs/${jobId}/status`,
      { headers: { "api-key": process.env.MURFDUB_API_KEY! } }
    );
    if (status.data.status === "COMPLETED") {
      downloadUrl = status.data.download_details[0].download_url;
      break;
    }
    if (status.data.status === "FAILED") {
      throw new Error("Murf failed: " + status.data.failure_reason);
    }
  }

  return downloadUrl;
}

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ parse multipart form-data upload
    const tempPath = await parseUpload(req);

    // 2️⃣ send to Murf and get dubbed video URL
    const dubbedUrl = await getDubbedUrlFromPath(tempPath);

    // 3️⃣ respond with the Murf URL
    return NextResponse.json({ dubbedVideoUrl: dubbedUrl });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}
