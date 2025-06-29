// /api/dubvideo/status.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const { jobId } = await req.json();

    if (!jobId) {
      return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
    }

    const { data } = await axios.get(
      `https://api.murf.ai/v1/murfdub/jobs/${jobId}/status`,
      {
        headers: {
          "api-key": process.env.MURFDUB_API_KEY!,
        },
      }
    );

    if (data.status === "COMPLETED") {
      const downloadUrl = data.download_details?.[0]?.download_url;
      return NextResponse.json({ status: "COMPLETED", downloadUrl });
    }

    if (data.status === "FAILED") {
      return NextResponse.json(
        { status: "FAILED", reason: data.failure_reason || "Unknown error" },
        { status: 500 }
      );
    }

    return NextResponse.json({ status: data.status }); // Still processing
  } catch (err: any) {
    console.error("❌ Status error:", err.response?.data || err.message);
    return NextResponse.json(
      { error: err.response?.data || err.message },
      { status: 500 }
    );
  }
}
