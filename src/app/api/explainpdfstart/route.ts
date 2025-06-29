import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/database';
import User from '@/lib/database/models/user.model';
import { ExplainJob } from '@/lib/database/models/pdfstatus.model';
import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: Request) {
  const { pdfUrl, targetLanguage, voiceId } = await req.json();
  if (!pdfUrl || !targetLanguage || !voiceId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectToDatabase();
  const user = await User.findOne({ clerkId: userId });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const job = await ExplainJob.create({
    userId: user._id.toString(),
    pdfUrl,
    targetLanguage,
    voiceId,
    status: 'pending',
  });

  void processExplainJob(job._id as any);

  return NextResponse.json({ jobId: job._id});
}

async function processExplainJob(jobId: string) {
  await connectToDatabase();
  const job = await ExplainJob.findById(jobId);
  if (!job) return;

  try {
    // Fetch and buffer the PDF
    const pdfRes = await fetch(job.pdfUrl);
    if (!pdfRes.ok) throw new Error(`PDF download failed: ${pdfRes.status}`);
    const arrayBuffer = await pdfRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ✅ Import pdf-parse dynamically (inside function)
    const { default: pdfParse } = await import('pdf-parse');
    const { text: rawText } = await pdfParse(buffer);
    const extractedText = rawText.replace(/\s+/g, ' ').trim();

    // Generate content from Gemini
    const aiRes = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: extractedText,
    });

    const rawGeneratedText = aiRes.text;
    if (!rawGeneratedText) throw new Error('AI did not return any content');
    const generatedText = rawGeneratedText.replace(/\s+/g, ' ').trim();

    // Translate via Murf
    const translateRes = await fetch('https://api.murf.ai/v1/text/translate', {
      method: 'POST',
      headers: {
        'Api-Key': process.env.MURF_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        targetLanguage: job.targetLanguage,
        texts: [generatedText],
      }),
    });

    const translateData = await translateRes.json();
    const translatedText = translateData.translations?.[0]?.translated_text;
    if (!translatedText) throw new Error('Translation failed');

    // Generate speech via Murf
    const speechRes = await fetch('https://api.murf.ai/v1/speech/generate', {
      method: 'POST',
      headers: {
        'Api-Key': process.env.MURF_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: translatedText,
        voiceId: job.voiceId,
      }),
    });

    const speechData = await speechRes.json();
    if (!speechData.audioFile) throw new Error('Speech generation failed');

    // Save all results to job
    job.extractedText = extractedText;
    job.generatedText = generatedText;
    job.translatedText = translatedText;
    job.audioUrl = speechData.audioFile;
    job.status = 'completed';
    await job.save();
  } catch (err: any) {
    job.status = 'failed';
    job.error = err.message;
    await job.save();
  }
}
