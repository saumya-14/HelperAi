import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import { ExplainJob } from '@/lib/database/models/pdfstatus.model';


export async function GET(req: NextRequest) {
  const jobId = req.nextUrl.searchParams.get('jobId');
  if (!jobId) return NextResponse.json({ error: 'Missing jobId' }, { status: 400 });

  await connectToDatabase();
  const job = await ExplainJob.findById(jobId);
  if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });

  return NextResponse.json({
    status: job.status,
    error: job.error,
    extractedText: job.extractedText,
    generatedText: job.generatedText,
    translatedText: job.translatedText,
    audioUrl: job.audioUrl,
  });
}