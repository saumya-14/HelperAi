import { connectToDatabase } from "@/lib/database";
import User from "@/lib/database/models/user.model";
import { DubbedVideo } from "@/lib/database/models/video.model";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";



export async function POST(req: Request) {
  try {
    await connectToDatabase();
     const  { userId } = await auth();
if (!userId ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
     const user = await User.findOne({ clerkId: userId  });
       if (!user) {
           return NextResponse.json({ error: 'User not found' }, { status: 404 });
         }
    const body = await req.json();

    const {
    
      originalVideoUrl,
      dubbedVideoUrl,
      extractedText,
      generatedText,
      translatedText,
      audioUrl,
      voiceId,
      locale,
    } = body;

    if (
      !originalVideoUrl || !dubbedVideoUrl || !extractedText ||
      !generatedText || !translatedText || !audioUrl || !voiceId || !locale
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
 
    const audioCreatedAt = new Date(); 

    const newEntry = await DubbedVideo.create({
      userId:user._id,
      originalVideoUrl,
      dubbedVideoUrl,
      extractedText,
      generatedText,
      translatedText,
      audioUrl,
      audioCreatedAt,
      voiceId,
      locale,
    });

    return NextResponse.json({ message: "Saved successfully", id: newEntry._id });
  } catch (error: any) {
    console.error("Error saving dubbed video:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
