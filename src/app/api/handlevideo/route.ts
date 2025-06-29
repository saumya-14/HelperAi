import { NextRequest, NextResponse } from 'next/server';
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const { videoUrl } = await req.json();
    
    if (!videoUrl) {
      return NextResponse.json({ error: 'Missing videoUrl' }, { status: 400 });
    }

    // AssemblyAI configuration
    const baseUrl = "https://api.assemblyai.com";
    const headers = {
      authorization: process.env.ASSEMBLYAI_API_KEY || "68a2526184174e8cb396b135582042d8",
    };

    // Start transcription with the video URL from uploadthing
    const data = {
      audio_url: videoUrl, // Use the videoUrl from the request
      speech_model: "universal",
    };

    const url = `${baseUrl}/v2/transcript`;
    const response = await axios.post(url, data, { headers: headers });
    const transcriptId = response.data.id;
    const pollingEndpoint = `${baseUrl}/v2/transcript/${transcriptId}`;

    // Poll for transcription completion
    while (true) {
      const pollingResponse = await axios.get(pollingEndpoint, {
        headers: headers,
      });
      const transcriptionResult = pollingResponse.data;

      if (transcriptionResult.status === "completed") {
        const text = transcriptionResult.text;
        console.log('Transcription completed:', text);
        return NextResponse.json({ text });
      } else if (transcriptionResult.status === "error") {
        throw new Error(`Transcription failed: ${transcriptionResult.error}`);
      } else {
        // Wait 3 seconds before polling again
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }

  } catch (err: any) {
    console.error('Extraction error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}