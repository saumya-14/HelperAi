import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { pdfUrl } = await req.json();
    if (!pdfUrl) {
      return NextResponse.json({ error: 'Missing pdfUrl' }, { status: 400 });
    }

    // Fetch PDF as ArrayBuffer
    const pdfRes = await fetch(pdfUrl);
    if (!pdfRes.ok) throw new Error(`Failed to fetch PDF: ${pdfRes.status}`);
    const arrayBuffer = await pdfRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Dynamically import pdf-parse at runtime
    // @ts-ignore: dynamically import pdf-parse without types
const { default: parsePdf } = await import('pdf-parse/lib/pdf-parse.js');
    const { text } = await parsePdf(buffer);

    return NextResponse.json({ text });
  } catch (err: any) {
    console.error('Extraction error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}