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
  ChevronRight,
  Upload,
  MessageCircle,
  Brain,
  Headphones,
  Languages,
  BookOpen,
  Video,
  FileImage,
  Check,
  Heart,
  Github,
  Twitter,
  Mail,
  Linkedin,
  Instagram
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
            <SignedIn>
              <Link href='/dashboard'>
            <button className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <Zap className="w-6 h-6" />
                <span>Start Learning Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
            </Link>
            </SignedIn>
             <SignedOut>

            <Link href='/sign-in'>
            <button className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <Zap className="w-6 h-6" />
                <span>Start Learning Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
            </Link>
             </SignedOut>
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
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-20">
            {[
             
              { number: "15+", label: "Languages" },
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

        {/* Detailed Features Section */}
        <DetailedFeaturesSection />

        {/* How It Works Section */}
        <HowItWorksSection />

        {/* Benefits Section */}
        <BenefitsSection />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

const DetailedFeaturesSection = () => {
  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-6">
          Powerful Features for Enhanced Learning
        </h2>
        <p className="text-xl text-slate-300 max-w-3xl mx-auto">
          Our AI-powered platform transforms how you consume and understand educational content
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        {/* Video Upload Feature */}
        <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-500">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Video className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Video Upload & Analysis</h3>
              <p className="text-emerald-400 font-medium">AI-Powered Content Extraction</p>
            </div>
          </div>
          
          <div className="space-y-4 text-slate-300">
            <p className="text-lg leading-relaxed">
              Upload any educational video and watch as our advanced AI analyzes every frame, extracting key concepts, 
              identifying important topics, and creating comprehensive explanations that go beyond surface-level understanding.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {[
                "Automatic transcript generation",
                "Key concept identification",
                "Visual element analysis",
                "Chapter-wise breakdown",
               
              
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PDF Upload Feature */}
        <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-500">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">PDF Document Processing</h3>
              <p className="text-cyan-400 font-medium">Deep Content Understanding</p>
            </div>
          </div>
          
          <div className="space-y-4 text-slate-300">
            <p className="text-lg leading-relaxed">
              Transform static PDF documents into interactive learning experiences. Our AI reads, understands, and explains 
              complex concepts from textbooks, research papers, and study materials with human-like comprehension.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {[
                "Text extraction & parsing",
                "Context-aware explanations",
              
                "Formula breakdown",
                "Summary generation",
                "Smart highlighting"
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ask Anything Feature */}
      <div className="relative bg-gradient-to-r from-emerald-500/10 to-teal-500/10 backdrop-blur-sm border border-emerald-500/20 rounded-3xl p-8 mb-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white">Ask Anything, Learn Everything</h3>
          </div>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
            Have questions about your uploaded content? Our AI assistant is ready to provide detailed explanations, 
            clarify complex concepts, and help you dive deeper into any topic. It's like having a personal tutor 
            available 24/7 who knows your study material inside and out.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Brain,
              title: "Deep Understanding",
              description: "AI comprehends context and nuances in your questions",
              color: "from-purple-400 to-pink-400"
            },
            {
              icon: Headphones,
              title: "Voice-Enabled",
              description: "Ask questions and receive audio responses for hands-free learning",
              color: "from-cyan-400 to-blue-400"
            },
            {
              icon: Languages,
              title: "Multilingual Support",
              description: "Communicate in 50+ languages for global accessibility",
              color: "from-emerald-400 to-teal-400"
            }
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{feature.title}</h4>
                <p className="text-slate-300 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "Upload Your Content",
      description: "Drag and drop videos, PDFs, or documents. Our AI supports multiple formats and languages.",
      icon: Upload,
      color: "from-purple-500 to-pink-500"
    },
    {
      number: "02",
      title: "AI Processes & Analyzes",
      description: "Advanced algorithms extract key information, identify concepts, and prepare explanations.",
      icon: Bot,
      color: "from-cyan-500 to-blue-500"
    },
    {
      number: "03",
      title: "Get Detailed Explanations",
      description: "Receive comprehensive, voice-narrated explanations tailored to your learning style.",
      icon: BookOpen,
      color: "from-emerald-500 to-teal-500"
    },
    {
      number: "04",
      title: "Interactive Learning",
      description: "Ask questions, explore concepts deeper, and track your learning progress.",
      icon: MessageCircle,
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-6">
          How It Works
        </h2>
        <p className="text-xl text-slate-300 max-w-3xl mx-auto">
          Simple steps to transform your learning experience with AI
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={index} className="relative text-center">
              <div className="relative mb-6">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center mx-auto shadow-2xl`}>
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center text-sm font-black">
                  {step.number}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full">
                  <ArrowRight className="w-6 h-6 text-slate-500 mx-auto" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const BenefitsSection = () => {
  const benefits = [
    "Learn at your own pace with personalized AI explanations",
    "Break down complex topics into digestible insights",
    "Access multilingual support for global learning",
    "Voice narration for auditory learners",
    
   
  ];

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
      <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 backdrop-blur-sm border border-emerald-500/20 rounded-3xl p-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-6">
            Why Choose HelperAI?
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Experience the future of personalized learning with cutting-edge AI technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-white" />
              </div>
              <p className="text-slate-300 font-medium">{benefit}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="relative z-10 bg-slate-900/50 backdrop-blur-sm border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 shadow-lg"></div>
              <h3 className="text-2xl font-black text-white">
                Helper<span className="text-emerald-400">AI</span>
              </h3>
            </div>
            <p className="text-slate-300 mb-6 max-w-md">
              Revolutionizing education with AI-powered learning assistance. 
              Upload, learn, and excel with personalized explanations in any language.
            </p>
            <div className="flex items-center gap-4">
              <Link href="https://www.instagram.com/__saumya14__/" className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5 text-slate-300" />
              </Link>
              <Link href="https://github.com/saumya-14" className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <Github className="w-5 h-5 text-slate-300" />
              </Link>
              <Link href="https://www.linkedin.com/in/saumya-sh/" className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <Linkedin className="w-5 h-5 text-slate-300" />
              </Link>
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-white font-bold mb-4">Features</h4>
            <ul className="space-y-2 text-slate-300">
              <li>Video Analysis</li>
              <li>PDF Processing</li>
              <li>Voice Narration</li>
              <li>Multilingual Support</li>
            </ul>
          </div>

          {/* Support */}
    
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-300">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-400" />
            <span>by</span>
            <span className="font-bold text-emerald-400">Saumya Shrivastava</span>
          </div>
          
          <div className="text-slate-400 text-sm">
            © 2025 HelperAI. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

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

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <SignedOut>
            <Link href='/sign-in'>
             <button className="bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 rounded-xl text-white font-medium transition-colors">
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