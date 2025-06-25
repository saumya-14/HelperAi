import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { BackgroundGradientAnimationDemo } from "@/components/bggradient"
import Sidebar from "@/components/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50"> {/* 🔧 Added background color */}
      {/* Sidebar - Fixed position, hidden on mobile */}
      <div className=" lg:fixed lg:left-0 lg:top-0 lg:h-full lg:block z-20"> {/* 🔧 Responsive visibility */}
        <Sidebar 
        
        />
      </div>

      {/* Main content area */}
      <main className="lg:ml-64 min-h-screen "> {/* 🔧 Responsive margin and padding */}
        <div className=""> {/* 🔧 Content wrapper */}
          {children}

          
        </div>
      </main>
    </div>
  );
}