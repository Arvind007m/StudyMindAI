import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  Home,
  Upload,
  Brain,
  BookOpen,
  MessageSquare,
  TrendingUp,
  User,
} from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home, desc: "View your dashboard" },
  { name: "Upload Content", href: "/upload", icon: Upload, desc: "Upload new study material" },
  { name: "Study Session", href: "/study", icon: Brain, desc: "Start a study session" },
  { name: "Library", href: "/library", icon: BookOpen, desc: "Browse your library" },
  { name: "AI Tutor", href: "/tutor", icon: MessageSquare, desc: "Get help from AI Tutor" },
  { name: "Progress", href: "/progress", icon: TrendingUp, desc: "Track your progress" },
  { name: "Profile", href: "/profile", icon: User, desc: "View your profile" },
];

export default function Sidebar() {
  const [location, navigate] = useLocation();
  const [userName, setUserName] = useState("Learner");
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (user && user.fullName) setUserName(user.fullName);
    } catch {}
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="sidebar-width bg-gradient-to-b from-slate-800 to-slate-900 border-r border-slate-700 fixed h-full flex flex-col hidden lg:flex">
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">StudyMind AI</h1>
              <p className="text-xs text-slate-400">Memory-first Learning</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4 flex-1">
          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              LEARNING HUB
            </p>
            <nav className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href;
                
                return (
                  <Link key={item.name} href={item.href}>
                    <div
                      className={cn(
                        "nav-item",
                        isActive && "active"
                      )}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4">
          <div className="flex items-center space-x-3 p-3 bg-slate-800 rounded-xl mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">{userName[0]}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-slate-400">Keep learning!</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full mt-2 py-2 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 transition">Logout</button>
        </div>
      </div>

      {/* Mobile Floating Bottom Navigation Bar */}
      <TooltipProvider>
        <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 flex justify-around items-center py-2 px-2 rounded-2xl shadow-xl lg:hidden w-[95vw] max-w-xl">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            return (
              <Tooltip key={item.name} delayDuration={100}>
                <TooltipTrigger asChild>
                  <Link href={item.href}>
                    <div
                      className={cn(
                        "flex flex-col items-center justify-center text-xs px-2 py-1 rounded-md transition-all",
                        isActive ? "text-purple-400" : "text-slate-400 hover:text-white"
                      )}
                    >
                      <Icon className="w-6 h-6 mb-1" />
                      <span className="hidden xs:inline">{item.name.split(" ")[0]}</span>
                    </div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  {item.desc}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
      </TooltipProvider>
    </>
  );
}
