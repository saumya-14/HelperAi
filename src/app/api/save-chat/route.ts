import { NextRequest, NextResponse } from 'next/server';

import { Chat } from '../../../lib/database/models/chat.model';
import { connectToDatabase } from '@/lib/database';



export async function POST(req: NextRequest) {
  try {
    const { userId, question, audioUrl, generatedText, translatedText } = await req.json();
    if (!userId || !question || !audioUrl || !generatedText || !translatedText) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();

    const chat = await Chat.create({
      userId,
      question,
      generatedText,
      translatedText,
      audioUrl,
      audioCreatedAt: new Date(),
    });

    return NextResponse.json({ message: 'Chat saved', chatId: chat._id });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
