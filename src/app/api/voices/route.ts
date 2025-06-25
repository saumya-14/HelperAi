// app/api/voices/route.ts
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
    
    // Check if the HTTP request was successful
    if (!response.ok) {
      console.error('Murf API HTTP error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      return NextResponse.json(
        { error: `Murf API error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Debug log to see actual response structure
    console.log('Murf API response:', JSON.stringify(data, null, 2));

    // Check if the response has the expected structure
    if (!data || typeof data !== 'object') {
      console.error('Invalid response format - not an object:', typeof data);
      return NextResponse.json(
        { error: 'Invalid response format from Murf API' },
        { status: 500 }
      );
    }

    // Handle different possible response structures
    let voices = [];
    
    if (data.voices && Array.isArray(data.voices)) {
      voices = data.voices;
    } else if (Array.isArray(data)) {
      // In case the API returns voices directly as an array
      voices = data;
    } else if (data.data && Array.isArray(data.data)) {
      // In case voices are nested in a 'data' property
      voices = data.data;
    } else {
      console.error('No voices array found in response. Response structure:', Object.keys(data));
      return NextResponse.json(
        { error: 'No voices data found in API response', responseKeys: Object.keys(data) },
        { status: 500 }
      );
    }

    if (voices.length === 0) {
      console.warn('No voices returned from API');
      return NextResponse.json({ languages: [] });
    }

    // Extract unique display languages
    const displayLanguages = [
      ...new Set(
        voices
          .map((voice: any) => voice.displayLanguage || voice.language || voice.lang)
          .filter(Boolean) // Remove any undefined/null values
      ),
    ];

    console.log('Extracted languages:', displayLanguages);

    return NextResponse.json({ 
      languages: displayLanguages,
      totalVoices: voices.length 
    });

  } catch (error) {
    console.error('Error fetching Murf voices:', error);
    
    // Provide more specific error information
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON response from Murf API' },
        { status: 500 }
      );
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { error: 'Network error connecting to Murf API' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', details: error},
      { status: 500 }
    );
  }
}