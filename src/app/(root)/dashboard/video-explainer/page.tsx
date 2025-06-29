"use client";
import React, { useState, useEffect } from "react";
import { UploadDropzone } from "@/lib/uploadthing-ui";
import { Upload, Video, ChevronDown, Globe, Sparkles, X, Volume2, Play, Download, CheckCircle } from "lucide-react";

const destinationLanguages = [
  { language: "English - US & Canada", locale: "en_US", targetLocale: "en-US", voiceId: "hi-IN-rahul" },
  { language: "English - UK", locale: "en_UK", targetLocale: "en-UK", voiceId: "en-UK-hazel" },
  { language: "English - India", locale: "en_IN", targetLocale: "en-IN", voiceId: "hi-IN-rahul" },
  { language: "English - Scotland", locale: "en_SCOTT", targetLocale: "en-SCOTT", voiceId: "hi-IN-rahul" },
  { language: "English - Australia", locale: "en_AU", targetLocale: "en-AU", voiceId: "hi-IN-rahul" },
  { language: "French - France", locale: "fr_FR", targetLocale: "fr-FR", voiceId: "fr-FR-adélie" },
  { language: "German - Germany", locale: "de_DE", targetLocale: "de-DE", voiceId: "de-DE-josephine" },
  { language: "Spanish - Spain", locale: "es_ES", targetLocale: "es-ES", voiceId: "hi-IN-rahul" },
  { language: "Spanish - Mexico", locale: "es_MX", targetLocale: "es-MX", voiceId: "es-MX-alejandro" },
  { language: "Italian - Italy", locale: "it_IT", targetLocale: "it-IT", voiceId: "it-IT-giorgio" },
  { language: "Portuguese - Brazil", locale: "pt_BR", targetLocale: "pt-BR", voiceId: "pt-BR-isadora" },
  { language: "Polish - Poland", locale: "pl_PL", targetLocale: "pl-PL", voiceId: "pl-PL-blazej" },
  { language: "Hindi - India", locale: "hi_IN", targetLocale: "hi-IN", voiceId: "hi-IN-rahul" },
  { language: "Korean - Korea", locale: "ko_KR", targetLocale: "ko-KR", voiceId: "ko-KR-hwan" },
  { language: "Tamil - India", locale: "ta_IN", targetLocale: "ta-IN", voiceId: "ta-IN-sarvesh" },
  { language: "Bengali - India", locale: "bn_IN", targetLocale: "bn-IN", voiceId: "bn-IN-arnab" },
  { language: "Japanese - Japan", locale: "ja_JP", targetLocale: "ja-JP", voiceId: "ja-JP-denki" },
  { language: "Mandarin (Chinese) - China", locale: "zh_CN", targetLocale: "zh-CN", voiceId: "zh-CN-baolin" },
  { language: "Dutch - Netherlands", locale: "nl_NL", targetLocale: "nl-NL", voiceId: "nl-NL-famke" },
  { language: "Finnish", locale: "fi_FI", targetLocale: "fi-FI", voiceId: "hi-IN-rahul" },
  { language: "Russian", locale: "ru_RU", targetLocale: "ru-RU", voiceId: "hi-IN-rahul" },
  { language: "Turkish", locale: "tr_TR", targetLocale: "tr-TR", voiceId: "hi-IN-rahul" },
  { language: "Ukrainian", locale: "uk_UA", targetLocale: "uk-UA", voiceId: "hi-IN-rahul" },
  { language: "Danish", locale: "da_DK", targetLocale: "da-DK", voiceId: "hi-IN-rahul" },
  { language: "Indonesian", locale: "id_ID", targetLocale: "id-ID", voiceId: "hi-IN-rahul" },
  { language: "Romanian", locale: "ro_RO", targetLocale: "ro-RO", voiceId: "hi-IN-rahul" },
  { language: "Norwegian", locale: "nb_NO", targetLocale: "nb-NO", voiceId: "hi-IN-rahul" },
  { language: "Croatian - Croatia", locale: "hr_HR", targetLocale: "hr-HR", voiceId: "hr-HR-marija" },
  { language: "Slovak - Slovakia", locale: "sk_SK", targetLocale: "sk-SK", voiceId: "sk-SK-tibor" },
  { language: "Greek - Greece", locale: "el_GR", targetLocale: "el-GR", voiceId: "el-GR-stavros" },
]

