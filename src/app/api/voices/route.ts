import { NextResponse } from 'next/server';

export async function GET() {
  const url = 'https://api.murf.ai/v1/speech/voices';
  const options = {
    method: 'GET',
    headers: {
      "Api-Key": "ap2_b58a72bd-102c-44ba-b923-338cf1d470a8"
    },
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Murf API HTTP error:', response.status, response.statusText);
      return NextResponse.json(
        { error: `Murf API error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    let voices: any[] = [];

    if (Array.isArray(data)) {
      voices = data;
    } else if (Array.isArray(data.voices)) {
      voices = data.voices;
    } else if (Array.isArray(data.data)) {
      voices = data.data;
    } else {
      return NextResponse.json(
        { error: 'Unexpected response format', structure: Object.keys(data) },
        { status: 500 }
      );
    }

    const languageToLocalesMap: Record<string, Set<string>> = {};
    const languageToVoiceIdsMap: Record<string, string[]> = {};
    const displayLanguages = new Set<string>();

    voices.forEach((voice) => {
      const language = voice.displayLanguage;
      if (!language) return;

      displayLanguages.add(language);

      // Add voice ID to corresponding language
      if (!languageToVoiceIdsMap[language]) {
        languageToVoiceIdsMap[language] = [];
      }
      if (voice.voiceId) {
        languageToVoiceIdsMap[language].push(voice.voiceId);
      }

      // Add locales
      if (!languageToLocalesMap[language]) {
        languageToLocalesMap[language] = new Set();
      }
      const supportedLocales = voice.supportedLocales || {};
      Object.keys(supportedLocales).forEach((locale) => {
        languageToLocalesMap[language].add(locale);
      });
    });

    // Convert Set to Array
    const mappedLocales: Record<string, string[]> = {};
    for (const [language, localesSet] of Object.entries(languageToLocalesMap)) {
      mappedLocales[language] = Array.from(localesSet);
    }
    const firstVoiceIds = Object.entries(languageToVoiceIdsMap).map(([language, voiceIds]) => ({
  language,
  voiceId: voiceIds[0]  // get the first voice ID
}));
const firstLocales = Object.entries(mappedLocales).map(
  ([language, locales]) => ({
    language,
    locale: locales[0] || null
  })
);

   console.log({
  languages: Array.from(displayLanguages),
  languageToLocalesMap: firstLocales,
  languageToVoiceIdsMap:firstVoiceIds,
  totalVoices: voices.length,
});

    return NextResponse.json({
      languages: Array.from(displayLanguages),
  languageToLocalesMap: firstLocales,
      
      languageToVoiceIdsMap: firstVoiceIds,
      totalVoices: voices.length,
    });

  } catch (error) {
    console.error('Error fetching Murf voices:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error },
      { status: 500 }
    );
  }
}
