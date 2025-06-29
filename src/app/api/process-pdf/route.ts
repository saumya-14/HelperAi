// app/api/process-pdf/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Parse body
    const { pdfUrl, targetLanguage, voiceId } = await req.json();
    if (!pdfUrl || !targetLanguage || !voiceId) {
      return NextResponse.json(
        { error: 'Missing pdfUrl, targetLanguage or voiceId' },
        { status: 400 }
      );
    }

    // 2️⃣ Fetch PDF bytes from the signed URL
    const pdfRes = await fetch(pdfUrl);
    if (!pdfRes.ok) {
      throw new Error(`Failed to fetch PDF: ${pdfRes.status}`);
    }
    const arrayBuffer = await pdfRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3️⃣ Dynamically import pdf-parse at runtime (avoids bundling its tests)
  const { default: parsePdf } = await import('pdf-parse/lib/pdf-parse.js');
   const { text } = await parsePdf(buffer);
  const extractedText = text
      .replace(/\s+/g, ' ')   // turns any whitespace (including newlines) into single spaces
      .trim();
    // 4️⃣ Generate AI content from the extracted text
    const geminiResponse = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: extractedText,
    });
    const Text :any = geminiResponse.text;
    const generatedText = Text
      .replace(/\s+/g, ' ')   // turns any whitespace (including newlines) into single spaces
      .trim();

    // 5️⃣ Translate the generated text via Murf
    const translateRes = await fetch(
      'https://api.murf.ai/v1/text/translate',
      {
        method: 'POST',
        headers: {
          'Api-Key': process.env.MURF_API_KEY!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetLanguage,
          texts: [generatedText],
        }),
      }
    );
    const translateData = await translateRes.json();
    const translatedText = translateData.translations?.[0]?.translated_text;
    if (!translatedText) {
      throw new Error('Translation failed');
    }

    // 6️⃣ Generate speech from the translated text via Murf
    const speechRes = await fetch(
      'https://api.murf.ai/v1/speech/generate',
      {
        method: 'POST',
        headers: {
          'Api-Key': process.env.MURF_API_KEY!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: translatedText,
          voiceId,
        }),
      }
    );
    const speechData = await speechRes.json();
    const audioUrl = speechData.audioFile;
    if (!audioUrl) {
      throw new Error('Speech generation failed');
    }

    // 7️⃣ Return the full pipeline result
    return NextResponse.json(
      { extractedText, generatedText, translatedText, audioUrl },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('Error in /api/process-pdf:', err);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