const VideoExplainerPage = () => {
  const [videoLanguage, setVideoLanguage] = useState(null);
  const [languageVoiceMap, setLanguageVoiceMap] = useState<Record<string, string>>({});
  const [languageLocaleMap, setLanguageLocaleMap] = useState<Record<string, string>>({});

  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState(destinationLanguages[0]);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  const [extractedText, setExtractedText] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVideoProcessing, setIsVideoProcessing] = useState(false);
  const [dubbedVideoUrl, setDubbedVideoUrl] = useState('');
  const [uploadedDubbedUrl, setUploadedDubbedUrl] = useState('');
  const [showDubbedUpload, setShowDubbedUpload] = useState(false);

  // New state to track when text processing is complete (separate from video processing)
  const [textProcessingComplete, setTextProcessingComplete] = useState(false);

  const handleLanguageSelect = (langObj: typeof destinationLanguages[0]) => {
    setSelectedLanguage(langObj);
    setIsLanguageDropdownOpen(false);
    console.log("Selected:", langObj.language);
  };

  const resetProcess = () => {
    setUploadedUrl(null);
    setExtractedText('');
    setGeneratedText('');
    setTranslatedText('');
    setAudioUrl('');
    setDubbedVideoUrl('');
    setUploadedDubbedUrl('');
    setShowDubbedUpload(false);
    setIsProcessing(false);
    setIsVideoProcessing(false);
    setTextProcessingComplete(false); // Reset the new state
  };

  const handleExplainVideo = async () => {
  try {
    setIsProcessing(true);

    // Step 1: Extract video content
    const extractRes = await fetch("/api/handlevideo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoUrl: uploadedUrl }),
    });
    const res = await extractRes.json();

    // Step 2: Generate explanation, translation, and audio
    const chatRes = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: res.text,
        targetLanguage: selectedLanguage.targetLocale,
        voiceId: selectedLanguage.voiceId,
      }),
    });
    const result = await chatRes.json();

    if (!chatRes.ok) {
      console.error("Chat error:", result.error);
      setIsProcessing(false);
      return;
    }
const extractedText = res.text;
    // ✅ Set text results immediately and mark text processing as complete
  setExtractedText(extractedText); // If you want to show the original prompt
