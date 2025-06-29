'use client'
import React, { useState, useEffect } from "react";
import { ArrowLeft, MessageCircle, Clock, Volume2, Sparkles, User, Bot, X } from "lucide-react";

// Define interfaces for type safety
interface Chat {
  id: string;
  question: string;
  generatedText: string;
  translatedText: string;
  language: string;
  timestamp: Date;
  audioUrl: string;
}

interface ApiResponse {
  chats: Chat[];
  error?: string;
}

const ChatHistory: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // Fetch chat history from API
  useEffect(() => {
    const fetchChatHistory = async (): Promise<void> => {
      try {
        const res = await fetch("/api/get-chats");
        const data: ApiResponse = await res.json();

        if (res.ok) {
          setChatHistory(data.chats);
        } else {
          console.error("Failed to fetch chats:", data.error);
        }
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchChatHistory();
  }, []);

  const formatTimestamp = (timestamp: Date): string => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleCardClick = (chat: Chat): void => {
    setIsAnimating(true);
    setTimeout(() => {
      setSelectedChat(chat);
      setIsAnimating(false);
    }, 300);
  };

  const handleClose = (): void => {
    setIsAnimating(true);
    setTimeout(() => {
      setSelectedChat(null);
      setIsAnimating(false);
    }, 300);
  };

  const playAudio = (audioUrl: string): void => {
    // Mock audio play - replace with actual audio implementation
    console.log("Playing audio:", audioUrl);
    // const audio = new Audio(audioUrl);
    // audio.play().catch(console.error);
  };

  if (selectedChat) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 transition-all duration-300 ${isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-10 sm:opacity-20">
          <div className="absolute top-10 left-10 w-48 h-48 sm:w-64 sm:h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-2xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-48 h-48 sm:w-64 sm:h-64 bg-cyan-400 rounded-full mix-blend-multiply filter blur-2xl animate-pulse delay-1000" />
        </div>

        {/* Header */}
        <header className="relative z-10 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-slate-600" />
              </button>
              <Sparkles className="w-6 h-6 text-purple-600" />
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
                Chat Details
              </h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Clock className="w-4 h-4" />
              {formatTimestamp(selectedChat.timestamp)}
            </div>
          </div>
        </header>

        {/* Chat Detail Content */}
        <main className="flex-1 relative z-0 overflow-hidden">
          <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Question Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Your Question</h3>
                  <p className="text-slate-700 text-base leading-relaxed">{selectedChat.question}</p>
                </div>
              </div>
            </div>

            {/* Original Response Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">AI Response</h3>
                  <p className="text-slate-700 text-base leading-relaxed">{selectedChat.generatedText}</p>
                </div>
              </div>
            </div>

            {/* Translated Response Card */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-slate-800">
                      Translated to {selectedChat.language}
                    </h3>
                    <button
                      onClick={() => playAudio(selectedChat.audioUrl)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors text-sm text-purple-700"
                    >
                      <Volume2 className="w-4 h-4" />
                      Play Audio
                    </button>
                  </div>
                  <p className="text-slate-700 text-base leading-relaxed">{selectedChat.translatedText}</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 transition-all duration-300 ${isAnimating ? 'scale-105 opacity-0' : 'scale-100 opacity-100'}`}>
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
              Chat History
            </h1>
          </div>
          <div className="text-sm text-slate-600">
            {chatHistory.length} conversations
          </div>
        </div>
      </header>

      {/* History Grid */}
      <main className="relative z-0 p-6">
        <div className="max-w-7xl mx-auto">
          {chatHistory.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 mb-2">No conversations yet</h3>
              <p className="text-slate-500">Start chatting to see your history here!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chatHistory.map((chat: Chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleCardClick(chat)}
                  className="bg-white border border-slate-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 hover:border-purple-300 group relative"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-medium text-purple-600">{chat.language}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      {formatTimestamp(chat.timestamp)}
                    </div>
                  </div>

                  {/* Question Preview */}
                  <h3 className="text-lg font-semibold text-slate-800 mb-3 group-hover:text-purple-700 transition-colors">
                    {chat.question.length > 60 ? `${chat.question.slice(0, 60)}...` : chat.question}
                  </h3>

                  {/* Response Preview */}
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {chat.generatedText.length > 120 ? `${chat.generatedText.slice(0, 120)}...` : chat.generatedText}
                  </p>

                  {/* Card Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-xs text-slate-500">Translated</span>
                    </div>
                    <button
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        playAudio(chat.audioUrl);
                      }}
                      className="p-1.5 hover:bg-purple-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Volume2 className="w-4 h-4 text-purple-600" />
                    </button>
                  </div>

                  {/* Hover Effect Indicator */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ChatHistory;