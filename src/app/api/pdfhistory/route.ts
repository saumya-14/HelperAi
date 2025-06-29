// app/api/pdf-history/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/database';
import User from '@/lib/database/models/user.model';
import { PDF } from '@/lib/database/models/pdf.model';

export async function GET(req: NextRequest) {
  try {
    // 1️⃣ Clerk auth
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2️⃣ DB connect & user lookup
    await connectToDatabase();
    const user = await User.findOne({ clerkId });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 3️⃣ Fetch PDFs (lean for speed)
    const records = await PDF.find({ userId: user._id })
      .sort({ audioCreatedAt: -1 })
      .lean();

    // 4️⃣ Kick off background refresh for any >72 hrs old
    void refreshStaleAudio(records);

    // 5️⃣ Shape response immediately
    const history = records.map(r => ({
      id:                 r._id.toString(),
      pdfUrl:             r.pdfUrl,
      generatedText:      r.generatedText,
      translatedText:     r.translatedText,
      translatedLanguage: r.translatedlanguage,
      audioUrl:           r.audioUrl,
      timestamp:          r.audioCreatedAt,
    }));

    return NextResponse.json({ history }, { status: 200 });
  } catch (err: any) {
    console.error('[PDF_HISTORY_ERROR]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ———————————————
// Fire‑and‑forget refresh helper
// ———————————————
async function refreshStaleAudio(records: Array<any>) {
  const THRESHOLD_MS = 72 * 60 * 60 * 1000; // 72 hours
  for (const rec of records) {
    const age = Date.now() - new Date(rec.audioCreatedAt).getTime();
    if (age < THRESHOLD_MS) continue;

    // regenerate in background
    regenerateAudio(rec._id, rec.translatedText, rec.voiceId).catch(err => {
      console.error(`Failed to refresh audio for PDF ${rec._id}:`, err);
    });
  }
}

async function regenerateAudio(
  docId: string,
  translatedText: string,
  voiceId: string
) {
  // call Murf TTS
  const res = await fetch('https://api.murf.ai/v1/speech/generate', {
    method: 'POST',
    headers: {
      'Api-Key': process.env.MURF_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: translatedText, voiceId }),
  });
  if (!res.ok) {
    throw new Error(`Murf error ${res.status}`);
  }
  const { audioFile } = await res.json();
  if (!audioFile) throw new Error('No audioFile in response');

  // update only that document
  await PDF.findByIdAndUpdate(docId, {
    audioUrl:       audioFile,
    audioCreatedAt: new Date(),
  });
}
