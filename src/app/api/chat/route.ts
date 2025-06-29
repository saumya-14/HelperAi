import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, targetLanguage, voiceId } = body;

    if (!prompt || !targetLanguage || !voiceId) {
      return Response.json({ error: 'Missing prompt, target language or voiceId' }, { status: 400 });
    }

    // Step 1: Generate AI content
    const geminiResponse = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${prompt} in one paragraph`,
    });
    const generatedText = geminiResponse.text;
    console.log("Generated:", generatedText);

    // Step 2: Translate the generated text
    const translationRes = await fetch("https://api.murf.ai/v1/text/translate", {
      method: "POST",
      headers: {
        "Api-Key": process.env.MURF_API_KEY!,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        targetLanguage,
        texts: [generatedText]
      }),
    });

    const translationData = await translationRes.json();
  const translatedText = translationData.translations?.[0]?.translated_text;

if (!translatedText) {
  return Response.json({ error: 'No translated text returned' }, { status: 500 });
}

const speechRes = await fetch("https://api.murf.ai/v1/speech/generate", {
  method: "POST",
  headers: {
    "Api-Key": process.env.MURF_API_KEY!,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    text: translatedText, // ✅ Must be a plain string!
    voiceId: voiceId
  }),
});

const speechData = await speechRes.json();
    console.log("Speech Audio File:", speechData);

    return Response.json({
      original: generatedText,
      translated: translatedText,
      audio: speechData.audioFile || null,
    });

  } catch (error: any) {
    console.error("API error:", error);
    return Response.json({ error: error.message || 'Something went wrong' }, { status: 500 });
  }
}
