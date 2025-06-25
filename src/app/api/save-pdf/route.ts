import { NextRequest, NextResponse } from 'next/server';
import { PDF } from '@/lib/database/models/pdf.model';
import { connectToDatabase } from '@/lib/database'; // Ensure this connects to MongoDB

export async function POST(req: NextRequest) {
  try {
    const { userId, pdfUrl, generatedText, translatedText, audioUrl, audioCreatedAt } = await req.json();

    if (!userId || !pdfUrl || !generatedText || !translatedText || !audioUrl ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();

    const savedPDF = await PDF.create({
      userId,
      pdfUrl,
      generatedText,
      translatedText,
      audioUrl,
      audioCreatedAt: new Date(),
    });

    return NextResponse.json({ message: 'PDF record saved', id: savedPDF._id }, { status: 201 });
  } catch (error: any) {
    console.error('[SAVE_PDF_ERROR]', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
