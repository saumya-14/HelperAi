// /api/dubvideo/start.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import FormData from "form-data";
import https from "https";
import fs from "fs";

export async function POST(req: NextRequest) {
  try {
    const { fileUrl, fileName = "video.mp4", targetLocales } = await req.json();

    const tempPath = `/tmp/${fileName}`;
    const writer = fs.createWriteStream(tempPath);
    await new Promise<void>((res, rej) => {
      https.get(fileUrl, (r) => {
        r.pipe(writer);
        writer.on("finish", res);
        writer.on("error", rej);
      });
    });

    const form = new FormData();
    form.append("file", fs.createReadStream(tempPath), fileName);
    form.append("file_name", fileName);
    form.append("priority", "LOW");

    const locales: string[] = Array.isArray(targetLocales)
      ? targetLocales
      : [targetLocales];
    for (const loc of locales) {
      form.append("target_locales", loc);
    }

    const createJobRes = await axios.post(
      "https://api.murf.ai/v1/murfdub/jobs/create",
      form,
      {
        headers: {
          ...form.getHeaders(),
          "api-key": process.env.MURFDUB_API_KEY!,
        },
      }
    );

    const jobId = createJobRes.data.job_id;
    return NextResponse.json({ jobId });
  } catch (err: any) {
    console.error("❌ Error starting job:", err.response?.data || err.message);
    return NextResponse.json(
      { error: err.response?.data || err.message },
      { status: 500 }
    );
  }
}
