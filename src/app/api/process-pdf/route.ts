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

    // 3️⃣ Try parsing the PDF with pdf-parse
    let extractedText = '';
    try {
      const { default: parsePdf } = await import('pdf-parse/lib/pdf-parse.js');
      const { text } = await parsePdf(buffer);
      extractedText = text.replace(/\s+/g, ' ').trim();
    } catch (err: any) {
      if (err.message?.includes('Command token too long')) {
        return NextResponse.json(
          {
            error:
              'The uploaded PDF is malformed or image-based and cannot be processed. Please upload a clean, text-based PDF.',
          },
          { status: 400 }
        );
      }

      // Unknown parsing error
      throw err;
    }

    if (!extractedText) {
      return NextResponse.json(
        { error: 'No readable text found in the PDF.' },
        { status: 400 }
      );
    }

    // 4️⃣ Generate AI content from the extracted text
    const geminiResponse = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: extractedText,
    });

    const generatedText = (geminiResponse as any).text
      ?.replace(/\s+/g, ' ')
      .trim();

    if (!generatedText) {
      throw new Error('Gemini failed to generate response.');
    }

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
