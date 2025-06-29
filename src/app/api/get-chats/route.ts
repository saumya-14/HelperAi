import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/database';
import User from '@/lib/database/models/user.model';
import { Chat } from '@/lib/database/models/chat.model';

export async function GET(req: NextRequest) {
  try {
    // 1️⃣ Auth
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2️⃣ DB connect & get user
    await connectToDatabase();
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 3️⃣ Get chats
    const chats = await Chat.find({ userId: user._id }).sort({ audioCreatedAt: -1 });

    // 4️⃣ Kick off refresh in background
    refreshOldAudio(chats);

    // 5️⃣ Return current state of chats
    const formatted = chats.map((chat) => ({
      id: chat._id,
      question: chat.question,
      generatedText: chat.generatedText,
      translatedText: chat.translatedText,
      audioUrl: chat.audioUrl,
      timestamp: chat.audioCreatedAt,
     
    }));

    return NextResponse.json({ chats: formatted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 🔁 Fire-and-forget updater
async function refreshOldAudio(chats: any[]) {
  for (const chat of chats) {
    const ageHrs = (Date.now() - new Date(chat.audioCreatedAt).getTime()) / 36e5;
    if (ageHrs >= 72) {
      try {
        const res = await fetch('https://api.murf.ai/v1/speech/generate', {
          method: 'POST',
          headers: {
            'Api-Key': process.env.MURF_API_KEY!,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: chat.translatedText,
            voiceId: chat.voiceId,
          }),
        });

        const data = await res.json();
        if (data.audioFile) {
          chat.audioUrl = data.audioFile;
          chat.audioCreatedAt = new Date();
          await chat.save();
        } else {
          console.warn(`No audioFile returned for chat ${chat._id}`);
        }
      } catch (error) {
        console.error(`Failed to regenerate audio for chat ${chat._id}:`, error);
      }
    }
  }
}
