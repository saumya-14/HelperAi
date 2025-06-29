"use client";
import React, { useState, useEffect } from "react";
import { UploadDropzone } from "@/lib/uploadthing-ui";
import { Upload, FileText, ChevronDown, Globe, Sparkles, X, Volume2 } from "lucide-react";

interface DestinationLanguage {
  language: string;
  locale: string;
  targetLocale: string;
  voiceId: string;
}

const destinationLanguages: DestinationLanguage[] = [
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
];

const PdfExplainerPage = () => {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedLanguageData, setSelectedLanguageData] = useState<DestinationLanguage | null>(null);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [translatedText, setTranslatedText] = useState<string | null>(null);

  // Initialize with first language
  useEffect(() => {
    if (destinationLanguages.length > 0) {
      const firstLang = destinationLanguages[0];
      setSelectedLanguage(firstLang.language);
      setSelectedLanguageData(firstLang);
    }
  }, []);

  const handleLanguageSelect = (languageObj: DestinationLanguage) => {
    setSelectedLanguage(languageObj.language);
    setSelectedLanguageData(languageObj);
    setIsLanguageDropdownOpen(false);
    
    console.log("Selected Language:", languageObj.language);
    console.log("Target Locale:", languageObj.targetLocale);
    console.log("Voice ID:", languageObj.voiceId);
  };

  const toggleDropdown = () => {
    setIsLanguageDropdownOpen(open => !open);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        isLanguageDropdownOpen &&
        !target.closest('.language-dropdown')
      ) {
        setIsLanguageDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isLanguageDropdownOpen]);

  const handleExplainPdf = async () => {
    if (!selectedLanguageData) {
      console.error("No language selected");
      return;
    }

    try {
      setIsProcessing(true);

      const extractRes = await fetch('/api/extract-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdfURL: uploadedUrl }),
      });
      await extractRes.json();

      const res2 = await fetch('/api/process-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pdfUrl: uploadedUrl,
          targetLanguage: selectedLanguageData.targetLocale,
          voiceId: selectedLanguageData.voiceId,
        }),
      });
      const result = await res2.json();

      if (res2.ok) {
        setExtractedText(result.extractedText);
        setGeneratedText(result.generatedText);
        setTranslatedText(result.translatedText);
        setAudioUrl(result.audioUrl);
        
        const saveRes = await fetch("/api/save-pdf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pdfUrl: uploadedUrl,
            generatedText: result.generatedText,
            translatedText: result.translatedText,
            targetlanguage: selectedLanguage,
            translatedlanguage: selectedLanguageData.targetLocale,
            voiceId: selectedLanguageData.voiceId,
            audioUrl: result.audioUrl,
            audioCreatedAt: new Date(),
          }),
        });
        
        const saveData = await saveRes.json();
        if (!saveRes.ok) {
          console.error("❌ Failed to save PDF record:", saveData.error);
        } else {
          console.log("✅ PDF record saved, id:", saveData.id);
        }
      } else {
        console.error("API error:", result.error);
      }

      console.log("Final AI Result:", result);
    } catch (err) {
      console.error("Error in handleExplainPdf:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex flex-col" suppressHydrationWarning>
      {/* Background Patterns */}
      <div className="absolute inset-0 opacity-10 sm:opacity-20">
        <div className="absolute top-10 left-10 w-48 h-48 sm:w-64 sm:h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-2xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-48 h-48 sm:w-64 sm:h-64 bg-cyan-400 rounded-full mix-blend-multiply filter blur-2xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
              PDF Explainer
            </h1>
          </div>
          <div className="relative language-dropdown">
            <button
              type="button"
              onClick={toggleDropdown}
              className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            >
              <Globe className="w-5 h-5 text-slate-600" />
              <span className="text-sm text-slate-700">
                {selectedLanguage || 'Select Language'}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-slate-500 transform transition-transform ${
                  isLanguageDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {isLanguageDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                {destinationLanguages.map((langObj, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleLanguageSelect(langObj)}
                    className={`w-full px-4 py-2 text-sm text-left hover:bg-purple-50 transition-colors ${
                      selectedLanguage === langObj.language ? 'bg-purple-100 font-medium text-purple-700' : 'text-slate-700'
                    }`}
                  >
                    {langObj.language}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-0 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full space-y-8">
          {/* Title Section */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              Upload Your PDF
            </h2>
            <p className="text-lg text-slate-600">
              Select one PDF to get explained in your preferred language
            </p>
          </div>

          {/* Upload Area */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6">
              <UploadDropzone
                endpoint="uploadMedia"
                onClientUploadComplete={(files) => {
                  const url = files[0]?.url;
                  if (url) setUploadedUrl(url);
                }}
                onUploadError={(error) => {
                  console.error("Upload error:", error);
                }}
                className="border-dashed border-2 border-purple-300 bg-purple-50/30 rounded-xl hover:border-purple-400 hover:bg-purple-50/50 transition-colors"
              />
              
              {uploadedUrl && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">PDF Uploaded Successfully!</p>
                      <p className="text-sm text-green-600">Ready for explanation</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Language Selection Info */}
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium text-slate-800">
                    Explanation Language: {selectedLanguage || 'Not selected'}
                  </p>
                  <p className="text-sm text-slate-600">
                    Your PDF will be explained in the selected language
                  </p>
                  {selectedLanguageData && (
                    <p className="text-xs text-slate-500 mt-1">
                      Voice: {selectedLanguageData.voiceId} | Locale: {selectedLanguageData.targetLocale}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Explain Button */}
            <button
              onClick={handleExplainPdf}
              disabled={!uploadedUrl || !selectedLanguage || isProcessing}
              className={`w-full py-4 px-6 rounded-xl font-medium text-white transition-all duration-300 ${
                !uploadedUrl || !selectedLanguage || isProcessing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : (
                'Explain PDF'
              )}
            </button>
          </div>

          {/* Results Section */}
          {translatedText && (
            <div className="mt-6 space-y-4">
              <div className="bg-white border p-4 rounded-lg shadow">
                <h3 className="font-semibold">AI Explanation:</h3>
                <p>{generatedText}</p>
              </div>
              <div className="bg-purple-50 border-purple-200 border p-4 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Translated ({selectedLanguage}):</h3>
                  {audioUrl && (
                    <button
                      onClick={() => new Audio(audioUrl).play()}
                      className="flex items-center gap-2 text-purple-700 hover:text-purple-900"
                    >
                      <Volume2 className="w-5 h-5" />
                      Play
                    </button>
                  )}
                </div>
                <p>{translatedText}</p>
              </div>
            </div>
          )}

          {/* Feature Info */}
          <div className="grid sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-white/50 rounded-lg border border-slate-200">
              <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-medium text-slate-800">PDF Analysis</h3>
              <p className="text-sm text-slate-600">Deep content understanding</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg border border-slate-200">
              <Globe className="w-8 h-8 text-pink-600 mx-auto mb-2" />
              <h3 className="font-medium text-slate-800">Multi-Language</h3>
              <p className="text-sm text-slate-600">Support for {destinationLanguages.length}+ languages</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg border border-slate-200">
              <Sparkles className="w-8 h-8 text-cyan-600 mx-auto mb-2" />
              <h3 className="font-medium text-slate-800">AI Powered</h3>
              <p className="text-sm text-slate-600">Smart explanations</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PdfExplainerPage;