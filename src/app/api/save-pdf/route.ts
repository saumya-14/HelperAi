import { NextRequest, NextResponse } from 'next/server';
import { PDF } from '@/lib/database/models/pdf.model';
import { connectToDatabase } from '@/lib/database'; // Ensure this connects to MongoDB
import { auth } from '@clerk/nextjs/server';
import User from '@/lib/database/models/user.model';
export async function POST(req: NextRequest) {
  try {
    const {  pdfUrl, generatedText, translatedText,targetlanguage,translatedlanguage,voiceId, audioUrl} = await req.json();

    if ( !pdfUrl || !generatedText || !translatedText || !audioUrl || !targetlanguage ||  !translatedlanguage || !voiceId ) {
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
   

    const savedPDF = await PDF.create({
      userId:user._id,
      pdfUrl,
      generatedText,
      translatedText,
      targetlanguage,
      translatedlanguage,
      voiceId,
      audioUrl,
      audioCreatedAt: new Date(),
    });

    return NextResponse.json({ message: 'PDF record saved', id: savedPDF._id }, { status: 201 });
  } catch (error: any) {
    console.error('[SAVE_PDF_ERROR]', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