setGeneratedText(result.original);        // updated to match backend
setTranslatedText(result.translated);     // updated to match backend
setAudioUrl(result.audio);            
    setTextProcessingComplete(true); // 🔥 This will show the results immediately
    setIsProcessing(false);

    // ✅ Step 3: Start dubvideo background job (continues in background)
    setIsVideoProcessing(true);
    const startRes = await fetch("/api/dubvideostart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileUrl: uploadedUrl,
        targetLocales: [selectedLanguage.locale],
      }),
    });

    const { jobId } = await startRes.json();

    if (!jobId) {
      console.error("Failed to start dubbing job");
      setIsVideoProcessing(false);
      return;
    }

    // ✅ Step 4: Poll for status (background process)
    const poll = setInterval(async () => {
      const statusRes = await fetch("/api/dubvideostatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });

      const statusData = await statusRes.json();

      if (statusData.status === "COMPLETED") {
        clearInterval(poll);
        setDubbedVideoUrl(statusData.downloadUrl);
        setShowDubbedUpload(true);
        setIsVideoProcessing(false);
      } else if (statusData.status === "FAILED") {
        clearInterval(poll);
        console.error("Dubbing failed:", statusData.reason);
        setIsVideoProcessing(false);
      } else {
        console.log("⏳ Polling status:", statusData.status);
      }
    }, 5000); // Poll every 5 seconds

  } catch (err) {
    console.error("handleExplainVideo error:", err);
    setIsProcessing(false);
    setIsVideoProcessing(false);
  }
};


  const handleDubbedVideoUpload = async (files: any) => {
  const url = files[0]?.url;
  if (!url) return;

  setUploadedDubbedUrl(url);

  try {
    const res = await fetch("/api/savevideo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        originalVideoUrl: uploadedUrl,
        dubbedVideoUrl: url,
        extractedText,
        generatedText,
        translatedText,
        audioUrl,
        audioCreatedAt: new Date().toISOString(), 
        voiceId: selectedLanguage.voiceId,
        locale: selectedLanguage.locale,
       
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("❌ Failed to save dubbed video:", err.error);
    } else {
      console.log("✅ Dubbed video saved to DB");
    }
  } catch (error) {
    console.error("❌ Error saving to DB:", error);
  }
};

  const toggleDropdown = () => setIsLanguageDropdownOpen(prev => !prev);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (isLanguageDropdownOpen && !event.target.closest('.language-dropdown')) {
        setIsLanguageDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isLanguageDropdownOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex flex-col">
      {/* Background Patterns */}
      <div className="absolute inset-0 opacity-10 sm:opacity-20">
        <div className="absolute top-10 left-10 w-48 h-48 sm:w-64 sm:h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-48 h-48 sm:w-64 sm:h-64 bg-green-400 rounded-full mix-blend-multiply filter blur-2xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
              Video Explainer
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {(textProcessingComplete || showDubbedUpload) && (
              <button
                onClick={resetProcess}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Start Over
              </button>
            )}
            <div className="relative language-dropdown">
              <button
                type="button"
                onClick={toggleDropdown}
                className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
              >
                <Globe className="w-5 h-5 text-slate-600" />
                <span className="text-sm text-slate-700">
                  {selectedLanguage.language || 'Select Language'}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-500 transform transition-transform ${
                    isLanguageDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isLanguageDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                  {destinationLanguages.map((lang, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleLanguageSelect(lang)}
                      className={`w-full px-4 py-2 text-sm text-left hover:bg-blue-50 transition-colors ${
                        selectedLanguage.language === lang.language ? 'bg-blue-100 font-medium text-blue-700' : 'text-slate-700'
                      }`}
                    >
                      {lang.language}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-0 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full space-y-8">
          
          {/* Initial Upload Section - Hide after text processing completes */}
          {!textProcessingComplete && !showDubbedUpload && (
            <>
              {/* Title Section */}
              <div className="text-center space-y-4">
                <h2 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-600">
                  Upload Your Video
                </h2>
                <p className="text-lg text-slate-600">
                  Select one video to get explained in your preferred language
                </p>
              </div>

              {/* Upload Area */}
              <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6">
                  <UploadDropzone
                    endpoint="uploadMedia"
                    onClientUploadComplete={(files) => {
                      const url = files[0]?.url;
                      if (url) setUploadedUrl(url as any);
                    }}
                    onUploadError={(error) => {
                      console.error("Upload error:", error);
                    }}
                    className="border-dashed border-2 border-blue-300 bg-blue-50/30 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
                  />
                  
                  {uploadedUrl && (
                    <div className="mt-4 space-y-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Video className="w-6 h-6 text-green-600" />
                          <div>
                            <p className="font-medium text-green-800">Video Uploaded Successfully!</p>
                            <p className="text-sm text-green-600">Ready for explanation</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Video Preview */}
                      <div className="bg-black rounded-lg overflow-hidden">
                        <video
                          src={uploadedUrl}
                          controls
                          className="w-full max-h-64 object-contain"
                          preload="metadata"
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    </div>
                  )}
                </div>

                {/* Language Selection Info */}
                <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-slate-800">
                        Explanation Language: {selectedLanguage.language || 'Not selected'}
                      </p>
                      <p className="text-sm text-slate-600">
                        Your video will be explained in the selected language
                      </p>
                    </div>
                  </div>
                </div>

                {/* Explain Button */}
                <button
                  onClick={handleExplainVideo}
                  disabled={!uploadedUrl || !selectedLanguage || isProcessing}
                  className={`w-full py-4 px-6 rounded-xl font-medium text-white transition-all duration-300 ${
                    !uploadedUrl || !selectedLanguage || isProcessing
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  }`}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing Video...
                    </div>
                  ) : (
                    'Explain Video'
                  )}
                </button>
              </div>
            </>
          )}

          {/* Results Section - Show immediately when textProcessingComplete is true */}
          {textProcessingComplete && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Video Explanation Ready!</h2>
                <p className="text-slate-600">Here's what your video is about:</p>
              </div>

              {/* Original Video Preview */}
              {uploadedUrl && (
                <div className="bg-white border p-4 rounded-xl shadow-sm">
                  <h3 className="font-semibold mb-3 text-lg">Original Video:</h3>
                  <div className="bg-black rounded-lg overflow-hidden">
                    <video
                      src={uploadedUrl}
                      controls
                      className="w-full max-h-64 object-contain"
                      preload="metadata"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="bg-white border p-6 rounded-xl shadow-sm">
                  <h3 className="font-semibold mb-3 text-lg">AI Explanation:</h3>
                  <p className="text-slate-700 leading-relaxed">{generatedText}</p>
                </div>
                
                <div className="bg-blue-50 border-blue-200 border p-6 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">Translated ({selectedLanguage.language}):</h3>
                    {audioUrl && (
                      <button
                        onClick={() => {
                          const audio = new Audio(audioUrl);
                          audio.play().catch(console.error);
                        }}
                        className="flex items-center gap-2 text-blue-700 hover:text-blue-900 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                      >
                        <Volume2 className="w-5 h-5" />
                        Play Audio
                      </button>
                    )}
                  </div>
                  <p className="text-slate-700 leading-relaxed">{translatedText}</p>
                </div>
              </div>

              {/* Video Processing Status */}
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  {isVideoProcessing ? (
                    <>
                      <div className="w-6 h-6 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
                      <div>
                        <p className="font-medium text-slate-800">Creating Dubbed Video...</p>
                        <p className="text-sm text-slate-600">This may take a few minutes. You can already see the explanation above!</p>
                      </div>
                    </>
                  ) : dubbedVideoUrl ? (
                    <>
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <div className="flex-1">
                        <p className="font-medium text-green-800">Dubbed Video Ready!</p>
                        <p className="text-sm text-green-600">Download and upload it below for better data handling</p>
                      </div>
                      <a
                        href={dubbedVideoUrl}
                        download
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          )}

          {/* Dubbed Video Upload Section */}
          {showDubbedUpload && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Upload Dubbed Video</h2>
                <p className="text-slate-600">Please upload the downloaded dubbed video for better data management</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6">
                <UploadDropzone
                  endpoint="uploadMedia"
                  onClientUploadComplete={handleDubbedVideoUpload}
                  onUploadError={(error) => {
                    console.error("Upload error:", error);
                  }}
                  className="border-dashed border-2 border-green-300 bg-green-50/30 rounded-xl hover:border-green-400 hover:bg-green-50/50 transition-colors"
                />
                
                {uploadedDubbedUrl && (
                  <div className="mt-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <div>
                          <p className="font-medium text-green-800">Dubbed Video Uploaded Successfully!</p>
                          <p className="text-sm text-green-600">Saved to database for future use</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Dubbed Video Preview */}
                    <div className="mt-4 bg-black rounded-lg overflow-hidden">
                      <video
                        src={uploadedDubbedUrl}
                        controls
                        className="w-full max-h-64 object-contain"
                        preload="metadata"
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Feature Info - Show only on initial page */}
          {!textProcessingComplete && !showDubbedUpload && (
            <div className="grid sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-white/50 rounded-lg border border-slate-200">
                <Video className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-medium text-slate-800">Video Analysis</h3>
                <p className="text-sm text-slate-600">Deep content understanding</p>
              </div>
              <div className="p-4 bg-white/50 rounded-lg border border-slate-200">
                <Globe className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-medium text-slate-800">Multi-Language</h3>
                <p className="text-sm text-slate-600">Support for 30+ languages</p>
              </div>
              <div className="p-4 bg-white/50 rounded-lg border border-slate-200">
                <Sparkles className="w-8 h-8 text-cyan-600 mx-auto mb-2" />
                <h3 className="font-medium text-slate-800">AI Powered</h3>
                <p className="text-sm text-slate-600">Smart explanations</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default VideoExplainerPage;