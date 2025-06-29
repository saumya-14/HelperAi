import { connectToDatabase } from "@/lib/database";
import { auth } from "@clerk/nextjs/server";
import User from "@/lib/database/models/user.model";
import { DubbedVideo } from "@/lib/database/models/video.model";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const videos = await DubbedVideo.find({ userId: user._id }).sort({ createdAt: -1 });

    const refreshedVideos = await Promise.all(
      videos.map(async (video) => {
        const hoursSinceAudioCreated = (Date.now() - new Date(video.audioCreatedAt).getTime()) / (1000 * 60 * 60);

        // ✅ If audio is older than 72 hours, refresh it
        if (hoursSinceAudioCreated >= 72) {
          console.log(`Refreshing TTS for video: ${video._id}`);

          try {
            const murfRes = await fetch("https://api.murf.ai/v1/speech/generate", {
              method: "POST",
              headers: {
                "Api-Key": process.env.MURF_API_KEY!,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                text: video.translatedText,
                voiceId: video.voiceId,
              }),
            });

            const murfData = await murfRes.json();

            if (murfData?.audioFile) {
              // ✅ Update in DB
              video.audioUrl = murfData.audioFile;
              video.audioCreatedAt = new Date();
              await video.save();
            } else {
              console.warn(`Failed to refresh TTS for video ${video._id}:`, murfData);
            }
          } catch (err) {
            console.error(`TTS refresh error for video ${video._id}:`, err);
          }
        }

        return video;
      })
    );

    return NextResponse.json({ data: refreshedVideos });
  } catch (error: any) {
    console.error("Error fetching videos:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
