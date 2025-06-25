"use client";

import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Play, 
  FileText, 
  Volume2, 
  Globe, 
  ArrowRight, 
  Menu, 
  X,
  Bot,
  Zap,
  Star,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignIn, UserButton } from "@clerk/nextjs";

export function HeroSectionOne() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e:any) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0">
        {/* Animated Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-2000"></div>
        
        {/* Interactive Mouse Following Gradient */}
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 transition-all duration-1000 ease-out pointer-events-none"
          style={{
            transform: `translate(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.05}px)`,
          }}
        ></div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>

      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-20 pb-16">
        {/* Hero Content */}
        <div className="text-center mb-16">
          {/* Floating Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-2xl hover:bg-white/20 transition-all duration-300 cursor-pointer">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>AI-Powered Learning Revolution</span>
            <Star className="w-4 h-4 text-yellow-400" />
          </div>

          {/* Main Headline with Advanced Animation */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight">
            {"Supercharge your learning with your own".split(" ").map((word, index) => (
              <span
                key={index}
                className="inline-block mr-4 mb-2 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent animate-pulse"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationDuration: '2s'
                }}
              >
                {word}
              </span>
            ))}
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x bg-300% font-extrabold">
              AI Assistant
            </span>
          </h1>

          {/* Subtitle with Typewriter Effect */}
          <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto mb-12 leading-relaxed">
            Upload videos or PDFs and instantly receive{" "}
            <span className="text-emerald-400 font-semibold">multilingual</span>,{" "}
            <span className="text-cyan-400 font-semibold">voice-narrated</span> explanations 
            to deepen your understanding
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <Zap className="w-6 h-6" />
                <span>Start Learning Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

           
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: FileText,
                title: "PDF & Video Support",
                description: "Upload any learning material",
                color: "from-purple-400 to-pink-400"
              },
              {
                icon: Volume2,
                title: "Voice Narration",
                description: "AI-powered audio explanations",
                color: "from-cyan-400 to-blue-400"
              },
              {
                icon: Globe,
                title: "Multilingual",
                description: "Learn in your preferred language",
                color: "from-emerald-400 to-teal-400"
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-300">{feature.description}</p>
                </div>
              );
            })}
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {[
              { number: "10K+", label: "Active Learners" },
              { number: "50+", label: "Languages" },
              { number: "99%", label: "Accuracy Rate" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-400 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Elements */}
     
    </div>
  );
}

const Navbar = ({ isMenuOpen, setIsMenuOpen }:any) => {
  return (
    <nav className="relative z-20 max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 shadow-lg"></div>
            <div className="absolute inset-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 animate-pulse"></div>
          </div>
          <h1 className="text-2xl font-black text-white">
            Helper<span className="text-emerald-400">AI</span>
          </h1>
        </div>

        {/* Desktop Navigation */}
      

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <SignedOut>
            <Link href='/sign-in'>
             <button className="text-slate-300 hover:text-white font-medium transition-colors">
            Sign In
          </button>
            </Link>

          </SignedOut>
          
          <SignedIn>
  <div className="flex items-center gap-4">
    <Link href="/dashboard">
      <button className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105">
        <div className="flex items-center gap-2">
          Dashboard
        </div>
      </button>
    </Link>

    <UserButton />
  </div>
</SignedIn>
          
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-lg border border-white/10 rounded-2xl mt-4 mx-4 p-6">
          <div className="flex flex-col gap-4">
           
            <div className="border-t border-white/10 pt-4 mt-4">
            <SignedOut>
               <Link href='/sign-in'>
            <button className="w-full text-left text-slate-300 hover:text-white font-medium py-2 mb-3">
                Sign In
              </button>
            </Link>
            </SignedOut>
           <SignedIn>
               <Link href='/dashboard'>
            <button className="w-full text-left text-slate-300 hover:text-white font-medium py-2 mb-3">
                Dashboard
              </button>

              <UserButton/>
            </Link>
            </SignedIn>
            
              
             
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};