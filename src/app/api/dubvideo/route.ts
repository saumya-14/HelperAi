import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import FormData from "form-data";
import https from "https";
import fs from "fs";

export async function POST(req: NextRequest) {
  try {
    const { fileUrl, fileName = "video.mp4", targetLocales } = await req.json();

    if (!fileUrl) {
      return NextResponse.json({ error: "Missing fileUrl" }, { status: 400 });
    }

    // Download to /tmp
    const tempPath = `/tmp/${fileName}`;
    const writer = fs.createWriteStream(tempPath);
    await new Promise<void>((res, rej) => {
      https.get(fileUrl, (r) => {
        r.pipe(writer);
        writer.on("finish", () => res());
        writer.on("error", rej);
      });
    });

    // Build form
    const form = new FormData();
    form.append("file", fs.createReadStream(tempPath), fileName);
    form.append("file_name", fileName);
    form.append("priority", "LOW");
    // ensure it's an array
    const locales: string[] = Array.isArray(targetLocales)
      ? targetLocales
      : [targetLocales];
    for (const loc of locales) {
      form.append("target_locales", loc);
    }

    // Debug logs (remove in prod)
    console.log("🔑 Key:", process.env.MURFDUB_API_KEY);
    console.log("🌍 Locales:", locales);
    console.log("📑 Headers:", form.getHeaders());

    // Create job
    const createJobRes = await axios.post(
      "https://api.murf.ai/v1/murfdub/jobs/create",
      form,
      {
        headers: {
          ...form.getHeaders(),   // ← <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
          "api-key": process.env.MURFDUB_API_KEY!,
        },
      }
    );

    const jobId = createJobRes.data.job_id;
    if (!jobId) throw new Error("No job ID returned");

    // Poll status
    let final: any = null;
    for (let i = 0; i < 10; i++) {
      const { data } = await axios.get(
        `https://api.murf.ai/v1/murfdub/jobs/${jobId}/status`,
        { headers: { "api-key": process.env.MURFDUB_API_KEY! } }
      );
      if (data.status === "COMPLETED") {
        final = data;
        break;
      } else if (data.status === "FAILED") {
        throw new Error(data.failure_reason || "Dub failed");
      }
      await new Promise((r) => setTimeout(r, 5000));
    }
    if (!final) {
      return NextResponse.json({ error: "Timed out" }, { status: 504 });
    }

    const downloadUrl = final.download_details?.[0]?.download_url;
    return NextResponse.json({ downloadUrl, jobId });
  } catch (err: any) {
    console.error("❌ Murf error:", err.response?.data || err.message);
    return NextResponse.json(
      { error: err.response?.data || err.message },
      { status: err.response?.status || 500 }
    );
  }
}
