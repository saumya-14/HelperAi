"use client";

import React, { useState, useEffect } from "react";
import {
  Home, BarChart3, PenTool, Users, FileText, Calendar, MessageSquare,
  Bell, Settings, Search, Plus, ChevronLeft, ChevronRight, LogOut, User, Sparkles, Menu, X
} from "lucide-react";
import Link from "next/link";

const ModernSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsCollapsed(false); // Always expanded on mobile when open
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event:any) => {
      if (isMobile && isMobileOpen && !event.target.closest('.sidebar-container')) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isMobileOpen]);
const menuItems = [
  { id: "dashboard", title: "Dashboard", icon: Home, gradient: "from-purple-500 to-pink-500", badge: null, path: "/dashboard" },
  { id: "Chat", title: "Chat", icon: MessageSquare, gradient: "from-cyan-500 to-blue-500", badge: "", path: "/dashboard/chat" },
  { id: "Chat history", title: "Chat History", icon: MessageSquare, gradient: "from-cyan-500 to-blue-500", badge: "", path: "/chat-history" },
  { id: "PDF Explainer", title: "PDF Explainer", icon: BarChart3, gradient: "from-blue-500 to-cyan-500", badge: "", path: "/dashboard/pdf-explainer" },
  { id: "PDF History", title: "PDF History", icon: PenTool, gradient: "from-emerald-500 to-teal-500", badge: "", path: "/pdf-history" },
  { id: "Video Explainer", title: "Video Explainer", icon: Users, gradient: "from-orange-500 to-red-500", badge: null, path: "/video-explainer" },
  { id: "Video History", title: "Video History", icon: FileText, gradient: "from-indigo-500 to-purple-500", badge: null, path: "/video-history" },
];

  const bottomItems = [
    { id: "notifications", title: "Notifications", icon: Bell, gradient: "from-yellow-500 to-orange-500", badge: "5" },
    { id: "settings", title: "Settings", icon: Settings, gradient: "from-slate-500 to-slate-600", badge: null },
  ];

  const handleItemClick = (itemId:any) => {
    setActiveItem(itemId);
    if (isMobile) {
      setIsMobileOpen(false); 
    }
  };

  const sidebarWidth = isMobile ? "w-80" : (isCollapsed ? "w-20" : "w-64");

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 md:hidden"
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* Mobile Backdrop */}
      {isMobile && isMobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" />
      )}

      {/* Sidebar */}
      <div className={`sidebar-container h-full flex flex-col transition-all duration-300 ease-in-out ${sidebarWidth} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 ${
        isMobile 
          ? `fixed left-0 top-0 z-50 transform ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}` 
          : 'relative'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {(!isCollapsed || isMobile) && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white shadow">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">Workspace</h2>
                <p className="text-xs text-slate-500 dark:text-gray-400">Creative Studio</p>
              </div>
            </div>
          )}
          {!isMobile && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-500 dark:text-gray-400"
            >
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          )}
          {isMobile && (
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-2 rounded hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-500 dark:text-gray-400"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Search */}
        {(!isCollapsed || isMobile) && (
          <div className="relative p-4">
            <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
  {menuItems.map((item) => {
    const Icon = item.icon;
    const isActive = activeItem === item.id;

    return (
      <Link 
        href={item.path} 
        key={item.id}
        onClick={() => handleItemClick(item.id)}
        className="block" // Important for proper link behavior
      >
        <div
          className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
            isActive
              ? "bg-gradient-to-r from-slate-100 to-slate-200 dark:from-gray-700 dark:to-gray-600 font-semibold"
              : "hover:bg-slate-100 dark:hover:bg-gray-700"
          } ${isMobile ? 'active:scale-98' : ''}`}
        >
          <div
            className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow`}
          >
            <Icon className="w-5 h-5" />
          </div>
          {(!isCollapsed || isMobile) && (
            <div className="flex justify-between items-center flex-1 min-w-0">
              <span className="text-slate-700 dark:text-white truncate">{item.title}</span>
              {item.badge && (
                <span className="text-xs px-2 py-1 bg-white dark:bg-gray-800 text-slate-600 dark:text-gray-300 rounded-full shadow-sm">
                  {item.badge}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    );
  })}
</div>
        {/* Quick Action */}
        {(!isCollapsed || isMobile) && (
          <div className="p-4">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 dark:from-purple-700 dark:to-pink-700 text-white font-semibold hover:scale-[1.02] active:scale-[0.98] transition-transform shadow hover:shadow-md">
              <Plus size={16} />
              Create New
            </button>
          </div>
        )}

        {/* Bottom Items */}
        <div className="px-2 py-2 space-y-1 border-t border-gray-200 dark:border-gray-700">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="group flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-700 active:scale-98 transition-all"
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow`}>
                  <Icon className="w-4 h-4" />
                </div>
                {(!isCollapsed || isMobile) && (
                  <div className="flex justify-between items-center flex-1 min-w-0">
                    <span className="text-slate-700 dark:text-white">{item.title}</span>
                    {item.badge && (
                      <span className="text-xs px-2 py-1 bg-white dark:bg-gray-800 text-slate-600 dark:text-gray-300 rounded-full shadow-sm">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* User Profile */}
        <div className={`flex items-center gap-3 p-4 border-t border-gray-200 dark:border-gray-700 ${isCollapsed && !isMobile ? "justify-center" : ""}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white shadow">
            <User className="w-5 h-5" />
          </div>
          {(!isCollapsed || isMobile) && (
            <>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 dark:text-white text-sm truncate">John Doe</p>
                <p className="text-xs text-slate-500 dark:text-gray-400 truncate">john@workspace.com</p>
              </div>
              <button className="hover:bg-slate-100 dark:hover:bg-gray-700 active:scale-95 p-2 rounded text-slate-500 dark:text-gray-400 transition-all">
                <LogOut className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ModernSidebar;