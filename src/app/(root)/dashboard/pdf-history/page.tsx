'use client';
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { FileText, ExternalLink, Clock, Volume2, Sparkles, ArrowLeft, Play, Pause, Download, Share2, Eye } from 'lucide-react';

type PDFRecord = {
  id: string;
  pdfUrl: string;
  generatedText: string;
  translatedText: string;
  translatedLanguage: string;
  audioUrl: string;
  timestamp: string;
};

export default function PdfHistoryPage() {
  const { user } = useUser();
  const [history, setHistory] = useState<PDFRecord[]>([]);
  const [selected, setSelected] = useState<PDFRecord | null>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch on mount
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const res = await fetch('/api/pdfhistory');
        if (!res.ok) throw new Error(await res.text());
        const { history } = await res.json();
        setHistory(history);
      } catch (e) {
        console.error('Fetch error:', e);
      }
    })();
  }, [user]);

  const formatAge = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const m = Math.floor(diff/60000), h = Math.floor(diff/3600000), d = Math.floor(diff/86400000);
    return m<60 ? `${m}m ago` : h<24 ? `${h}h ago` : `${d}d ago`;
  };

  const formatDate = (ts: string) => {
    return new Date(ts).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const playAudio = (audioUrl: string, id: string) => {
    if (playingAudio === id) {
      setPlayingAudio(null);
      return;
    }
    
    setPlayingAudio(id);
    const audio = new Audio(audioUrl);
    audio.play();
    audio.onended = () => setPlayingAudio(null);
  };

  const filteredHistory = history.filter(pdf => 
    pdf.generatedText.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pdf.translatedText.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please sign in to view your PDF history.</p>
        </div>
      </div>
    );
  }

  if (selected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSelected(null)} 
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors group"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <span className="font-medium">Back to History</span>
                </button>
                <div className="h-6 w-px bg-gray-300" />
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  <h1 className="text-xl font-semibold text-gray-800">PDF Analysis</h1>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                {formatDate(selected.timestamp)}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* PDF Preview */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-white font-semibold flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    PDF Preview
                  </h2>
                  <button className="text-white/80 hover:text-white transition-colors">
                    <ExternalLink className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <iframe
                  src={selected.pdfUrl}
                  width="100%"
                  height="600px"
                  className="border border-gray-200 rounded-lg"
                  title="PDF Preview"
                />
              </div>
            </div>

            {/* Analysis Content */}
            <div className="space-y-6">
              {/* AI Explanation */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4">
                  <h2 className="text-white font-semibold flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    AI Analysis
                  </h2>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 leading-relaxed">{selected.generatedText}</p>
                </div>
              </div>

              {/* Translation + Audio */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-violet-500 to-purple-500 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-white font-semibold flex items-center gap-2">
                      <Volume2 className="w-5 h-5" />
                      Translation ({selected.translatedLanguage})
                    </h2>
                    <button
                      onClick={() => playAudio(selected.audioUrl, selected.id)}
                      className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                      {playingAudio === selected.id ? (
                        <>
                          <Pause className="w-4 h-4" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Play Audio
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 leading-relaxed">{selected.translatedText}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                PDF History
              </h1>
              <p className="text-gray-600">Manage and review your processed PDF documents</p>
            </div>
            <div className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
              {history.length} document{history.length !== 1 ? 's' : ''} processed
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {history.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">No PDFs processed yet</h2>
            <p className="text-gray-600 mb-6">Upload your first PDF to get started with AI analysis and translation</p>
            <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all">
              Upload PDF
            </button>
          </div>
        ) : (
          <>
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder="Search your PDFs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-4 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* PDF Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHistory.map((pdf) => (
                <div
                  key={pdf.id}
                  onClick={() => setSelected(pdf)}
                  className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-xs text-white/80 bg-white/20 px-2 py-1 rounded-full">
                        {formatAge(pdf.timestamp)}
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-800 mb-3 line-clamp-2 leading-tight">
                      {pdf.generatedText.length > 80 
                        ? pdf.generatedText.substring(0, 80) + "..."
                        : pdf.generatedText
                      }
                    </h3>
                    
                    <div className="mb-4">
                      <div className="text-xs font-medium text-purple-600 mb-1">
                        Translated to {pdf.translatedLanguage}
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                        {pdf.translatedText.length > 120 
                          ? pdf.translatedText.substring(0, 120) + "..."
                          : pdf.translatedText
                        }
                      </p>
                    </div>

                    {/* Card Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <button
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          playAudio(pdf.audioUrl, pdf.id);
                        }}
                        className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors text-sm font-medium"
                      >
                        {playingAudio === pdf.id ? (
                          <>
                            <Pause className="w-4 h-4" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            Play Audio
                          </>
                        )}
                      </button>
                      <div className="text-xs text-gray-400">
                        {formatDate(pdf.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredHistory.length === 0 && searchTerm && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No results found</h3>
                <p className="text-gray-600">Try adjusting your search terms</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}