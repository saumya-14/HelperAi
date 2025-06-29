'use client';
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Video, ExternalLink, Clock, Volume2, Sparkles, ArrowLeft, Play, Pause, Download, Share2, Eye, FileVideo } from 'lucide-react';

type VideoRecord = {
  _id: string;
  originalVideoUrl: string;
  dubbedVideoUrl: string;
  extractedText: string;
  generatedText: string;
  translatedText: string;
  audioUrl: string;
  audioCreatedAt: string;
  voiceId: string;
  locale: string;
  createdAt: string;
};

export default function VideoHistoryPage() {
  const { user } = useUser();
  const [history, setHistory] = useState<VideoRecord[]>([]);
  const [selected, setSelected] = useState<VideoRecord | null>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch on mount
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/getvideo');
        if (!res.ok) throw new Error(await res.text());
        const { data } = await res.json();
        setHistory(data);
      } catch (e) {
        console.error('Fetch error:', e);
      } finally {
        setLoading(false);
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

  const filteredHistory = history.filter(video => 
    video.generatedText.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.translatedText.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.extractedText.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Video className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please sign in to view your video history.</p>
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
                  <h1 className="text-xl font-semibold text-gray-800">Video Analysis</h1>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                {formatDate(selected.createdAt)}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Video Preview */}
            <div className="space-y-6">
              {/* Original Video */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-white font-semibold flex items-center gap-2">
                      <Video className="w-5 h-5" />
                      Original Video
                    </h2>
                    <a 
                      href={selected.originalVideoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                </div>
                <div className="p-6">
                  <video
                    src={selected.originalVideoUrl}
                    controls
                    className="w-full h-auto rounded-lg border border-gray-200"
                    style={{ maxHeight: '400px' }}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>

              {/* Dubbed Video */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-white font-semibold flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Dubbed Video ({selected.locale})
                    </h2>
                    <a 
                      href={selected.dubbedVideoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                </div>
                <div className="p-6">
                  <video
                    src={selected.dubbedVideoUrl}
                    controls
                    className="w-full h-auto rounded-lg border border-gray-200"
                    style={{ maxHeight: '400px' }}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>

            {/* Analysis Content */}
            <div className="space-y-6">
              {/* Extracted Text */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-500 to-slate-500 px-6 py-4">
                  <h2 className="text-white font-semibold flex items-center gap-2">
                    <FileVideo className="w-5 h-5" />
                    Extracted Text
                  </h2>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 leading-relaxed">{selected.extractedText}</p>
                </div>
              </div>

              {/* AI Enhancement */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4">
                  <h2 className="text-white font-semibold flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    AI Enhanced Text
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
                      Translation ({selected.locale})
                    </h2>
                    <button
                      onClick={() => playAudio(selected.audioUrl, selected._id)}
                      className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                      {playingAudio === selected._id ? (
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
                  <div className="mt-4 text-xs text-gray-500">
                    Audio generated: {formatDate(selected.audioCreatedAt)}
                  </div>
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
                  <Video className="w-6 h-6 text-white" />
                </div>
                Video History
              </h1>
              <p className="text-gray-600">Manage and review your dubbed video content</p>
            </div>
            <div className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
              {history.length} video{history.length !== 1 ? 's' : ''} processed
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Video className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Loading videos...</h2>
            <p className="text-gray-600">Please wait while we fetch your video history</p>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Video className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">No videos processed yet</h2>
            <p className="text-gray-600 mb-6">Upload your first video to get started with AI dubbing and translation</p>
            <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all">
              Upload Video
            </button>
          </div>
        ) : (
          <>
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder="Search your videos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-4 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Video Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHistory.map((video) => (
                <div
                  key={video._id}
                  onClick={() => setSelected(video)}
                  className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <Video className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-xs text-white/80 bg-white/20 px-2 py-1 rounded-full">
                        {formatAge(video.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* Video Thumbnail */}
                  <div className="relative">
                    <video
                      src={video.dubbedVideoUrl}
                      className="w-full h-48 object-cover"
                      muted
                      onMouseEnter={(e) => e.currentTarget.play()}
                      onMouseLeave={(e) => {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = 0;
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-800 mb-3 line-clamp-2 leading-tight">
                      {video.generatedText.length > 60 
                        ? video.generatedText.substring(0, 60) + "..."
                        : video.generatedText
                      }
                    </h3>
                    
                    <div className="mb-4">
                      <div className="text-xs font-medium text-purple-600 mb-1">
                        Dubbed to {video.locale}
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                        {video.translatedText.length > 80 
                          ? video.translatedText.substring(0, 80) + "..."
                          : video.translatedText
                        }
                      </p>
                    </div>

                    {/* Card Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <button
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          playAudio(video.audioUrl, video._id);
                        }}
                        className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors text-sm font-medium"
                      >
                        {playingAudio === video._id ? (
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
                        {formatDate(video.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredHistory.length === 0 && searchTerm && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="w-8 h-8 text-gray-400" />
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