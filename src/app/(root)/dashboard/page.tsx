"use client";
import React, { useState } from "react";
import { Video, FileText, Bot, Mic, Play, Upload, Sparkles, TrendingUp, Zap, Volume2 } from "lucide-react";

const Page = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const cards = [
    {
      id: 1,
      title: "Video Explanation Hub",
      description: "Transform complex topics into engaging videos with AI-powered dubbing in multiple languages and crystal-clear explanations",
      icon: Video,
      gradient: "from-red-500 to-orange-500",
      bgGradient: "from-red-50 to-orange-50",
      hoverGradient: "from-red-100 to-orange-100",
      iconColor: "text-red-600",
      stats: "24 videos created",
      features: ["AI Dubbing", "Multi-language", "HD Export"]
    },
    {
      id: 2,
      title: "Voice-Enabled PDFs",
      description: "Convert documents into interactive voice explanations with natural speech synthesis and smart content analysis",
      icon: FileText,
      gradient: "from-blue-500 to-indigo-500",
      bgGradient: "from-blue-50 to-indigo-50",
      hoverGradient: "from-blue-100 to-indigo-100",
      iconColor: "text-blue-600",
      stats: "15 PDFs processed",
      features: ["Voice Synthesis", "Smart Analysis", "Interactive"]
    },
    {
      id: 3,
      title: "AI Explanation Engine",
      description: "Leverage advanced AI to break down complex concepts into digestible explanations with personalized learning paths",
      icon: Bot,
      gradient: "from-purple-500 to-violet-500",
      bgGradient: "from-purple-50 to-violet-50",
      hoverGradient: "from-purple-100 to-violet-100",
      iconColor: "text-purple-600",
      stats: "128 explanations ready",
      features: ["Smart Learning", "Personalized", "Adaptive"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-red-400 to-orange-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-bl from-blue-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-tr from-purple-400 to-violet-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-40 right-1/3 w-64 h-64 bg-gradient-to-tl from-emerald-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-3000"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-10 w-4 h-4 bg-red-400 rounded-full animate-bounce delay-100"></div>
        <div className="absolute top-1/3 right-20 w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-300"></div>
        <div className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-500"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-16">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full text-sm font-bold mb-8 shadow-2xl border border-white/20">
            <Bot className="w-5 h-5" />
            AI Helper Dashboard
            <Sparkles className="w-4 h-4 ml-1" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-slate-800 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8 leading-tight">
            Explain Everything
            <br />
            <span className="bg-gradient-to-r from-red-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              with AI Power
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed mb-8">
            Transform any content into engaging video explanations, voice-enabled PDFs, and interactive AI tutorials. 
            Your personal AI assistant for learning and teaching.
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
              <Volume2 className="w-4 h-4 text-red-500" />
              <span className="font-semibold">Multi-language Dubbing</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
              <Mic className="w-4 h-4 text-blue-500" />
              <span className="font-semibold">Voice Synthesis</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
              <Bot className="w-4 h-4 text-purple-500" />
              <span className="font-semibold">Smart AI Analysis</span>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-20">
          {cards.map((card) => {
            const Icon = card.icon;
            const isHovered = hoveredCard === card.id;
            
            return (
              <div
                key={card.id}
                className={`group relative overflow-hidden rounded-3xl p-8 cursor-pointer transition-all duration-500 transform hover:scale-105 hover:-translate-y-4 ${
                  isHovered ? `bg-gradient-to-br ${card.hoverGradient}` : `bg-gradient-to-br ${card.bgGradient}`
                } border-2 border-white/60 backdrop-blur-xl shadow-2xl hover:shadow-3xl min-h-[450px] flex flex-col`}
                onMouseEnter={() => setHoveredCard(card.id as any)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Animated Border Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl`}></div>
                <div className="absolute inset-[3px] bg-white/95 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                  {/* Icon with Glow Effect */}
                  <div className={`inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br ${card.gradient} mb-6 group-hover:scale-110 transition-transform duration-300 shadow-2xl relative`}>
                    <Icon className="w-12 h-12 text-white" />
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300`}></div>
                  </div>
                  
                  {/* Stats Badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`inline-flex items-center gap-2 ${card.iconColor} text-sm font-bold bg-white/90 px-4 py-2 rounded-full shadow-lg`}>
                      <TrendingUp className="w-4 h-4" />
                      {card.stats}
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-slate-900 transition-colors">
                    {card.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-base text-slate-600 leading-relaxed mb-6 group-hover:text-slate-700 transition-colors flex-grow">
                    {card.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {card.features.map((feature, index) => (
                      <span key={index} className="text-xs font-semibold bg-white/70 text-slate-700 px-3 py-1 rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  
                </div>

                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-3xl"></div>
              </div>
            );
          })}
        </div>

        
        {/* Bottom CTA */}
        <div className="text-center">
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Ready to revolutionize how you explain complex topics? Let's create something amazing together.
          </p>
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-12 py-5 rounded-full text-lg font-bold hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 border-2 border-white/20">
            <Sparkles className="w-6 h-6" />
            Start Your AI Journey
            <Zap className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;