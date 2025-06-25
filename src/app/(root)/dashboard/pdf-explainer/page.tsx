"use client";
import React, { useState, useEffect } from "react";
import { UploadDropzone } from "@/lib/uploadthing-ui";
import { Upload, FileText, ChevronDown, Globe, Sparkles, X } from "lucide-react";

const PdfExplainerPage = () => {
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch available languages
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        // Mock API call - replace with your actual API
        const fallbackLanguages = [
          'English', 'Spanish', 'French', 'German', 'Italian', 
          'Portuguese', 'Russian', 'Chinese', 'Japanese', 'Korean',
          'Arabic', 'Hindi', 'Dutch', 'Swedish', 'Norwegian'
        ];
        setLanguages(fallbackLanguages);
        setSelectedLanguage(fallbackLanguages[0]);
      } catch (error) {
        console.error('Failed to fetch languages:', error);
      }
    };
    fetchLanguages();
  }, []);

  const handleLanguageSelect = (language:any) => {
    setSelectedLanguage(language);
    setIsLanguageDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsLanguageDropdownOpen(open => !open);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event:any) => {
      const target = event.target;
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
    if (!uploadedUrl || !selectedLanguage) return;
    
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      // Here you would typically redirect to results page or show explanation
      alert(`PDF will be explained in ${selectedLanguage}`);
    }, 2000);
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
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                {languages.map((lang, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleLanguageSelect(lang)}
                    className={`w-full px-4 py-2 text-sm text-left hover:bg-purple-50 transition-colors ${
                      selectedLanguage === lang ? 'bg-purple-100 font-medium text-purple-700' : 'text-slate-700'
                    }`}
                  >
                    {lang}
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
                endpoint="pdfUploader"
                onClientUploadComplete={(files) => {
                  const url = files[0]?.url;
                  if (url) setUploadedUrl(url as any);
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
              <p className="text-sm text-slate-600">Support for 15+ languages</p>
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