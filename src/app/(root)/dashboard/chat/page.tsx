"use client";
import React, { useState, useRef, useEffect } from "react";
import { Send, ChevronDown, Globe, User, Bot, Sparkles } from "lucide-react";

const ChatInterface = () => {
  const [messages, setMessages] = useState<
    { id: number; type: string; content: string; timestamp: Date }[]
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

  const [languages, setLanguages] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Fetch available languages once
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const res = await fetch('/api/voices');
        const data = await res.json();
        if (Array.isArray(data.languages) && data.languages.length > 0) {
          setLanguages(data.languages);
          setSelectedLanguage(prev => prev || data.languages[0]);
        }
      } catch (error) {
        console.error('Failed to fetch languages:', error);
        const fallback = ['English', 'Spanish', 'French', 'German', 'Italian'];
        setLanguages(fallback);
        setSelectedLanguage(prev => prev || fallback[0]);
      }
    };
    fetchLanguages();
  }, []);

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setIsLanguageDropdownOpen(false);
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    const newUserMessage = {
      id: Date.now(),
      type: 'user',
      content: inputText,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newUserMessage]);
    setInputText('');
    setIsTyping(true);

    // Mock bot response
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: `I understand you're communicating in ${selectedLanguage}. Here's my response to: "${newUserMessage.content}".`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
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
                <p className="text-xs mt-2 text-right">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
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
              placeholder={`Type your message${selectedLanguage ? ` in ${selectedLanguage}` : ''}...`}
              className="flex-1 resize-none outline-none bg-transparent text-slate-800 placeholder-slate-500 text-base min-h-[20px] max-h-[120px]"
              rows={1}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-slate-500 text-center mt-2">
            <span className="hidden sm:inline">Press Enter to send, Shift+Enter for newline • </span>
            <span className="sm:hidden">Tap send • </span>
            Language: {selectedLanguage || 'None'}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ChatInterface;
