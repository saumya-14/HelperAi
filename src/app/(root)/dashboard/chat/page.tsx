"use client";
import React, { useState, useRef, useEffect } from "react";
import { Send, ChevronDown, Globe, User, Bot, Sparkles, Volume2 } from "lucide-react";

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
];

const ChatInterface = () => {
  const [messages, setMessages] = useState<
    { id: number; type: string; content: string; timestamp: Date; audioUrl?: string }[]
  >([]);

  // Initialize with a greeting
  useEffect(() => {
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: "Hello! I'm your AI assistant. How can I help you today?",
        timestamp: new Date(),
      },
    ]);
  }, []);

  // Fixed: Store selected language as object, not string
  const [selectedLanguage, setSelectedLanguage] = useState<typeof destinationLanguages[0] | null>(null);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Fixed: Handle language selection properly
  const handleLanguageSelect = (langObj: typeof destinationLanguages[0]) => {
    setSelectedLanguage(langObj);
    setIsLanguageDropdownOpen(false);
  };

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

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

  // Fixed: Handle send message with proper null checks
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Check if language is selected
    if (!selectedLanguage) {
      alert("Please select a language first!");
      return;
    }

    const newUserMessage = { 
      id: Date.now(), 
      type: "user", 
      content: inputText, 
      timestamp: new Date() 
    };
    
    setMessages((m) => [...m, newUserMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: newUserMessage.content,
          targetLanguage: selectedLanguage.targetLocale,
          voiceId: selectedLanguage.voiceId,
        }),
      });

      if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
      }

      const data = await res.json();

      const botContent = `🎧 ${selectedLanguage.language}: ${data.translated || data.original}`;
      const botMessage = { 
        id: Date.now() + 1, 
        type: "bot", 
        content: botContent, 
        timestamp: new Date(),
        audioUrl: data.audio || undefined
      };
      
      setMessages((m) => [...m, botMessage]);
      setIsTyping(false);

      // Save chat
      await fetch("/api/save-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: newUserMessage.content,
          generatedText: data.original,
          translatedText: data.translated,
          voiceId: selectedLanguage.voiceId,
          audioUrl: data.audio,
        }),
      });
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages((m) => [
        ...m,
        { 
          id: Date.now() + 2, 
          type: "bot", 
          content: "Sorry, something went wrong. Please try again. 😞", 
          timestamp: new Date() 
        },
      ]);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const adjustTextareaHeight = () => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
    }
  };
  useEffect(adjustTextareaHeight, [inputText]);

  // Fixed: Play audio function
  const playAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play().catch(err => {
      console.error("Error playing audio:", err);
      alert("Failed to play audio. The audio file might not be available.");
    });
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
              AI Assistant
            </h1>
          </div>
          <div className="relative language-dropdown">
            <button
              type="button"
              onClick={toggleDropdown}
              className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50"
            >
              <Globe className="w-5 h-5 text-slate-600" />
              <span className="text-sm text-slate-700">
                {selectedLanguage?.language || 'Select Language'}
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
                    className={`w-full px-4 py-2 text-sm text-left hover:bg-purple-50 transition-colors ${
                      selectedLanguage?.language === lang.language ? 'bg-purple-100 font-medium text-purple-700' : 'text-slate-700'
                    }`}
                  >
                    {lang.language}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 relative z-0 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full overflow-y-auto p-6 space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-end gap-3 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.type === 'bot' && (
                <Bot className="w-8 h-8 text-pink-600" />
              )}
              <div
                className={`max-w-[75%] p-4 rounded-2xl ${
                  msg.type === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-800 shadow'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <p className="text-xs mt-2 text-right opacity-70">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>

                {/* Fixed: Audio button for bot messages */}
                {msg.type === 'bot' && msg.audioUrl && (
                  <button
                    onClick={() => playAudio(msg.audioUrl!)}
                    className="mt-2 flex items-center gap-1 text-purple-600 hover:text-purple-800 transition text-sm"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Play Audio</span>
                  </button>
                )}
              </div>
              {msg.type === 'user' && (
                <User className="w-8 h-8 text-cyan-600" />
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-3">
              <Bot className="w-8 h-8 text-pink-600" />
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="relative z-10 border-t border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-end gap-3 bg-white border border-slate-200 rounded-2xl p-3 focus-within:ring-2 focus-within:ring-purple-500/20">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Type your message${selectedLanguage ? ` (will be translated to ${selectedLanguage.language})` : ''}...`}
              className="flex-1 resize-none outline-none bg-transparent text-slate-800 placeholder-slate-500 text-base min-h-[20px] max-h-[120px]"
              rows={1}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || !selectedLanguage}
              className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-slate-500 text-center mt-2">
            <span className="hidden sm:inline">Press Enter to send, Shift+Enter for newline • </span>
            <span className="sm:hidden">Tap send • </span>
            Language: {selectedLanguage?.language || 'None selected'}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ChatInterface;