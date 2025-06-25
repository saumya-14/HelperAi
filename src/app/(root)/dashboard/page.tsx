"use client";
import React, { useState } from "react";
import { BarChart3, PenTool, Settings, Sparkles, TrendingUp, Zap } from "lucide-react";

const Page = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const cards = [
    {
      id: 1,
      title: "Analytics Hub",
      description: "Deep dive into performance metrics with real-time insights and comprehensive data visualization",
      icon: BarChart3,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      hoverGradient: "from-purple-100 to-pink-100",
      iconColor: "text-purple-600",
      stats: "+24% this month"
    },
    {
      id: 2,
      title: "Content Studio",
      description: "Craft compelling stories with AI-powered writing tools and advanced editing features",
      icon: PenTool,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      hoverGradient: "from-blue-100 to-cyan-100",
      iconColor: "text-blue-600",
      stats: "12 drafts ready"
    },
    {
      id: 3,
      title: "Control Center",
      description: "Fine-tune every aspect of your digital workspace with advanced configuration options",
      icon: Settings,
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50",
      hoverGradient: "from-emerald-100 to-teal-100",
      iconColor: "text-emerald-600",
      stats: "3 updates available"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-bl from-blue-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-tr from-emerald-400 to-teal-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-16">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-lg">
            <Sparkles className="w-4 h-4" />
            Welcome to your workspace
          </div>
          
          <h1 className="text-2xl md:text-6xl font-black bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 bg-clip-text text-transparent mb-8 leading-tight">
            Ready to create
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              something amazing?
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Your digital command center awaits. Choose your next adventure and let's build something extraordinary together.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {cards.map((card) => {
            const Icon = card.icon;
            const isHovered = hoveredCard === card.id;
            
            return (
              <div
                key={card.id}
                className={`group relative overflow-hidden rounded-3xl p-8 cursor-pointer transition-all duration-500 transform hover:scale-105 hover:-translate-y-3 ${
                  isHovered ? `bg-gradient-to-br ${card.hoverGradient}` : `bg-gradient-to-br ${card.bgGradient}`
                } border border-white/50 backdrop-blur-sm shadow-xl hover:shadow-2xl min-h-[400px] flex flex-col`}
                onMouseEnter={() => setHoveredCard(card.id as any)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Gradient Border Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl`}></div>
                <div className="absolute inset-[2px] bg-white rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${card.gradient} mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  
                  {/* Stats Badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`inline-flex items-center gap-2 ${card.iconColor} text-sm font-semibold bg-white/80 px-3 py-1 rounded-full`}>
                      <TrendingUp className="w-4 h-4" />
                      {card.stats}
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-slate-900 transition-colors">
                    {card.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-base text-slate-600 leading-relaxed mb-8 group-hover:text-slate-700 transition-colors flex-grow">
                    {card.description}
                  </p>
                  
                  {/* Action Button */}
                  <div className="flex items-center gap-3 text-base text-slate-700 font-semibold group-hover:text-slate-900 transition-colors mt-auto">
                    <span>Get started</span>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-slate-400 to-slate-600 flex items-center justify-center group-hover:from-slate-600 group-hover:to-slate-800 transition-all duration-300 group-hover:scale-110">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <p className="text-base text-slate-500 mb-8">
            Need help getting started? We're here to guide you every step of the way.
          </p>
          <button className="inline-flex items-center gap-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white px-10 py-4 rounded-full text-base font-semibold hover:from-slate-900 hover:to-black transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105">
            <Sparkles className="w-5 h-5" />
            Explore all features
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;