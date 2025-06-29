import { NextRequest, NextResponse } from 'next/server';

import { Chat } from '../../../lib/database/models/chat.model';
import { connectToDatabase } from '@/lib/database';
import { auth } from '@clerk/nextjs/server';
import User from '@/lib/database/models/user.model';



export async function POST(req: NextRequest) {
  try {
    const {  question, audioUrl, generatedText, translatedText,voiceId } = await req.json();
    if ( !question || !audioUrl || !generatedText || !translatedText || !voiceId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();
     const  { userId } = await auth();
       if (!userId ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
     const user = await User.findOne({ clerkId: userId  });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const chat = await Chat.create({
      userId:user._id,
      question,
      generatedText,
      translatedText,
      voiceId,
      audioUrl,
      audioCreatedAt: new Date(),
    });

    return NextResponse.json({ message: 'Chat saved', chatId: chat._id });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
